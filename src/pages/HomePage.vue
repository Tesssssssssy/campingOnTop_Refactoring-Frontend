<template>
  <div class="page-content">
    <section id="search">
      <form name="frmSearch" @submit.prevent="searchHouse" id="frmSearchMain">
        <input type="hidden" name="ks" value="1" />
        <div class="search_box wh_shadow">
          <div class="sc search_keyword ln">
            <input
              type="text"
              placeholder="숙소 이름으로 검색"
              v-model="searchQuery"
              class="search_input text2"
              name="query"
              autocomplete="off"
              id="search_field"
            />
          </div>

          <div class="sc search_btn">
            <button type="submit" class="btn rounded-circle" id="search_btn">
              <img
                src="@/assets/images/header/magnifying-glass-solid.svg"
                alt="S"
                width="12"
              />
            </button>
          </div>
        </div>
      </form>
      <form
        name="frmSearch"
        @submit.prevent="searchHouseByAddr"
        id="frmSearchMain"
      >
        <input type="hidden" name="ks" value="1" />
        <div class="search_box wh_shadow">
          <div class="sc search_keyword ln">
            <input
              type="text"
              placeholder="숙소 주소로 검색"
              v-model="searchQueryByAddr"
              class="search_input text2"
              name="query"
              autocomplete="off"
              id="search_field"
            />
          </div>

          <div class="sc search_btn">
            <button type="submit" class="btn rounded-circle" id="search_btn">
              <img
                src="@/assets/images/header/magnifying-glass-solid.svg"
                alt="S"
                width="12"
              />
            </button>
          </div>
        </div>
      </form>
      <!--
      <div id="wh_fav_area" class="wh_shadow">
        <h6>서울 인기지역</h6>
        <div class="row no-gutters">
          <div class="area col-6">
            <a href="#">
              <img
                src="@/assets/images/header/location-dot-solid.svg"
                alt=""
                width="12"
              />
              홍대
            </a>
          </div>
          <div class="area col-6">
            <a href="#">
              <img
                src="@/assets/images/header/location-dot-solid.svg"
                alt=""
                width="12"
              />
              이태원
            </a>
          </div>
        </div>

        <div class="row no-gutters">
          <div class="area col-6">
            <a href="#">
              <img
                src="@/assets/images/header/location-dot-solid.svg"
                alt=""
                width="12"
              />
              명동
            </a>
          </div>
          <div class="area col-6">
            <a href="#">
              <img
                src="@/assets/images/header/location-dot-solid.svg"
                alt=""
                width="12"
              />
              을지로
            </a>
          </div>
        </div>

        <div class="row no-gutters">
          <div class="area col-6">
            <a href="#">
              <img
                src="@/assets/images/header/location-dot-solid.svg"
                alt=""
                width="12"
              />
              강남
            </a>
          </div>
          <div class="area col-6">
            <a href="#">
              <img
                src="@/assets/images/header/location-dot-solid.svg"
                alt=""
                width="12"
              />
              잠실
            </a>
          </div>
        </div>
        <br />
        <h6>부산 인기지역</h6>
        <div class="row no-gutters">
          <div class="area col-6">
            <a href="#">
              <img
                src="@/assets/images/header/location-dot-solid.svg"
                alt=""
                width="12"
              />
              해운대
            </a>
          </div>
          <div class="area col-6">
            <a href="#">
              <img
                src="@/assets/images/header/location-dot-solid.svg"
                alt=""
                width="12"
              />
              광안리
            </a>
          </div>
        </div>

        <div class="row no-gutters">
          <div class="area col-6">
            <a href="#">
              <img
                src="@/assets/images/header/location-dot-solid.svg"
                alt=""
                width="12"
              />
              서면
            </a>
          </div>
          <div class="area col-6">
            <a href="#">
              <img
                src="@/assets/images/header/location-dot-solid.svg"
                alt=""
                width="12"
              />
              영도구
            </a>
          </div>
        </div>
      </div>
      -->
    </section>

    <main class="mainClass">
      <section id="category">
        <div class="swiper-container category_slide">
          <ul class="swiper-wrapper">
            <!--
            <li
              class="swiper-slide"
              data-type="subway"
              onclick="window.dataLayer.push({event: 'click_home',click_target: 'subway'});"
            >
              <img
                src="@/assets/images/home/train-subway-solid.svg"
                width="25"
              />
              <h6>역세권</h6>
            </li>
            -->
            <!--
            <li
              class="swiper-slide"
              data-type="subway"
              onclick="window.dataLayer.push({event: 'click_home',click_target: 'subway'});"
            >
              <img
                src="@/assets/images/header/location-dot-solid.svg"
                width="21"
              />
              <h6>내 주변</h6>
            </li>
            -->
            <li
              class="swiper-slide"
              data-type="budget"
              @click="searchHouseOrderByPriceAsc()"
            >
              <img
                src="@/assets/images/home/arrow-down-short-wide-solid.svg"
                width="32"
              />
              <h6>낮은 가격순</h6>
            </li>
            <li
              class="swiper-slide"
              data-type="premium"
              @click="searchHouseOrderByPriceDesc()"
            >
              <img
                src="@/assets/images/home/arrow-up-wide-short-solid.svg"
                width="32"
              />
              <h6>높은 가격순</h6>
            </li>
            <li
              class="swiper-slide"
              data-type="likes"
              @click="searchHouseOrderByLikeCntDesc()"
            >
              <img
                src="@/assets/images/home/thumbs-up-solid.svg"
                width="28"
              />
              <h6>인기 많은 순</h6>
            </li>
            <!--
            <li
              class="swiper-slide"
              data-type="bbq"
              onclick="window.dataLayer.push({event: 'click_home',click_target: 'bbq'});"
            >
              <img src="@/assets/images/home/fire-solid.svg" width="24" />
              <h6>바베큐</h6>
            </li>
            -->
          </ul>
        </div>
      </section>

      <section id="main_lists" class="container">
        <div class="row">
          <div
            v-for="house in houseStore.houseList"
            :key="house.id"
            class="col-xl-3 col-md-4 col-sm-6 col-12 card_wrap"
          >
            <div class="card" :data-pid="house.id">
              <div class="p_images swiper">
                <div class="swiper-wrapper">
                  <div
                    class="swiper-slide"
                    v-for="(image, index) in house.filenames"
                    :key="index"
                  >
                    <img
                      :data-src="image"
                      class="swiper-lazy"
                      alt=""
                      width="100%"
                    />
                    <div class="swiper-lazy-preloader"></div>
                  </div>
                </div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev2">
                  <img
                    src="@/assets/images/header/chevron-left-solid.svg"
                    alt="Previous"
                  />
                </div>
                <div class="swiper-button-next2">
                  <img
                    src="@/assets/images/header/chevron-right-solid.svg"
                    alt="Next"
                  />
                </div>
              </div>
              <div class="card-body">
                <h5 class="card-title text-truncate">
                  <a :href="'details/' + house.id">{{ house.name }}</a>
                </h5>
                <h6 class="card-subtitle">{{ house.address }}</h6>
                <h6 class="card-likeCnt">❤ {{ house.likeCnt }}</h6>
                <div class="p_price">
                  <span class="price"
                    >{{ house.price.toLocaleString() }}원</span
                  >
                  <span class="night"> /1박당</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- Pagination Section -->
      <nav aria-label="Page navigation example">
        <ul class="pagination justify-content-center">
          <!-- Previous Page Button -->
          <li
            class="page-item"
            :class="{ disabled: houseStore.currentPage === 1 }"
          >
            <button
              class="page-link"
              @click="changePage(houseStore.currentPage - 1)"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          <!-- Page Numbers -->
          <li
            v-for="page in pageArray"
            :key="page"
            :class="{
              'page-item': true,
              active: houseStore.currentPage === page,
            }"
          >
            <button class="page-link" @click="changePage(page, 40)">
              {{ page }}
            </button>
          </li>

          <!-- Next Page Button -->
          <li
            :class="{
              'page-item': true,
              disabled: houseStore.currentPage === houseStore.totalPages,
            }"
          >
            <button
              class="page-link"
              @click="changePage(houseStore.currentPage + 1)"
              aria-label="Next"
            >
              <span aria-hidden="true">&raquo;</span>
            </button>
          </li>
        </ul>
      </nav>
    </main>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useMemberStore } from "/src/stores/useMemberStore";
