<template>
    <div class="video-chat-page">
        <header class="video-chat-header">화상 채팅</header>
        <div class="video-container">
            <div class="video-wrapper">
                <span class="nickname">{{ localNickname }}</span>
                <video ref="localVideo" autoplay playsinline muted></video>
            </div>
            <div class="video-wrapper">
                <span class="nickname">{{ remoteNickname }}</span>
                <video ref="remoteVideo" autoplay playsinline></video>
            </div>
        </div>
        <button @click="endCall" class="end-call-button">통화 종료</button>
    </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useVideoChatStore } from "@/stores/useVideoChatStore";
import { useMemberStore } from "@/stores/useMemberStore";

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const videoChatStore = useVideoChatStore();
        const memberStore = useMemberStore();
        const localVideo = ref(null);
        const remoteVideo = ref(null);
        const localNickname = ref('');
        const remoteNickname = ref('');
        let localStream = null;
        let peerConnection = null;
        let isMakingOffer = false;
        let iceCandidateQueue = [];
        let isSettingRemoteDescription = false;

        const configuration = {
            iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        };

        const createPeerConnection = () => {
            peerConnection = new RTCPeerConnection(configuration);

            peerConnection.onicecandidate = (event) => {
                if (event.candidate) {
                    videoChatStore.sendVideoSignal('new-ice-candidate', event.candidate, videoChatStore.videoChatRoomId);
                }
            };

            peerConnection.ontrack = (event) => {
                if (remoteVideo.value.srcObject !== event.streams[0]) {
                    remoteVideo.value.srcObject = event.streams[0];
                    console.log('Remote stream added:', event.streams[0]);
                }
            };

            peerConnection.onnegotiationneeded = async () => {
                if (isMakingOffer) return;
                isMakingOffer = true;
                try {
                    const offer = await peerConnection.createOffer();
                    if (peerConnection.signalingState !== 'stable') return;
                    await peerConnection.setLocalDescription(offer);
                    videoChatStore.sendVideoSignal('video-offer', peerConnection.localDescription, videoChatStore.videoChatRoomId);
                } catch (error) {
                    console.error('Error during negotiation:', error);
                } finally {
                    isMakingOffer = false;
                }
            };

            peerConnection.oniceconnectionstatechange = () => {
                console.log('ICE connection state change:', peerConnection.iceConnectionState);
                if (peerConnection.iceConnectionState === 'failed') {
                    peerConnection.restartIce();
                }
            };

            peerConnection.onsignalingstatechange = () => {
                console.log('Signaling state change:', peerConnection.signalingState);
            };

            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        };

        const startCall = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localVideo.value.srcObject = localStream;
                createPeerConnection();
            } catch (error) {
                console.error('Error starting call:', error);
            }
        };

        const handleVideoOfferMsg = async (msg) => {
            const offer = new RTCSessionDescription(msg.payload);
            try {
                if (peerConnection.signalingState !== 'stable') {
                    await Promise.all([
                        peerConnection.setLocalDescription({ type: 'rollback' }),
                        peerConnection.setRemoteDescription(offer)
                    ]);
                } else {
                    await peerConnection.setRemoteDescription(offer);
                }
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                videoChatStore.sendVideoSignal('video-answer', peerConnection.localDescription, videoChatStore.videoChatRoomId);
                await addIceCandidatesFromQueue();
            } catch (error) {
                console.error('Error handling video offer:', error);
            }
        };

        const handleVideoAnswerMsg = async (msg) => {
            if (isSettingRemoteDescription) {
                console.log("Remote description is already being set, skipping");
                return;
            }

            isSettingRemoteDescription = true;
            const answer = new RTCSessionDescription(msg.payload);
            try {
                if (peerConnection.signalingState === 'have-local-offer') {
                    await peerConnection.setRemoteDescription(answer);
                    await addIceCandidatesFromQueue();
                } else {
                    console.log("Signaling state is not 'have-local-offer', skipping setting remote description");
                }
            } catch (error) {
                console.error('Error handling video answer:', error);
            } finally {
                isSettingRemoteDescription = false;
            }
        };

        const handleNewICECandidateMsg = async (msg) => {
            const candidate = new RTCIceCandidate(msg.payload);
            try {
                if (peerConnection.remoteDescription) {
                    await peerConnection.addIceCandidate(candidate);
                } else {
                    iceCandidateQueue.push(candidate);
                }
            } catch (error) {
                console.error('Error handling new ICE candidate:', error);
            }
        };

        const addIceCandidatesFromQueue = async () => {
            while (iceCandidateQueue.length > 0) {
                const candidate = iceCandidateQueue.shift();
                try {
                    await peerConnection.addIceCandidate(candidate);
                } catch (error) {
                    console.error('Error adding ICE candidate from queue:', error);
                }
            }
        };

        const endCall = () => {
            if (peerConnection) {
                peerConnection.close();
                peerConnection = null;
            }
            if (localStream) {
                localStream.getTracks().forEach(track => track.stop());
                localStream = null;
            }
            videoChatStore.disconnectWebSocket();
            router.push('/chatRooms');
        };

        onMounted(async () => {
            const userId = memberStore.decodedToken.id;
            const videoChatRoom = await videoChatStore.getVideoChatRoomById(route.params.roomId);
            localNickname.value = memberStore.decodedToken.nickname;
            remoteNickname.value = userId === videoChatRoom.buyerId ? videoChatRoom.sellerNickname : videoChatRoom.buyerNickname;

            videoChatStore.addVideoChatListener((msg) => {
                switch (msg.type) {
                    case 'video-offer':
                        handleVideoOfferMsg(msg);
                        break;
                    case 'video-answer':
                        handleVideoAnswerMsg(msg);
                        break;
                    case 'new-ice-candidate':
                        handleNewICECandidateMsg(msg);
                        break;
                }
            });

            await videoChatStore.connectToWebSocket(videoChatStore.videoChatRoomId);

            if (videoChatRoom) {
                startCall();
            }
        });

        onUnmounted(() => {
            videoChatStore.removeVideoChatListener(handleVideoOfferMsg);
            videoChatStore.removeVideoChatListener(handleVideoAnswerMsg);
            videoChatStore.removeVideoChatListener(handleNewICECandidateMsg);
            endCall();
        });

        return { localVideo, remoteVideo, localNickname, remoteNickname, endCall };
    }
};
</script>



<style scoped>
.video-chat-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 300px;
}

.video-container {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin-bottom: 20px;
}

.video-wrapper {
    position: relative;
    width: 45%;
    margin: 0 10px;
}

video {
    width: 100%;
}

.nickname {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    padding: 5px 10px;
    border-radius: 5px;
}

.end-call-button {
    background-color: red;
    color: white;
    padding: 10px;
    border: none;
    cursor: pointer;
}

.end-call-button:hover {
    background-color: darkred;
}
</style>