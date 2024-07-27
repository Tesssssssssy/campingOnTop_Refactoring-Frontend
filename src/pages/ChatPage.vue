<template>
  <div class="chat-page">
    <div class="back-button-container">
      <button @click="goToChatRooms" class="back-button">채팅 목록</button>
    </div>
    <div class="chat-container">
      <header class="chat-header">{{ chatPartnerNickname }}</header>
      <div class="chat-messages" ref="chatMessages">
        <div v-for="msg in messages" :key="msg.id" :class="{'message': true, 'message-sent': isSentMessage(msg), 'message-received': !isSentMessage(msg)}">
          <div :class="{'message-info': true, 'sent': isSentMessage(msg), 'received': !isSentMessage(msg)}">
            <strong>{{ msg.senderNickname }}</strong>
          </div>
          <div :class="{'message-text': true, 'sent': isSentMessage(msg), 'received': !isSentMessage(msg)}">{{ msg.message }}</div>
          <div :class="{'message-time': true, 'sent': isSentMessage(msg), 'received': !isSentMessage(msg)}">
            {{ formatTime(msg.date) }}
          </div>
        </div>
      </div>
      <div class="message-input">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message...">
        <button @click="sendMessage">Send</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed, watch, nextTick, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useChatStore } from "@/stores/useChatStore";
import { useMemberStore } from "@/stores/useMemberStore";
import { useChatRoomStore } from "@/stores/useChatRoomStore";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const roomId = route.params.roomId;
    const chatStore = useChatStore();
    const chatRoomStore = useChatRoomStore();
    const memberStore = useMemberStore();
    const newMessage = ref('');
    const chatMessages = ref(null);
    const chatPartnerNickname = ref('');

    const loadChatPartnerNickname = async () => {
      const userId = memberStore.decodedToken.id;
      const chatRoom = await chatRoomStore.loadChatRoomById(roomId);
      chatPartnerNickname.value = chatRoomStore.getChatPartnerNickname(chatRoom, userId);
    };

    onMounted(async () => {
      await loadChatPartnerNickname();
      await chatStore.loadMessages(roomId);
      chatStore.connectToWebSocket(roomId);
      nextTick(scrollToBottom);
    });

    onUnmounted(() => {
      chatStore.disconnectWebSocket();
    });

    const messages = computed(() => chatStore.messages.value);

    watch(messages, () => {
      nextTick(scrollToBottom);
    });

    const sendMessage = async () => {
      if (newMessage.value.trim()) {
        const { nickname, id } = memberStore.decodedToken;
        chatStore.sendMessage({
          message: newMessage.value,
          roomId,
          senderNickname: nickname,
          senderId: id,
        });
        newMessage.value = '';
        setTimeout(scrollToBottom, 100);
      }
    };

    const goToChatRooms = () => {
      router.push('/chatRooms');
    };

    const formatTime = (dateString) => {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const isSentMessage = (msg) => {
      const { id } = memberStore.decodedToken;
      return msg.senderId === id;
    };

    const scrollToBottom = () => {
      if (chatMessages.value) {
        chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
      }
    };

    return { messages, newMessage, sendMessage, goToChatRooms, formatTime, isSentMessage, chatMessages, chatPartnerNickname };
  },
};
</script>

<style scoped>
.chat-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  margin-top: 200px;
  margin-bottom: 150px;
}

.back-button-container {
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 20px;
}

.back-button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.back-button:hover {
  background-color: #0056b3;
}

.chat-container {
  display: flex;
  flex-direction: column;
  height: 70vh;
  max-width: 600px;
  width: 100%;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  overflow: hidden;
  margin-top: 20px;
}

.chat-header {
  text-align: center;
  padding: 10px;
  background-color: #f3f3f3;
  font-size: 1.5em;
  font-weight: bold;
}

.chat-messages {
  flex-grow: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  padding: 10px;
  border-top: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
}

.message {
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
}

.message-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
}

.message-info.sent {
  justify-content: flex-end;
  text-align: right;
}

.message-info.received {
  justify-content: flex-start;
  text-align: left;
}

.message-time {
  font-size: 0.8em;
  color: #888;
  margin-top: 5px;
}

.message-time.sent {
  align-self: flex-end;
}

.message-time.received {
  align-self: flex-start;
}

.message-text {
  padding: 10px;
  border-radius: 5px;
  max-width: 80%;
  word-wrap: break-word;
}

.message-text.sent {
  background-color: #d1ffd6;
  align-self: flex-end;
}

.message-text.received {
  background-color: #f1f1f1;
  align-self: flex-start;
}

.message-input {
  display: flex;
  margin-top: 10px;
}

.message-input input {
  flex-grow: 1;
  margin-right: 10px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.message-input button {
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.message-input button:hover {
  background-color: #0056b3;
}
</style>