import { useHouseStore } from "/src/stores/useHouseStore";
import Swiper from "swiper";

export default {
  data() {
    return {
      houseList: [],
      swiper: null,
      searchQuery: "",
      searchQueryByAddr: "",
    };
  },
  computed: {
    ...mapStores(useMemberStore, useHouseStore),
    pageArray() {
      return Array.from(
        { length: Math.ceil(this.totalPages) },
        (_, index) => index + 1
      );
    },
  },
  components: {},
  async mounted() {
    await this.houseStore.getHouseList(1, 40);
    this.initializeSwiper();
    this.totalPages = this.houseStore.totalPages;
  },
  watch: {
    "houseStore.totalPages": {
      handler(newVal) {
        console.log("Total pages updated:", newVal);
        this.totalPages = newVal;
      },
      immediate: true,
    },
    "houseStore.currentPage": {
      handler(newVal) {
        console.log("Current page updated:", newVal);
      },
      immediate: true,
    },
  },
  methods: {
    initializeSwiper() {
      var allImageSliders = document.querySelectorAll(".swiper");
      allImageSliders.forEach((sliderElement) => {
        var swiper = new Swiper(sliderElement, {
          loop: true,
          lazy: true,
          navigation: {
            nextEl: ".swiper-button-next2",
            prevEl: ".swiper-button-prev2",
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
        });
        console.log(swiper);
      });
    },
    async searchHouse() {
      await this.houseStore.getHouseListByName(1, 40, this.searchQuery);
    },
    async searchHouseByAddr() {
      await this.houseStore.getHouseListByAddr(1, 40, this.searchQueryByAddr);
    },
    async searchHouseOrderByPriceDesc() {
      await this.houseStore.getHouseListOrderByPriceDesc(1, 40);
    },
    async searchHouseOrderByPriceAsc() {
      await this.houseStore.getHouseListOrderByPriceAsc(1, 40);
    },
    async searchHouseOrderByLikeCntDesc() {
      await this.houseStore.getHouseListOrderByLikeCntDesc(1, 40);
    },
    async changePage(page, size) {
      console.log("Changing page to:", page);
      await this.houseStore.getHouseList(page, size);
      console.log("New house list:", this.houseStore.houseList);
      console.log("Current page after change:", this.houseStore.currentPage);
      console.log(
        "Is previous button disabled?",
        this.houseStore.currentPage === 1
      );
    },
  },
};
</script>

<style scoped>
@import url(https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css);
@import url(https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css);

@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@100;300;400;500;700&display=swap");

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
  border: 1px solid var(--wehome-color);
  border-radius: 50rem;
  color: var(--wehome-color);
  text-align: center;
  padding: 9px 20px;
  margin-top: 2px;
  margin-right: 3px;
  height: 36px;
  line-height: 16px;
}
.wehomehost_btn:hover {
  background-color: var(--wehome-color);
  color: #fff;
}

