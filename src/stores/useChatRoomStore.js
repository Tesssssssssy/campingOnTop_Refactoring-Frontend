import { defineStore } from 'pinia';
import axios from 'axios';

const backend = process.env.VUE_APP_API_URL;
// const backend = process.env.VUE_APP_LOCAL_URL;

export const useChatRoomStore = defineStore('chatRoom', {
    state: () => ({
        chatRooms: [],
    }),
    actions: {
        async loadChatRooms(userId) {
            const response = await axios.get(`${backend}/chat-room/list/${userId}`);
            this.chatRooms = response.data;
            return this.chatRooms;
        },

        async loadChatRoomById(chatRoomId) {
            const response = await axios.get(`${backend}/chat-room/${chatRoomId}`);
            return response.data;
        },

        getChatPartnerNickname(chatRoom, userId) {
            return chatRoom.buyerId === userId ? chatRoom.sellerNickname : chatRoom.buyerNickname;
        }
    }
});
