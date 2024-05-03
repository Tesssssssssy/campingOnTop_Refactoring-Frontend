<template>
  <div v-if="houseDetails" class="page-content">
    <main class="details center">
      <section>
        <div class="titleName">
          <h2 style="font-weight: bold">{{ houseDetails.name }}</h2>
        </div>
        <div class="card">
          <div class="swiper-container" style="height: 500px">
            <div class="swiper-wrapper">
              <div
                class="swiper-slide"
                v-for="(filename, index) in houseDetails.filenames"
                :key="index"
              >
                <img
                  :data-src="filename"
                  class="swiper-lazy"
                  alt=""
                  width="100%"
                />
                <div class="swiper-lazy-preloader"></div>
              </div>
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
          </div>
        </div>
        <div class="image_desc up_border">
          <span class="desc nodesc"></span>
        </div>
        <div class="type_detail">
          <table>
            <tr>
              <td>
                <div class="dt">주소</div>
                <div class="dd">{{ houseDetails.address }}</div>
              </td>
              <td>
                <div class="dt">최대인원</div>
                <div class="dd">{{ houseDetails.maxUser }}</div>
              </td>
              <td>
                <div class="dt">에어컨</div>
                <div v-if="houseDetails.hasAirConditioner" class="dd">
                  에어컨 보유
                </div>
                <div v-else class="dd">에어컨 없음</div>
              </td>
              <td>
                <div class="dt">세탁기</div>
                <div v-if="houseDetails.hasAirConditioner" class="dd">
                  세탁기 보유
                </div>
                <div v-else class="dd">세탁기 없음</div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="dt">침대</div>
                <div v-if="houseDetails.hasBed" class="dd">침대 보유</div>
                <div v-else class="dd">침대 없음</div>
              </td>
              <td>
                <div class="dt">히터</div>
                <div v-if="houseDetails.hasHeater" class="dd">히터 보유</div>
                <div v-else class="dd">히터 없음</div>
              </td>
              <td>
                <div class="dt">위도</div>
                <div class="dd">{{ houseDetails.latitude }}</div>
              </td>
              <td>
                <div class="dt">경도</div>
                <div class="dd">{{ houseDetails.longitude }}</div>
              </td>
            </tr>
          </table>
        </div>
      </section>

      <section id="description" class="section up_border">
        <h2 class="sul" style="font-weight: bold">설명</h2>
        <div class="sns_share">{{ houseDetails.content }}</div>
      </section>
      <section id="conditions" class="section2 up_border">
        <h2 style="font-weight: bold">가격</h2>

        <ul>
          <li>
            <span class="desc">1박당</span>
            <div class="price-container right">
              <span class="price">{{ houseDetails.price }}</span>
              <span class="unit">원</span>
            </div>
          </li>
        </ul>

        <h2 class="sang">상세정보</h2>
        <ul>
          <li>
            <span class="desc">체크인 시간(이후)</span>
            <span class="def right">오후 3:00</span>
          </li>

          <li>
            <span class="desc">체크아웃 시간(이전)</span>
            <span class="def right">오전 11:00</span>
          </li>

          <li>
            <span class="desc">취소 규정</span>
            <span class="def red right policy cancelp">
              2주 전 취소 (Strong Strict)
            </span>
          </li>

          <li>
            <span class="desc">추가 취소 규정</span>
            <span class="def red right policy cancelplong"
              >장기숙박규정 취소</span
            >
          </li>

          <span class="cart_right" @click="likesHouse()"> ❤️ 좋아요 </span>
          <span class="cart_right"> ❤️ {{ houseDetails.likeCnt }} </span>
          <div class="cart_date_1">
            <div class="cart_date">
              <label for="checkInDate" style="padding-left: 18px"
                >체크인 날짜:
              </label>
              <input
                type="date"
                id="checkInDate"
                class="checkDate"
                v-model="checkInDate"
              />
            </div>
            <div class="cart_date">
              <label for="checkOutDate">체크아웃 날짜: </label>
              <input
                type="date"
                id="checkOutDate"
                class="checkDate"
                v-model="checkOutDate"
              />
            </div>

            <span class="cart_right1" @click="addHouseToCart()">
              🛒 장바구니
            </span>
          </div>
        </ul>

        <ConfirmDialogComponent
          v-if="showCartConfirmDialog"
          :isVisible="showCartConfirmDialog"
          message="장바구니로 이동하시겠습니까?"
          :onConfirm="goToCart"
          :onCancel="cancelGoToCart"
        />
        <ConfirmDialogComponent
          v-if="showLikesConfirmDialog"
          :isVisible="showLikesConfirmDialog"
          message="좋아요 목록으로 이동하시겠습니까?"
          :onConfirm="goToLikes"
          :onCancel="cancelGoToLikes"
        />
      </section>

      <!--
        <section id="reviews" class="section2 up_border">
          <h2>이용후기</h2>
  
          <div class="up_border2 overall">
            <div class="result">
              <h3>전체 만족도</h3>
              <div class="overall_point">
                <span class="glyphicon glyphicon-star star"></span>
                <span class="glyphicon glyphicon-star star"></span>
                <span class="glyphicon glyphicon-star star"></span>
                <span class="glyphicon glyphicon-star star"></span>
                <span class="glyphicon glyphicon-star star"></span>
              </div>
              <div class="overall_desc"></div>
            </div>
  
            <ul class="stat">
              <li>
                <span class="stat_name">정확성</span>
                <span class="stat_point">
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                </span>
              </li>
              <li>
                <span class="stat_name">커뮤니케이션</span>
                <span class="stat_point">
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                </span>
              </li>
              <li>
                <span class="stat_name">청결성</span>
                <span class="stat_point">
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                </span>
              </li>
              <li>
                <span class="stat_name">위치</span>
                <span class="stat_point">
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                  <span class="glyphicon glyphicon-star star"></span>
                </span>
              </li>
            </ul>
          </div>
  
          <div class="review_list">
            <ul>
              <li data-id="3727">
                <span class="profile">
                  <a href="/profile/108882">
                    <img
                      src="https://d1ff1mcd5ly5rr.cloudfront.net/images/no_avatar.jpg"
                      width="80"
                      height="80"
                    />
                    <span>한나</span>
                  </a>
                </span>
                <span class="review_cont">
                  <div class="star_point">
                    <span class="glyphicon glyphicon-star star"></span>
                    <span class="glyphicon glyphicon-star star"></span>
                    <span class="glyphicon glyphicon-star star"></span>
                    <span class="glyphicon glyphicon-star star"></span>
                    <span class="glyphicon glyphicon-star star"></span>
                  </div>
                  <div class="reviewp">
                    <p class="review_memo review_origin">
                      숙소가 청결하고 사진처럼 따뜻한 공간이라서 머무는 동안
                      좋았습니다!<br />
                      오르막길에 숙소가 위치해 있어 택시타는 게 도움이 되었고,<br />
                      창문으로 내려다보는 해방촌 모습이 예쁩니다
                    </p>
                    <p class="review_memo translated hide"></p>
                  </div>
                  <div class="date">2023년 12월</div>
                </span>
              </li>
            </ul>
          </div>
  
          <div class="pager">
            <form id="reviewForm" enctype="multipart/form-data">
              <div>
                <label for="rating">별점:</label>
                <div id="rating" style="display: inline-block">
                  <span class="star" onclick="setRating(1)">&#9733;</span>
                  <span class="star" onclick="setRating(2)">&#9733;</span>
                  <span class="star" onclick="setRating(3)">&#9733;</span>
                  <span class="star" onclick="setRating(4)">&#9733;</span>
                  <span class="star" onclick="setRating(5)">&#9733;</span>
                </div>
              </div>
              <div>
                <input
                  type="text"
                  id="review"
                  name="review"
                  placeholder="리뷰를 작성해주세요"
                  style="width: 1200px; height: 150px; border-radius: 10px"
                />
              </div>
              <div>
                <input
                  type="file"
                  id="imageUpload"
                  name="image"
                  accept="image/*"
                  style="margin-top: 10px"
                />
                <label for="imageUpload" style="margin-left: 5px"></label>
              </div>
              <div>
                <button
                  type="submit"
                  style="margin-top: 10px; border-radius: 6px"
                >
                  리뷰 작성
                </button>
              </div>
            </form>
          </div>
        </section>
  -->
    </main>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useMemberStore } from "/src/stores/useMemberStore";