.wh_shadow {
  box-shadow: 1px 1px 8px 0 rgba(0, 0, 0, 0.1);
}

.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn_icon {
  font-family: "Material Icons";
}
.dropbtn {
  border: 1px solid rgb(37, 37, 37);
  border-radius: 4px;
  background-color: #f5f5f5;
  font-weight: 400;
  color: rgb(37, 37, 37);
  padding: 12px;
  width: 200px;
  text-align: left;
  cursor: pointer;
  font-size: 12px;
}
.dropdown-content {
  display: none;
  position: absolute;
  z-index: 1; /*다른 요소들보다 앞에 배치*/
  font-weight: 400;
  background-color: #f9f9f9;
  min-width: 200px;
}

.dropdown-content a {
  display: block;
  text-decoration: none;
  color: rgb(37, 37, 37);
  font-size: 12px;
  padding: 12px 20px;
}

.dropdown-content a:hover {
  background-color: #ececec;
}

.dropdown:hover .dropdown-content {
  display: block;
}

*,
::after,
::before {
  box-sizing: border-box;
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
  /* background: url(@/image/cmn/cal_arrow_left.gif) no-repeat center; */
}
.ui-datepicker a.ui-datepicker-next {
  right: -22px;
  /* background: url(@/image/cmn/cal_arrow_right.gif) no-repeat center; */
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
  height: 50px;
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

.wh_cont {
  max-width: 1180px;
  padding: 0 20px;
}

.search_box {
  width: 570px;
  height: 56px;
  border: 1px solid #e0e0e0;
  border-radius: 28px;
  margin: 10px 0 30px 0;
  display: flex;
}
#frmSearchMain {
  display: inline-block;
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

section#category {
  text-align: center;
  width: auto;
  overflow: hidden;
}
section#category div.category_slide {
  height: 100px;
}
section#category ul {
  list-style: none;
  padding: 0;
  margin: 0;
  width: auto;
  display: inline-flex;
}
section#category ul li {
  display: inline-block;
  padding: 16px 10px;
  text-align: center;
  margin: 0 8px;
  cursor: pointer;
  transition: color 0.15s ease-in-out;
}
section#category ul li i {
  font-size: 33px;
}
section#category ul li h6 {
  margin-top: 16px;
}
section#category ul li:hover h6 {
  color: var(--wehome-color);
}
section#category ul li.select {
  color: var(--wehome-color);
}

