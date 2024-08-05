import { defineStore } from 'pinia';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ref } from 'vue';

const backend = process.env.VUE_APP_LOCAL_URL;

export const useVideoChatStore = defineStore('videoChat', {
    state: () => ({
        stompClient: null,
        messages: ref([]),
        videoChatRoomId: null,
        userId: null,
        userNickname: '',
        videoChatListeners: []
    }),
    actions: {
        async findExistingVideoChatRoom(user1Id, user2Id, houseId) {
            const response = await axios.get(`${backend}/video-chat/room/${user1Id}/${user2Id}/${houseId}`);
            return response.data.id;
        },
        async createOrJoinVideoChatRoom(user1Id, user1Nickname, user2Id, user2Nickname, houseId) {
            let videoChatRoomId = await this.findExistingVideoChatRoom(user1Id, user2Id, houseId);
            if (videoChatRoomId) {
                console.log('Existing video chat room:', videoChatRoomId);
                return videoChatRoomId;
            }

            const response = await axios.post(`${backend}/video-chat/room`, {
                buyerId: user1Id,
                buyerNickname: user1Nickname,
                sellerId: user2Id,
                sellerNickname: user2Nickname,
                houseId
            });
            this.videoChatRoomId = response.data.id;
            this.userId = user1Id;
            this.userNickname = user1Nickname;
            await this.connectToWebSocket(this.videoChatRoomId);
            return response.data.id;
        },
        async getVideoChatRoomById(videoChatRoomId) {
            const response = await axios.get(`${backend}/video-chat/room/${videoChatRoomId}`);
            return response.data;
        },
        connectToWebSocket(videoChatRoomId) {
            if (this.stompClient && this.stompClient.connected) {
                console.log('Already connected to WebSocket');
                return;
            }

            const socket = new SockJS(`${backend}/ws`);
            this.stompClient = new Client({
                webSocketFactory: () => socket,
                onConnect: () => {
                    this.stompClient.subscribe(`/topic/video-chat/${videoChatRoomId}`, (message) => {
                        const msg = JSON.parse(message.body);
                        if (msg.type === 'video-offer' || msg.type === 'video-answer' || msg.type === 'new-ice-candidate') {
                            this.videoChatListeners.forEach(listener => listener(msg));
                        } else {
                            this.messages.value.push(msg);
                        }
                    });
                },
                onStompError: (error) => {
                    console.error('Stomp Error', error);
                },
                onWebSocketClose: () => {
                    console.error('WebSocket connection closed. Retrying in 5 seconds...');
                    setTimeout(() => {
                        this.connectToWebSocket(videoChatRoomId);
                    }, 5000);
                },
                reconnectDelay: 5000,
            });
            this.stompClient.activate();
        },
        disconnectWebSocket() {
            if (this.stompClient) {
                this.stompClient.deactivate();
            }
        },
        addVideoChatListener(listener) {
            this.videoChatListeners.push(listener);
        },
        removeVideoChatListener(listener) {
            this.videoChatListeners = this.videoChatListeners.filter(l => l !== listener);
        },
        sendVideoSignal(type, payload, videoChatRoomId) {
            if (this.stompClient && this.stompClient.connected) {
                const message = {
                    type,
                    payload,
                    videoChatRoomId
                };
                this.stompClient.publish({
                    destination: `/app/video-chat-room/send/${videoChatRoomId}`,
                    body: JSON.stringify(message),
                });
            }
        }
    }
});
