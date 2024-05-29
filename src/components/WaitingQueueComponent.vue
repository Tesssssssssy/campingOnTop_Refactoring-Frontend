<template>
  <div>
    <h1>숙소 예약 서비스 대기열</h1>
    <p>{{ queueMessage }}</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['userId'],
  data() {
    return {
      queueMessage: '',
    };
  },
  methods: {
    pollQueueStatus() {
      axios.get(`http://localhost:8080/joinQueue`, { params: { userId: this.userId } })
        .then(response => {
          this.queueMessage = response.data;
          if (response.data === 'You can access the site directly.') {
            this.$emit('queue-complete');
          } else {
            setTimeout(this.pollQueueStatus, 5000);  // 계속 상태를 확인
          }
        })
        .catch(error => {
          console.error('Error polling queue status:', error);
        });
    }
  },
  created() {
    this.pollQueueStatus();  // 생성시 바로 대기 상태를 확인 시작
  }
};
</script>
