import { defineStore } from 'pinia';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ref } from 'vue';

// const backend = process.env.VUE_APP_API_URL;
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
                        this.videoChatListeners.forEach(listener => listener(msg));
                    });
                },
                onStompError: (frame) => {
                    console.error('Broker reported error: ' + frame.headers['message']);
                    console.error('Additional details: ' + frame.body);
                },
                reconnectDelay: 5000,
                heartbeatIncoming: 4000,
                heartbeatOutgoing: 4000
            });

            this.stompClient.activate();
        },
        disconnectWebSocket() {
            if (this.stompClient && this.stompClient.connected) {
                this.stompClient.deactivate();
            }
        },
        sendVideoSignal(type, payload, videoChatRoomId) {
            if (this.stompClient && this.stompClient.connected) {
                this.stompClient.publish({
                    destination: `/app/video-chat-room/send/${videoChatRoomId}`,
                    body: JSON.stringify({ type, payload })
                });
            }
        },
        addVideoChatListener(listener) {
            this.videoChatListeners.push(listener);
        },
        removeVideoChatListener(listener) {
            this.videoChatListeners = this.videoChatListeners.filter(l => l !== listener);
        }
    }
});
