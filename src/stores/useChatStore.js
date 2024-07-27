import { defineStore } from 'pinia';
import axios from 'axios';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ref } from 'vue';

const backend = process.env.VUE_APP_LOCAL_URL;

export const useChatStore = defineStore('chat', {
    state: () => ({
        stompClient: null,
        messages: ref([]),
        chatRoomId: null,
        userId: null,
        userNickname: '',
    }),
    actions: {
        async createOrJoinChatRoom(buyerId, buyerNickname, sellerId, sellerNickname, houseId) {
            const response = await axios.post(`${backend}/chat/room`, { buyerId, buyerNickname, sellerId, sellerNickname, houseId });
            this.chatRoomId = response.data.id;
            this.userId = buyerId;
            this.userNickname = buyerNickname;
            await this.connectToWebSocket(this.chatRoomId);
            return response.data.id;
        },
        connectToWebSocket(roomId) {
            const socket = new SockJS(`${backend}/ws`);
            this.stompClient = new Client({
                webSocketFactory: () => socket,
                onConnect: () => {
                    this.stompClient.subscribe(`/topic/chat/${roomId}`, (message) => {
                        this.messages.value.push(JSON.parse(message.body));
                    });
                },
                onStompError: (error) => {
                    console.error('Stomp Error', error);
                },
                onWebSocketClose: () => {
                    console.error('WebSocket connection closed. Retrying in 5 seconds...');
                    setTimeout(() => {
                        this.connectToWebSocket(roomId);
                    }, 5000); // 5초 후에 다시 연결 시도
                },
                reconnectDelay: 5000,  // 재연결 시도 간격
            });
            this.stompClient.activate();
        },
        disconnectWebSocket() {
            if (this.stompClient) {
                this.stompClient.deactivate();
            }
        },
        async sendMessage({ message, roomId, senderNickname, senderId }) {
            if (this.stompClient && this.stompClient.connected) {
                const chatMessage = {
                    chatRoomId: roomId,
                    senderId: senderId,
                    senderNickname: senderNickname,
                    message: message,
                    date: new Date().toISOString(),
                };
                this.stompClient.publish({
                    destination: `/app/send/${roomId}`,
                    body: JSON.stringify(chatMessage),
                });
                // 화면에 바로 추가하지 않음
            } else {
                console.error('WebSocket is not connected.');
            }
        },
        async loadMessages(roomId) {
            const response = await axios.get(`${backend}/chat/room/${roomId}`);
            this.messages.value = response.data;
        }
    }
});
