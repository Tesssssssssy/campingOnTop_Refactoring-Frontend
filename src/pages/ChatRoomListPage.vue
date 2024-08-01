<template>
    <div class="chat-room-list-page">
        <div class="chat-room-list-container">
            <header class="chat-header">채팅룸</header>
            <div class="chat-room-list">
                <div v-for="room in chatRooms" :key="room.id" class="chat-room-item">
                    <router-link :to="`/chat/${room.id}`" class="chat-room-link">
                        <div class="chat-room-name">
                            숙소명: {{ room.houseName }} 
                        </div>
                        <div class="chat-room-name">
                            상대방: {{ getChatPartnerNickname(room) }}
                        </div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useChatRoomStore } from "@/stores/useChatRoomStore";
import { useMemberStore } from "@/stores/useMemberStore";

export default {
    setup() {
        const chatRoomStore = useChatRoomStore();
        const memberStore = useMemberStore();
        const chatRooms = ref([]);

        onMounted(async () => {
            const userId = memberStore.decodedToken.id;
            chatRooms.value = await chatRoomStore.loadChatRooms(userId);
        });

        const getChatPartnerNickname = (room) => {
            const userId = memberStore.decodedToken.id;
            return room.buyerId === userId ? room.sellerNickname : room.buyerNickname;
        };

        return { chatRooms, getChatPartnerNickname };
    },
};
</script>

<style scoped>
.chat-room-list-page {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #fff;
    /* Set background to white */
}

.chat-room-list-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 600px;
    padding: 20px;
    border: 1px solid #ccc;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    /* Ensure container is also white */
    border-radius: 10px;
}

.chat-header {
    text-align: center;
    padding: 20px;
    background-color: #007bff;
    color: #fff;
    font-size: 1.5em;
    border-radius: 10px 10px 0 0;
}

.chat-room-list {
    flex-grow: 1;
    overflow-y: auto;
    margin: 20px 0;
}

.chat-room-item {
    padding: 20px;
    border-bottom: 1px solid #ccc;
    display: flex;
    align-items: center;
    transition: background-color 0.3s;
}

.chat-room-item:last-child {
    border-bottom: none;
}

.chat-room-item:hover {
    background-color: #f9f9f9;
}

.chat-room-link {
    text-decoration: none;
    color: inherit;
    width: 100%;
}

.chat-room-name {
    font-size: 1.2em;
    color: #333;
}
</style>
