<template>
  <!-- PC TOP 버튼 HTML -->
  <div
    @click="scrollToTop"
    id="scrollTopPc"
    class="hidden-md hidden-sm hidden-xs"
    v-show="showTopBtn"
  >
    <img src="@/assets/images/home/btn_up_light.png" />
  </div>
  <!-- 모바일 TOP 버튼 HTML -->
  <div
    @click="scrollToTopMob"
    id="scrollTopMob"
    class="hidden-lg"
    v-show="showTopBtn"
  >
    <img src="@/assets/images/home/btn_up_light.png" />
  </div>
  <!-- PC DOWN 버튼 HTML -->
  <div
    @click="scrollToBottom"
    id="scrollDownPc"
    class="hidden-md hidden-sm hidden-xs"
    v-show="showDownBtn"
  >
    <img src="@/assets/images/home/btn_down_light.png" />
  </div>
  <!-- 모바일 DOWN 버튼 HTML -->
  <div
    @click="scrollToBottomMob"
    id="scrollDownMob"
    class="hidden-lg"
    v-show="showDownBtn"
  >
    <img src="@/assets/images/home/btn_down_light.png" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTopBtn: false,
      showDownBtn: false,
    };
  },
  mounted() {
    // Ensure that the event listener is added only once
    if (!this.scrollFunctionAdded) {
      window.addEventListener("scroll", this.scrollFunction);
      this.scrollFunctionAdded = true;
    }
  },
  beforeUnmount() {
    // Remove the event listener
    window.removeEventListener("scroll", this.scrollFunction);
  },
  methods: {
    scrollFunction() {
      const atTop = window.scrollY === 0;
      const atBottom =
        window.scrollY >= document.body.scrollHeight - window.innerHeight;

      this.showTopBtn = !atTop;
      this.showDownBtn = !atBottom;
    },

    scrollToTop() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    scrollToTopMob() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    scrollToBottom() {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    },
    scrollToBottomMob() {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    },
  },
};
</script>

<style scoped>
#scrollTopPc {
  display: none;
  position: fixed;
  bottom: 64px; /* 브라우저 아래쪽 끝에서부터의 거리 */
  right: 15px; /* 브라우저 오른쪽 끝에서부터의 거리 */
  cursor: pointer;
  z-index: 99;
}

/* 모바일 TOP 버튼 */
#scrollTopMob {
  display: none;
  position: fixed;
  bottom: 64px; /* 브라우저 아래쪽 끝에서부터의 거리 */
  right: 15px; /* 브라우저 오른쪽 끝에서부터의 거리 */
  z-index: 99;
}

/* PC DOWN 버튼 */
#scrollDownPc {
  position: fixed;
  bottom: 20px; /* 브라우저 아래쪽 끝에서부터의 거리 */
  right: 15px; /* 브라우저 오른쪽 끝에서부터의 거리 */
  cursor: pointer;
  z-index: 99;
}

/* 모바일 DOWN 버튼 */
#scrollDownMob {
  position: fixed;
  bottom: 20px; /* 브라우저 아래쪽 끝에서부터의 거리 */
  right: 15px; /* 브라우저 오른쪽 끝에서부터의 거리 */
  z-index: 99;
}
</style>
