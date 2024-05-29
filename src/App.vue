<template>
  <div id="app">
    <HeaderComponent />
    <router-view v-if="!inQueue"/>
    <WaitingQueueComponent v-if="inQueue" @queue-complete="handleQueueComplete"/>
    <TopBottomComponent />
    <FooterComponent />
  </div>
</template>

<script>
import axios from 'axios';
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import TopBottomComponent from "./components/TopBottomComponent.vue";
import WaitingQueueComponent from "./components/WaitingQueueComponent.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    WaitingQueueComponent,
    TopBottomComponent,
    FooterComponent,
  },
  data() {
    return {
      inQueue: false,  // 초기 상태는 대기열에 있지 않은 것으로 설정
    };
  },
  methods: {
    checkQueueStatus() {
      axios.get('http://localhost:8080/checkQueue')
        .then(response => {
          if (response.data.inQueue) {
            this.inQueue = true;
          } else {
            this.inQueue = false;
            this.redirectToHome();
          }
        })
        .catch(error => {
          console.error('Error checking queue status:', error);
        });
    },
    handleQueueComplete() {
      this.inQueue = false;
      this.redirectToHome();
    },
    redirectToHome() {
      this.$router.push('/');
    }
  },
  created() {
    this.checkQueueStatus();  // 컴포넌트가 생성될 때 대기 상태를 확인
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700&display=swap");

/*
@font-face {
  font-family: "NanumSquareNeo-Variable";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_11-01@1.0/NanumSquareNeo-Variable.woff2")
    format("woff2");
  font-weight: normal;
  font-style: normal;
}
*/

@font-face {
    font-family: 'NEXON Lv2 Gothic';
    src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@2.1/NEXON Lv2 Gothic.woff') format('woff');
    font-weight: normal;
    font-style: normal;
}

div,
body,
a {
  font-family: NEXON Lv2 Gothic;
}

.page-content {
  padding-top: 180px;
  padding-bottom: 100px;
}
</style>
