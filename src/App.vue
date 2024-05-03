<template>
  <HeaderComponent />
  <router-view></router-view>
  <TopBottomComponent />

  <FooterComponent />
</template>

<script>
import HeaderComponent from "./components/HeaderComponent.vue";
import FooterComponent from "./components/FooterComponent.vue";
import TopBottomComponent from "./components/TopBottomComponent.vue";

export default {
  name: "App",
  components: {
    HeaderComponent,
    TopBottomComponent,
    FooterComponent,
  },
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
