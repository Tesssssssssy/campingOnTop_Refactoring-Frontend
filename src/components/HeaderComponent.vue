<template>
  <header>
    <meta charset="UTF-8" />
    <div class="navbar_menu" :class="{ open: isNavbarOpen }">
      <button class="btn" type="button" id="menu_close" @click="toggleNavbar">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          class="bi bi-x-lg"
          viewBox="0 0 16 16"
        >
          <path
            d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"
          />
        </svg>
      </button>
      <ul class="navbar_nav">
        <li class="nav-item active">
          <a href="/likes">좋아요</a>
        </li>
        <li class="nav-item">
          <a href="/cart" target="_blank">장바구니</a>
        </li>
        <li class="nav-item" v-if="isAuthenticated">
          <a target="_blank" @click="logout">로그아웃</a>
        </li>
        <li class="nav-item" v-if="!isAuthenticated">
          <a target="_blank" href="/login">로그인</a>
        </li>
      </ul>
    </div>

    <div class="top_wrapper fixed-top">
      <div class="header_right_m">
        <button class="btn" id="btn_menu" @click="toggleNavbar">
          <img
            src="@/assets/images/header/bars-solid.svg"
            alt="Menu"
            height="21"
          />
        </button>
      </div>

      <ul class="top_menu nav justify-content-end">
        <!-- 로그인 되지 않았을 때의 로그인 버튼 -->
        <li class="nav-item" v-if="!isAuthenticated">
          <a href="/login" class="btn" id="btn_login">
            <img
              src="@/assets/images/header/user-solid.svg"
              alt="로그인"
              width="21"
            />
            로그인
          </a>
        </li>

        <!-- 로그인 되었을 때의 사용자 닉네임 및 직접 나열된 링크 -->
        <li class="nav-item" v-if="isAuthenticated">
          <div class="header_right my-auto">
            <div class="login">
              <!-- 닉네임 표시 -->
              <a class="btn" id="btn_nickname">
                <img
                  src="@/assets/images/header/user-solid.svg"
                  alt="사용자"
                  width="21"
                />
                <span margin-left="5px">{{ decodedToken.nickname }}</span>
              </a>
              <!-- 직접 나열된 링크 -->
              <a href="/likes" class="btn"
                ><img
                  src="@/assets/images/header/heart-solid.svg"
                  alt="사용자"
                  width="21"
                />좋아요</a
              >
              <a href="/cart" class="btn"
                ><img
                  src="@/assets/images/header/bell-solid.svg"
                  alt="사용자"
                  width="21"
                />장바구니</a
              >
              <a href="/login" @click.prevent="logout" class="btn"
                ><img
                  src="@/assets/images/header/user-solid.svg"
                  alt="사용자"
                  width="21"
                />로그아웃</a
              >
            </div>
          </div>
        </li>

        <!-- 항상 표시되는 호스트되기 버튼 -->
        <li class="nav-item" v-if="isAuthenticated">
          <a href="/houseRegister" class="nav-link wehomehost_btn btn"
            >숙소 등록</a
          >
        </li>
      </ul>

      <div class="head_logo">
        <a href="/" class="logo my-auto">
          <img
            src="@/assets/images/home/logo.png"
            alt="Welcome home! campingOnTop"
            width="500px"
          />
        </a>
      </div>
    </div>
  </header>
</template>

<script>
import { useMemberStore } from "/src/stores/useMemberStore";

