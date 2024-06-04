<template>
    <div class="page-content">
      <main id="main">
        <section class="cart">
          <div class="cart__information">
            <h1 style="font-weight: bold">쿠폰</h1>
            <ul>
              <li>가격, 옵션 등 정보가 변경된 경우 주문이 불가할 수 있습니다.</li>
              <li>환불여부는 예약 시 동의한 ‘취소환불규정’에 따릅니다.</li>
            </ul>
          </div>
  
          <table class="cart__list">
            <thead>
              <tr>
                <td>
                  <input type="checkbox" v-model="allSelected" />
                  전체 선택
                </td>
                <td colspan="2">숙소 이미지</td>
                <td>숙소 이름</td>
                <td>숙소 주소</td>
                <td>체크인</td>
                <td>체크아웃</td>
                <td>예상 결제 비용</td>
              </tr>
            </thead>
  
            <tbody v-if="cartStore.cartList && cartStore.cartList.length">
              <tr v-for="cartItem in cartStore.cartList" :key="cartItem.id">
                <td>
                  <input type="checkbox" v-model="cartItem.selected" @change="updateAllSelected" />
                </td>
                <td colspan="2">
                  <img v-if="
                    cartItem.getFindHouseDtoResList &&
                    cartItem.getFindHouseDtoResList.length > 0
                  " :src="cartItem.getFindHouseDtoResList[0].filenames[0]" alt="Cart Image" style="width: 100px" />
                </td>
                <td>
                  <!-- Use router-link to create a link to /details/숙소id -->
                  <router-link :to="'/details/' + cartItem.getFindHouseDtoResList[0].id">
                    {{ cartItem.getFindHouseDtoResList[0].name }}
                  </router-link>
                </td>
                <td>{{ cartItem.getFindHouseDtoResList[0].address }}</td>
                <td>{{ cartItem.checkIn }}</td>
                <td>{{ cartItem.checkOut }}</td>
                <td>{{ cartItem.price.toLocaleString() }}원</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr>
                <td colspan="7">장바구니 목록에 숙소가 없습니다.</td>
              </tr>
              <tr>
                <td colspan="7"><a href="/">숙소 찾아보기</a></td>
              </tr>
            </tbody>
  
            <!-- 테이블 푸터 -->
            <tfoot>
              <tr>
                <td colspan="3">
                  <button @click="cartStore.deleteSelectedItems" class="cart__bigorderbtn right">선택 항목 삭제</button>
                </td>
                <td>
                  <h2 id="tfoot_message"></h2>
                </td>
                <td></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          
          <div class="cart__mainbtns">
            <button class="cart__bigorderbtn right" @click="cartStore.processPayment">결제하기</button>
          </div>
         
        </section>
      </main>
    </div>
  </template>
  
  <script>
  import { mapStores } from "pinia";
  import { useMemberStore } from "/src/stores/useMemberStore";
  import { useCartStore } from "/src/stores/useCartStore";
  import VueJwtDecode from "vue-jwt-decode";
  
  export default {
    computed: {
      ...mapStores(useMemberStore, useCartStore),
      allSelected: {
        get() {
          return this.cartStore.cartList.length > 0 && this.cartStore.cartList.every(item => item.selected);
        },
        set(value) {
          this.cartStore.cartList.forEach(item => {
            item.selected = value;
          });
          // 강제로 get 메소드를 호출하여 최신 상태 반영
          this.$nextTick(() => {
            this.allSelected; // 'get'을 호출하여 상태 갱신
          });
        }
      }
    },
    watch: {
      'cartStore.cartList': {
        deep: true,
        handler(cartList) {
          if (cartList.length > 0) {
            const allChecked = cartList.every(item => item.selected);
            if (this.allSelected !== allChecked) {
              this.allSelected = allChecked;
            }
          }
        }
      }
    },
    methods: {
      updateAllSelected() {
        const allChecked = this.cartStore.cartList.every(item => item.selected);
        if (this.allSelected !== allChecked) {
          this.allSelected = allChecked;
        }
      },
    },
    components: {},
    async mounted() {
      const token = window.localStorage.getItem("token");
      if (token) {
        try {
          await this.cartStore.getCartList(VueJwtDecode.decode(token).id);
        } catch (error) {
          console.error("Error loading cart list:", error);
        }
      }
    },
  };
  </script>
  
  <style scoped>
  body {
    margin: 0;
  }
  
  * {
    box-sizing: border-box;
  }
  
  p,
  span {
    margin: 0;
  }
  
  a {
    color: black;
  }
  
  #main {
    padding-right: 200px;
  }
  
  .cart {
    width: 120%;
    margin: auto;
    padding: 5px;
  }
  
  .cart ul {
    background-color: whitesmoke;
    padding: 30px;
    margin-bottom: 50px;
    border: whitesmoke solid 1px;
    border-radius: 5px;
    font-size: 13px;
    font-weight: 300;
  }
  
  .cart ul :first-child {
    color: black;
  }
  
  table {
    border-top: solid 1.5px black;
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
  }
  
  thead {
    text-align: center;
    font-weight: bold;
  }
  
  tbody {
    font-size: 12px;
  }
  
  td {
    padding: 15px 0px;
    border-bottom: 1px solid lightgrey;
  }
  
  .cart__list__detail :nth-child(3) {
    vertical-align: top;
  }
  
  .cart__list__detail :nth-child(3) a {
    font-size: 12px;
  }
  
  .cart__list__detail :nth-child(3) p {
    margin-top: 6px;
    font-weight: bold;
  }
  
  .cart__list__smartstore {
    font-size: 12px;
    color: gray;
  }
  
  .cart__list__option {
    vertical-align: top;
    padding: 20px;
  }
  
  .cart__list__option p {
    margin-bottom: 25px;
    position: relative;
  }
  
  .cart__list__option p::after {
    content: "";
    width: 90%;
    height: 1px;
    background-color: lightgrey;
    left: 0px;
    top: 25px;
    position: absolute;
  }
  
  .cart__list__optionbtn {
    display: inline-block;
    /* 블록 레벨 요소로 표시 */
    text-align: center;
    /* 텍스트 가운데 정렬 */
    padding-left: 10px;
    /* 패딩 추가 */
    padding-right: 10px;
    /* 패딩 추가 */
    padding-top: 10px;
    /* 패딩 추가 */
    padding-bottom: 10px;
    /* 패딩 추가 */
    background-color: #ff6b6b;
    /* 배경 색상 설정 */
    color: white;
    /* 글자 색상 설정 */
    font-size: 16px;
    /* 글자 크기 설정 */
    cursor: pointer;
    /* 마우스 오버 시 커서 변경 */
    border: none;
    /* 테두리 제거 */
    width: 125px;
  }
  
  .cart__list__detail :nth-child(4),
  .cart__list__detail :nth-child(5),
  .cart__list__detail :nth-child(6) {
    border-left: 2px solid whitesmoke;
  }
  
  .cart__list__detail :nth-child(5),
  .cart__list__detail :nth-child(6) {
    text-align: center;
  }
  
  .cart__list__detail :nth-child(5) button {
    background-color: limegreen;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 4px 8px;
    font-size: 12px;
    margin-top: 5px;
  }
  
  .cart__list th,
  .cart__list td {
    text-align: center;
    vertical-align: middle;
  }
  
  .cart__list td:nth-child(3) {
    width: 150px;
  }
  
  .cart__list td:nth-child(5),
  .cart__list td:nth-child(6) {
    width: 120px;
  }
  
  .cart__list img {
    max-width: 100px;
    height: auto;
    margin: 0 auto;
  }
  
  .cart__list__optionbtn {
    display: block;
    text-align: left;
    margin-left: 75px;
  }
  
  .price {
    font-weight: bold;
  }
  
  .cart__mainbtns {
    width: 420px;
    height: 200px;
    padding-top: 40px;
    display: block;
    margin: auto;
  }
  
  .cart__bigorderbtn {
    width: 200px;
    height: 50px;
    font-size: 16px;
    margin: auto;
    border-radius: 5px;
    display: block;
  }
  
  .cart__bigorderbtn.left {
    background-color: white;
    border: 1px lightgray solid;
  }
  
  .cart__bigorderbtn.right {
    background-color: #ff6b6b;
    /* 배경 색상 설정 */
    color: white;
    border: none;
  }
  
  #tfoot_message {
    text-align: center;
  }
  
  .wh_cont {
    max-width: 1180px;
    padding: 0 20px;
  }
  
  section#category {
    text-align: center;
    width: auto;
    overflow: hidden;
  }
  
  section#category div.category_slide {
    height: 50px;
    margin-bottom: 100px;
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
    font-size: 15px;
    color: #1c1c1c;
  }
  
  section#main_lists div.card div.card-body h6.card-subtitle {
    margin: 0 0 5px 0;
    color: #777;
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
  
  /*  Medium devices (tablets, 768px and up) */
  @media (min-width: 768px) {
    nav {
      display: none !important;
    }
  }
  
  /* Large devices (desktops, 992px and up) */
  @media (min-width: 992px) {
    main {
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
  