import { useHouseStore } from "/src/stores/useHouseStore";
import { useLikesStore } from "/src/stores/useLikesStore";
import { useCartStore } from "/src/stores/useCartStore";
import ConfirmDialogComponent from "/src/components/ConfirmDialogComponent.vue";

import Swiper from "swiper";

export default {
  data() {
    return {
      houseList: [],
      houseDetails: null,
      swiper: null,
      checkInDate: "",
      checkOutDate: "",
      showCartConfirmDialog: false,
      showLikesConfirmDialog: false,
    };
  },
  computed: {
    ...mapStores(useMemberStore, useHouseStore, useLikesStore, useCartStore),
  },
  components: { ConfirmDialogComponent },
  async mounted() {
    const id = this.$route.params.id;
    await this.houseStore.getHouseDetails(id);
    this.houseDetails = this.houseStore.houseDetails;
    this.$nextTick(() => {
      this.initializeSwiper();
    });
  },
  methods: {
    initializeSwiper() {
      var allImageSliders = document.querySelectorAll(".swiper-container");
      allImageSliders.forEach((sliderElement) => {
        var swiper = new Swiper(sliderElement, {
          loop: true,
          lazy: true,
          slidesPerView: 1,
          navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
          },
          pagination: {
            el: ".swiper-pagination",
            clickable: true,
          },
        });
        console.log(swiper);
      });
    },
    async likesHouse() {
      try {
        const userId = this.memberStore.decodedToken.id;
        const houseId = this.houseDetails.id;

        const response = await this.likesStore.likesHouse(userId, houseId);

        if (response.status === 200 && response.data) {
          console.log("House liked successfully!");
          this.showLikesConfirmDialog = true;
        } else {
          console.error("Failed to like the house.");
          alert("좋아요 목록에 추가 실패");
        }
      } catch (error) {
        console.error("Error while liking the house:", error);
      }
    },
    async addHouseToCart() {
      try {
        const token = window.localStorage.getItem("token");
        const houseId = this.houseDetails.id;

        const requestBody = {
          houseId: houseId,
          checkIn: this.checkInDate,
          checkOut: this.checkOutDate,
        };

        const response = await this.cartStore.addHouseToCart(
          token,
          requestBody
        );

        if (response.status === 200 && response.data) {
          console.log("House added to cart successfully!");
          this.showCartConfirmDialog = true;
        } else {
          console.error("Failed to add the house to cart.");
          alert("장바구니에 추가 실패!");
        }
      } catch (error) {
        console.error("Error while adding the house to cart:", error);
      }
    },
    goToCart() {
      this.showCartConfirmDialog = false;
      this.$router.push("/cart");
    },

    cancelGoToCart() {
      this.showCartConfirmDialog = false;
    },
    goToLikes() {
      this.showLikesConfirmDialog = false;
      this.$router.push("/likes");
    },

    cancelGoToLikes() {
      this.showLikesConfirmDialog = false;
    },
  },
};
</script>