export default {
  name: "HeaderComponents",
  data() {
    return {
      isNavbarOpen: false,
      isDropdownOpen: false,
    };
  },
  computed: {
    isAuthenticated() {
      const store = useMemberStore();
      return store.isAuthenticated;
    },
    decodedToken() {
      const store = useMemberStore();
      return store.decodedToken;
    },
  },
  methods: {
    toggleNavbar() {
      this.isNavbarOpen = !this.isNavbarOpen;
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    logout() {
      window.localStorage.removeItem("token");
      const store = useMemberStore();
      store.isAuthenticated = false;
      store.decodedToken = {};
      this.isDropdownOpen = false;
      this.$router.push("/");
    },
    decodeToken(token) {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );

      return JSON.parse(jsonPayload);
    },
  },
  created() {
    const token = window.localStorage.getItem("token");
    if (token) {
      const decoded = this.decodeToken(token);
      const store = useMemberStore();
      store.setDecodedToken(decoded);
      store.isAuthenticated = true;
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700&display=swap");
@import url("https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css");

@font-face {
  font-family: "yg-jalnan";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff")
    format("woff");
  font-weight: normal;
  font-style: normal;
}

[class^="icon-"],
[class*=" icon-"] {
  /* use !important to prevent issues with browser extensions that change fonts */
  font-family: "yg-jalnan" !important;
  font-style: normal;
  font-weight: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;

  /* Better Font Rendering =========== */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
.fixed-top {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030; /* z-index는 다른 요소들 위에 표시되도록 충분히 높아야 합니다. */
}

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

element.style {
  transition-duration: 0ms;
  transform: translate3d(-4318px, 0px, 0px);
  transition-delay: 0ms;
}
.icon-bbq:before {
  image-rendering: "/assets/images/home/fire-solid.svg";
}
.icon-bell:before {
  content: "\e900";
}
.icon-budget:before {
  content: "\e902";
}
.icon-family:before {
  content: "\e904";
}
.icon-hanok:before {
  content: "\e906";
}
.icon-hallyu:before {
  content: "\e907";
}
.icon-instagrammable:before {
  content: "\e909";
}
.icon-menubar:before {
  content: "\e90b";
}
.icon-pet:before {
  content: "\e90c";
}
.icon-premium:before {
  content: "\e90d";
}
.icon-rooftop:before {
  content: "\e90e";
}
.icon-subway:before {
  content: "\e90f";
}
.icon-unique:before {
  content: "\e910";
}
.icon-workation:before {
  content: "\e911";
}

/* mobile first */
:root {
  --wehome-color: #6800cd;
}
.wehome_color {
  color: #6800cd;
}
.wehome_bg_color {
  background-color: #6800cd;
}

html {
  font-size: 13px;
}
body {
  font-family: "yg-jalnan" !important;
  padding-top: 172px;
}

.noshow {
  display: none;
}
.wehome_btn {
  background-color: white;
  border-radius: 50rem;
  color: #fff;
  text-align: center;
  padding: 10px 20px;
  height: 40px;
  line-height: 20px;
}
.wehome_btn:hover {
  color: #fff;
  text-decoration: none;
}

.wehomehost_btn {
  background-color: #fff;
  border: 1px solid #6800cd;
  border-radius: 50rem;
  color: #6800cd;
  text-align: center;
  padding: 9px 20px;
  margin-top: 2px;
  margin-right: 3px;
  height: 36px;
  line-height: 16px;
}
.wehomehost_btn:hover {
  background-color: #6800cd;
  color: #fff;
}

.wh_shadow {
  box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.1);
}

.dropdown-toggle.btn:focus {
  outline: none;
  box-shadow: none;
}
.dropdown-menu {
  box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.1);
  border: 0;
  display: contents;
}
.dropdown-toggle::after {
  flex-shrink: 0;
  width: 1rem;
  height: 1rem;
  margin-left: auto;
  content: "";
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-size: 1rem;
  transition: transform 0.2s ease-in-out;
  border: 0;
  vertical-align: middle;
}

.dropdown-toggle.right_arrow::after {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23212529'%3e%3cpath fill-rule='evenodd' d='M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z'/%3e%3c/svg%3e");
}

.modal-open {
  overflow: hidden;
}

/* Calendar */
.ui-widget {
  font-family: "yg-jalnan";
}
.ui-widget-content {
  border: 0;
  background: #f6f6f6;
  border-radius: 5px;
  font-size: 14px;
  color: #13405a;
  padding: 15px 30px;
}
.ui-widget-header {
  background: transparent;
  border: 0;
  color: #13405a;
  font-size: 14px;
}
table.ui-datepicker-calendar {
  background-color: #fff;
}
table.ui-datepicker-calendar thead {
  background-color: #f6f6f6;
}
table.ui-datepicker-calendar thead th {
  font-size: 9px;
  color: #8f94a0;
  font-weight: normal;
}
.ui-widget-content .ui-state-default {
  background: transparent;
  border: 0;
  text-align: center;
  color: #13405a;
  font-size: 14px;
  font-weight: normal;
  padding: 5px;
}
.ui-datepicker a.ui-datepicker-prev span,
.ui-datepicker a.ui-datepicker-next span {
  display: none;
}
.ui-datepicker .ui-datepicker-prev-hover,
.ui-datepicker .ui-datepicker-next-hover {
  border: 0;
}
.ui-datepicker a.ui-datepicker-prev,
.ui-datepicker a.ui-datepicker-next {
  padding: 10px 0;
  top: 75px;
  cursor: pointer;
}
.ui-datepicker a.ui-datepicker-prev {
  left: -22px;
  /* background: url(/image/cmn/cal_arrow_left.gif) no-repeat center; */
}
.ui-datepicker a.ui-datepicker-next {
  right: -22px;
  /* background: url(/image/cmn/cal_arrow_right.gif) no-repeat center; */
}
.ui-datepicker a.ui-state-active {
  font-weight: bold;
}

header .top_wrapper {
  background-color: #fff;
  padding-top: 10px;
}

header ul.top_menu {
  height: 44px;
  display: none;
  margin: 0 auto;
  max-width: 1180px;
}
header ul.top_menu li {
  background-color: #fff;
}
header ul.top_menu div.dropdown button {
  height: 44px;
}
header .header_right_m {
  text-align: right;
  margin-right: 18px;
}
header .header_right_m a.btn_noti {
  position: relative;
}
header .header_right_m a.btn_noti span.noti_new {
  border-radius: 50%;
  background-color: #ffa000;
  color: #fff;
  width: 13px;
  height: 13px;
  display: block;
  position: absolute;
  top: 3px;
  right: 3px;
  font-size: 0.5em;
  text-align: center;
}

div.head_logo {
  height: 40;
  position: relative;
  text-align: center;
  margin-top: 0;
  opacity: 1;
  transition: 0.5s ease;
}

body.sticky header {
  background-color: #fff;
}
body.sticky header div.head_logo {
  opacity: 0;
  height: 0;
  margin: 0;
}
.login {
  margin-top: 4px;
}
.wehomehost_btn {
  margin-top: 4px;
}
.search_box {
  height: 56px;
  border: 1px solid #e0e0e0;
  border-radius: 28px;
  margin: 10px 0 10px 0;
  display: flex;
}
.search_box div.sc {
  margin: 10px 0 10px 10px;
  height: 36px;
}
.search_box div.ln {
  border-right: 0;
}
.search_box div input.text2 {
  border: none;
  height: 36px;
  width: 100%;
  outline: none;
  font-size: 16px;
}
img {
  margin-right: 10px;
}

.search_box div.search_keyword {
  flex: 2;
}
.search_box div.search_keyword input.text2 {
  padding-left: 20px;
}
.search_box div.search_checkin {
  flex: 1;
}
.search_box div.search_checkout {
  flex: 1;
}
.search_box div.search_guests {
  flex: 1;
}
.search_box div.search_btn {
  margin: 10px 20px;
}
.search_box div.search_btn button#search_btn {
  background-color: white;
}
.search_box div.search_btn button#search_btn img {
  vertical-align: top;
  margin-top: 4px;
}
#search_guest .custom-select {
  background-image: none;
  border: 0;
  box-shadow: none;
}