section#main_lists div.row,
section#banners div.row {
  margin-left: -15px;
  margin-right: -15px;
}
section#main_lists div.row div.card_wrap {
  padding: 0 8px 16px;
}
section#main_lists div.card {
  border: none;
}
section#main_lists div.card div.ribbon {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 100;
}
section#main_lists div.card div.p_images {
  aspect-ratio: 14/9;
  border-radius: 10px;
}
section#main_lists div.card div.card-body {
  padding: 16px 0;
}
section#main_lists div.card div.card-body h5.card-title a {
  font-size: 18px;
  font-weight: bold;
  color: #1c1c1c;
}
section#main_lists div.card div.card-body h6.card-subtitle {
  margin: 0 0 5px 0;
  color: #777;
}
section#main_lists div.card div.card-body h6.card-likeCnt {
  margin: 0 0 5px 0;
  color: red;
}

section#main_lists div.card div.p_images span.btn_fav {
  color: #fff;
  padding: 10px;
  position: absolute;
  right: 5px;
  top: 0;
  z-index: 10;
  cursor: pointer;
}

section#main_lists div.card div.card-body div.p_price {
  text-align: right;
}
section#main_lists div.card div.card-body div.p_price span.price {
  font-size: 17px;
  color: #1c1c1c;
  font-weight: bold;
}
section#main_lists div.card div.card-body div.p_price span.night {
  font-size: 13px;
  color: #777;
}

main {
  margin: 0 auto;
}

.spinner-border {
  width: 5rem;
  height: 5rem;
  color: var(--wehome-color);
}

.swiper-pagination-bullet {
  background-color: white;
}

.swiper-container {
  width: 100%;
}

.swiper-container .swiper-slide {
  width: auto;
}

.swiper {
  width: 100%;
  height: 100%;
}
.p_images .swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swiper-pagination-bullet {
  background: rgba(255, 255, 255);
}
.swiper-pagination-bullet-active {
  background-color: white;
}

.swiper-button-prev2,
.swiper-button-next2 {
  position: absolute;
  top: 50%;
  margin-top: -12px;
  z-index: 10;
  cursor: pointer;
  opacity: 0.7;
}
.swiper-button-prev2:hover,
.swiper-button-next2:hover {
  opacity: 1;
}
.swiper-button-prev2 {
  left: 10px;
}
.swiper-button-next2 {
  right: 10px;
}
.swiper-button-prev2 img,
.swiper-button-next2 img {
  width: 20px;
}

.swiper-lazy-preloader {
  border-color: var(--wehome-color);
  border-top-color: transparent;
}

section#banners {
  margin-bottom: 50px;
}
section#banners div.item img {
  border-radius: 10px;
}
section#banners .swiper-pagination-bullet {
  background: var(--wehome-color);
}
section#banners .swiper-pagination-bullet-active {
  background-color: var(--wehome-color);
}

nav {
  height: 66px;
  border-top: 1px solid #9ea0a3;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #fff;
  z-index: 100;
  padding-bottom: calc(66px + env(safe-area-inset-bottom));
}
nav div.button_wrap {
  position: relative;
  width: 25px;
  height: 25px;
  margin: 13px auto 4px auto;
}
nav div.row a {
  text-decoration: none;
  color: #666;
  text-align: center;
  padding: 0;
}
nav div.row a:hover h2,
nav div.row a.on h2 {
  color: var(--wehome-color);
  font-weight: bold;
}
nav div.row a img {
  position: absolute;
  top: 0;
  left: 0;
}
nav div.row a img.over {
  opacity: 0;
  transition: 0.3s ease;
}
nav div.row a:hover img.over,
nav div.row a.on img.over {
  opacity: 1;
}
nav div.row h2 {
  font-size: 0.8em;
  font-weight: normal;
}

footer {
  padding: 5px;
  font-size: 0.8rem;
  margin-bottom: 120px;
}
footer dt {
  margin-bottom: 5px;
}
footer a {
  color: #000;
}
footer .copyright {
  padding: 15px;
  font-size: 0.8em;
}
footer .sns_link img {
  padding-bottom: 10px;
}
footer .app_link img {
  width: 130px;
  margin-bottom: 5px;
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
  width: 80%;
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
}

/* Small devices (landscape phones, 576px and up) */
@media (min-width: 576px) {
  div#wh_fav_area {
    width: 380px;
  }
}

/*  Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  footer {
    font-size: 1rem;
  }
  footer .sns_link img {
    width: 48px;
  }

  body {
    padding-top: 217px;
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
    width: 250px;
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

  nav {
    display: none !important;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  header {
    max-width: 1180px;
    margin: auto;
  }
  main,
  footer {
    max-width: 1180px;
    margin: 0 auto;
  }
}

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) {
  section#search {
    margin: 0 auto;
  }
}
</style>