<style scoped>
.card {
  padding: 0 8px 16px;
  border: none;
}

.image_desc {
  margin-top: 30px;
}
.swiper-container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
  border: none;
  max-height: 500px;
}
.swiper-slide {
  width: 30px;
  padding-top: 30px;
}
/* 스와이퍼 슬라이드 이미지 스타일 */
.swiper-slide img {
  height: auto;
  object-fit: cover;
}
.cart__list {
  width: 100%;
  max-width: 1200px; /* Set a maximum width for the table */
  margin: 0 auto 30px; /* Center the table horizontally */
  font-size: 14px;
  overflow-x: auto;
}

/* 양옆의 스와이퍼 버튼 스타일 */
.swiper-button-prev,
.swiper-button-next {
  color: #000;
  position: absolute;
  top: 50%; /* 버튼을 세로 중앙에 위치 */
  width: 50px; /* 버튼의 가로 크기 */
  height: 50px; /* 버튼의 세로 크기 */
  margin-top: -25px; /* 버튼의 세로 크기의 절반 값으로 마진을 설정하여 중앙에 위치 */
  z-index: 10;
}

.swiper-button-prev {
  left: 10px; /* 스와이퍼 컨테이너의 왼쪽에서 10px 떨어진 위치에 버튼을 배치 */
}

.swiper-button-next {
  right: 10px; /* 스와이퍼 컨테이너의 오른쪽에서 10px 떨어진 위치에 버튼을 배치 */
}

div.up_border,
section.up_border {
  border-top: 1px solid #ccc;
  padding-bottom: 30px;
}
div.image_desc {
  padding: 15px 24px;
  font-size: 12px;
  color: #808080;
}
div.image_desc span.nodesc {
  background: #fff;
}
div.image_desc span.image_page {
  float: right;
}
div.image_desc img {
  vertical-align: middle;
}
.swiper-slide img {
  display: block;
  width: 70%;
  height: 100%;
  object-fit: cover;
  margin: auto;
}

.titleName {
  font-size: 30px;
  font-weight:bolder
}

main {
  margin: 0 auto;
  width: 1200px;
}

.type_detail {
  border-collapse: collapse;
  width: 100%;
}

.type_detail table {
  width: 100%;
  border-collapse: collapse;
}

td {
  width: 400px;
}