section#search {
  position: relative;
  background-color: #fff;
  max-width: 1180px;
  padding: 0 10px;
}
section#search div.search_checkin,
section#search div.search_checkout,
section#search div.search_guests {
  display: none;
}

div#wh_fav_area {
  width: 280px;
  padding: 16px;
  border-radius: 10px;
  position: absolute;
  top: 50px;
  left: 20px;
  background-color: #fff;
  z-index: 2;
  display: none;
}
div#wh_fav_area div.area {
  padding: 7px;
}
div#wh_fav_area div.area:hover {
  background-color: #f7f6f9;
  border-radius: 5px;
}
div#wh_fav_area div.area a {
  display: block;
  color: #5e5e5e;
}
div#wh_fav_area div.area a:hover {
  text-decoration: none;
}

/* google map */
.pac-container {
  z-index: 1050;
}

/* mobile */
.navbar_menu {
  z-index: 1100;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 100%;
  width: 30%;
  padding-right: 1rem;
  padding-left: 1rem;
  padding-top: 1rem;
  overflow-y: auto;
  visibility: hidden;
  background-color: #fff;
  transition: visibility 0.3s ease-in-out, -webkit-transform 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out;
  transition: transform 0.3s ease-in-out, visibility 0.3s ease-in-out,
    -webkit-transform 0.3s ease-in-out;
}
.navbar_menu.open {
  visibility: visible;
  -webkit-transform: translateX(-100%);
  transform: translateX(-100%);
}
.navbar_nav {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  list-style: none;
}

.navbar_menu .nav-item {
  display: block;
  padding: 1rem 0.5rem;
  height: 50px;
}

.navbar_menu .nav-item a {
  color: #000;
}
.navbar_menu .nav-item div.dropdown button.btn {
  padding: 0;
}

@media (max-width: 320px) {
  div#wh_fav_area {
    width: 100%;
  }
  div.head_logo {
    margin-top: 10px;
    margin-bottom: 24px;
  }
  div.head_logo img {
    width: 280px;
  }
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  div#wh_fav_area {
    width: 380px;
  }
  div.head_logo {
    margin-top: 10px;
    margin-bottom: 24px;
  }
  div.head_logo img {
    width: 280px;
  }
}

/*  Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  #btn_menu {
    display: block;
  }
  .login,
  .dropdown-menu {
    display: none;
  }

  body {
    padding-top: 217px;
  }
  .detailsBody {
    padding-top: 160px;
  }
  .loginBody {
    padding-top: 185px;
  }
  header .header_right_m {
    display: none;
  }
  header ul.top_menu {
    display: flex;
  }
  div.head_logo {
    margin-top: 10px;
    margin-bottom: 24px;
  }
  div.head_logo img {
    width: 350px;
  }

  .search_box div.ln {
    border-right: 1px solid #efefef;
  }
  section#search div.search_checkin,
  section#search div.search_checkout,
  section#search div.search_guests {
    display: block;
  }
  .search_box div input.text2 {
    font-size: 13px;
  }
}

@media (min-width: 769px) {
  #btn_menu {
    display: none;
  }
  .login {
    display: block;
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  section#search {
    margin: 0 auto;
  }
}
</style>
