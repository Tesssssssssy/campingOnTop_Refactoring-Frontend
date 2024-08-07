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
        let isOfferer = false;
        let iceCandidatesQueue = [];

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
                if (event.streams && event.streams[0]) {
                    remoteVideo.value.srcObject = event.streams[0];
                }
            };

            peerConnection.onnegotiationneeded = async () => {
                if (isOfferer) {
                    try {
                        await waitForStableState();
                        const offer = await peerConnection.createOffer();
                        await peerConnection.setLocalDescription(offer);
                        videoChatStore.sendVideoSignal('video-offer', peerConnection.localDescription, videoChatStore.videoChatRoomId);
                    } catch (err) {
                        console.error('Error creating offer:', err);
                    }
                }
            };

            peerConnection.oniceconnectionstatechange = () => {
                if (peerConnection.iceConnectionState === 'failed') {
                    peerConnection.restartIce();
                }
            };

            localStream.getTracks().forEach(track => {
                peerConnection.addTrack(track, localStream);
            });
        };

        const startCall = async () => {
            try {
                localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                localVideo.value.srcObject = localStream;
                isOfferer = true;
                createPeerConnection();
            } catch (error) {
                console.error('Error starting call:', error);
            }
        };

        const handleVideoOfferMsg = async (msg) => {
            if (peerConnection) peerConnection.close();
            createPeerConnection();

            const offer = new RTCSessionDescription(msg.payload);
            try {
                await waitForStableState();
                await peerConnection.setRemoteDescription(offer);
                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);
                videoChatStore.sendVideoSignal('video-answer', peerConnection.localDescription, videoChatStore.videoChatRoomId);
                processQueuedIceCandidates();
            } catch (error) {
                console.error('Error handling video offer:', error);
            }
        };

        const handleVideoAnswerMsg = async (msg) => {
            const answer = new RTCSessionDescription(msg.payload);
            try {
                await waitForStableState();
                await peerConnection.setRemoteDescription(answer);
                processQueuedIceCandidates();
            } catch (error) {
                console.error('Error handling video answer:', error);
            }
        };

        const handleNewICECandidateMsg = async (msg) => {
            const candidate = new RTCIceCandidate(msg.payload);
            try {
                if (peerConnection.remoteDescription === null) {
                    console.warn('Remote description is not set, queuing ICE candidate');
                    iceCandidatesQueue.push(candidate);
                    return;
                }
                await peerConnection.addIceCandidate(candidate);
            } catch (error) {
                console.error('Error handling new ICE candidate:', error);
            }
        };

        const processQueuedIceCandidates = async () => {
            while (iceCandidatesQueue.length > 0) {
                const candidate = iceCandidatesQueue.shift();
                await peerConnection.addIceCandidate(candidate);
            }
        };

        const waitForStableState = async () => {
            return new Promise(resolve => {
                const checkState = setInterval(() => {
                    if (peerConnection.signalingState === 'stable') {
                        clearInterval(checkState);
                        resolve();
                    }
                }, 100);
            });
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

            videoChatStore.addVideoChatListener(async (msg) => {
                switch (msg.type) {
                    case 'video-offer':
                        await handleVideoOfferMsg(msg);
                        break;
                    case 'video-answer':
                        await handleVideoAnswerMsg(msg);
                        break;
                    case 'new-ice-candidate':
                        await handleNewICECandidateMsg(msg);
                        break;
                }
            });

            await videoChatStore.connectToWebSocket(videoChatStore.videoChatRoomId);

            if (videoChatRoom) {
                isOfferer = userId === videoChatRoom.buyerId;
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