.type_detail td {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

.type_detail .dt {
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.type_detail .dd {
  color: #666;
}

/* 홀수 행에 대한 스타일 */
.type_detail tr:nth-child(odd) {
  background-color: #f2f2f2;
}

/* 짝수 행에 대한 스타일 */
.type_detail tr:nth-child(even) {
  background-color: #ffffff;
}
.amnt_list {
  display: flex;
  flex-wrap: wrap;
}

.amnt_list dd {
  width: 33%; /* 각 항목이 전체 너비의 1/3을 차지하도록 설정 */
  box-sizing: border-box; /* 패딩과 보더가 너비에 포함되도록 설정 */
  padding: 10px; /* 원하는 패딩 설정 */
  /* 추가적인 스타일링 필요 */
}

/* 초기에 숨길 항목들을 위한 CSS */
.amnt_list dd:nth-child(n + 4) {
  display: none;
}

.swiper-container {
  overflow: hidden;
}
/* 더보기 버튼을 눌렀을 때 보여줄 항목들을 위한 CSS */
.show_more .amnt_list dd:nth-child(n + 4) {
  display: block;
}
#showMore {
  border: none; /* 테두리 제거 */
  color: skyblue; /* 글자 색상 하늘색으로 변경 */
  background-color: transparent; /* 배경색 투명으로 설정 */
  cursor: pointer; /* 마우스 오버 시 커서 변경 */
  padding: 10px 20px; /* 패딩 조정 */
  font-size: 16px; /* 글자 크기 조정 */
  display: block; /* 블록 요소로 설정하여 가운데 정렬 가능하게 함 */
  margin: 20px auto; /* 상하 마진 20px, 좌우 마진 자동으로 설정하여 가운데 정렬 */
}
#amenities {
  margin-top: 10px;
}
.sul {
  margin-top: 10px;
}
#rules {
  margin-top: 10px;
  padding-top: 10px;
}
#conditions {
  padding-top: 10px;
}
.section2 {
  border-top: 1px solid #e6e6e6; /* 상단에 테두리 추가 */
  padding: 30px 0; /* 패딩 추가 */
  margin-bottom: 40px;
}

.section2 h2,
.section2 h3 {
  color: #6200cd;
  margin-bottom: 20px; /* 제목 아래 마진 추가 */
}

.section2 ul {
  list-style: none; /* 기본 리스트 스타일 제거 */
  margin: 0; /* 기본 마진 제거 */
  padding: 0; /* 기본 패딩 제거 */
}

.section2 li {
  display: flex; /* 항목들을 플렉스 박스로 표시 */
  justify-content: space-between; /* 양쪽으로 내용을 분산 */
  align-items: center; /* 세로 중앙 정렬 */
  padding: 10px 0; /* 상하 패딩 추가 */
  border-bottom: 1px solid #e6e6e6; /* 항목들 아래 테두리 추가 */
}

.section2 .desc {
  font-size: 16px; /* 설명의 글자 크기 설정 */
  color: #666; /* 설명의 글자 색상 설정 */
  padding-bottom: 15px
}

.section2 .price,
.section2 .unit {
  font-size: 16px; /* 가격과 단위의 글자 크기 설정 */
  color: #333; /* 가격과 단위의 글자 색상 설정 */
}

.section2 .right {
  text-align: right; /* 오른쪽 정렬 */
}

.section2 .policy {
  color: #ff6b6b; /* 정책 글자 색상 설정 */
}
.swiper-container {
  width: 100%; /* 컨테이너의 가로 크기를 부모 요소에 맞춤 */
  max-width: 1200px; /* 최대 가로 크기를 1200px로 설정 */
  margin: auto; /* 상하 마진을 자동으로 설정하여 중앙 정렬 */
}

.cart_date {
  display: block; /* 블록 레벨 요소로 표시 */
  text-align: center; /* 텍스트 가운데 정렬 */ /* 상하 마진 추가 */ /* 패딩 추가 */
  color: black; /* 글자 색상 설정 */
  padding: 5px;
  font-size: 20px; /* 글자 크기 설정 */
  cursor: pointer; /* 마우스 오버 시 커서 변경 */
  border: none; /* 테두리 제거 */
}
.cart_date_1 {
  float: right;
  border: 1px solid black;
  padding: 15px;
  margin: 20px;
  margin-right: 0px;
  border-radius: 10px;
}
.checkDate {
  margin-left: 15px;
}

.cart_right {
  display: block;
  text-align: center;
  margin: 20px 10px 0 0;
  padding: 15px;
  background-color: #ec1818;
  color: white;
  font-size: 20px;
  cursor: pointer;
  border: none;
  border-radius: 15px;
  float: left; /* 오른쪽으로 붙이기 */
}
.cart_right1 {
  display: block;
  text-align: center;
  background-color: #ec1818;
  padding: 15px;
  color: white;
  font-size: 20px;
  cursor: pointer;
  border: none;
  border-radius: 15px;
  float: right;
  clear: both;
}

.price-container.right {
  margin-left: auto;
  display: flex;
}
.price {
  margin-right: 30px;
}
.sang {
  padding-top: 10px;
}
.star {
  color: #6800cd;
}
h2 {
  color: #6200cd;
  font-weight: bold
}
</style>
