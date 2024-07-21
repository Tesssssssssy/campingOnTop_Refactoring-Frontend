<template>
  <div class="order-container">
    <div class="content-container">
      <div>
        <h2>누적 결제 내역</h2>
      </div>
      <hr class="line">
      <div class="order-details" v-for="order in orders" :key="order.orderId">
        <p>주문번호: {{ order.orderId }}</p>
        <p>주문일시: {{ order.orderDate }}</p>
        <p>상품 이름: {{ order.houseName }}</p>
        <p>체크인: {{ order.checkIn }}</p>
        <p>체크아웃: {{ order.checkOut }}</p>
        <p>총 결제금액: {{ order.price }}원</p>
        <button class="review-button" @click="openModal(order.orderId)">리뷰 작성하기</button>
        <br>
      </div>
      <div class="additional-actions">
        <router-link to="/">
          홈으로 돌아가기
        </router-link>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>리뷰 작성하기</h3>
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <label for="review-content">리뷰 내용:</label>
            <textarea id="review-content" v-model="review.content" placeholder="리뷰 내용을 입력하세요." rows="4"
              required></textarea>
          </div>
          <div class="form-group star-rating">
            <label>별점:</label>
            <div class="stars">
              <span v-for="n in 5" :key="n" :class="{ 'star': true, 'filled': review.stars >= n }"
                @click="setStarRating(n)">
                ★
              </span>
            </div>
          </div>
          <input type="hidden" v-model="review.orderedHouseId" />
          <button type="submit">제출</button>
          <button type="button" @click="closeModal">취소</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getTokenFromCookie } from "@/utils/authCookies";

// const backend = process.env.VUE_APP_API_URL;
const backend = process.env.VUE_APP_LOCAL_URL;

export default {
  name: "OrderCompletePage",
  data() {
    return {
      orders: [],
      isModalVisible: false,
      review: {
        orderedHouseId: '',
        content: '',
        stars: 1
      }
    }
  },
  methods: {
    async getOrderList() {
      const token = getTokenFromCookie('accessToken');
      let response = await axios.get(backend + "/orders/list", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      if (response.data.result && response.data.result.length > 0) {
        this.orders = response.data.result;
      } else {
        console.error("주문 내역이 없습니다.");
      }
    },
    openModal(orderId) {
      this.review.orderedHouseId = Number(orderId);
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.review.content = '';
      this.review.stars = 1;
    },
    setStarRating(stars) {
      this.review.stars = stars;
    },
    async submitReview() {
      const token = getTokenFromCookie('accessToken');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };
      try {
        await axios.post(backend + "/review/create", this.review, { headers });
        alert('리뷰가 성공적으로 제출되었습니다.');
        this.closeModal();
      } catch (error) {
        if (error.response) {
          const errorMessage = error.response.data.message || "리뷰 제출에 실패했습니다. 다시 시도해 주세요.";
          alert(errorMessage);
          this.closeModal();
        } else {
          alert('리뷰 제출에 실패했습니다. 서버에서 응답이 없습니다.');
        }
      }
    }
  },
  mounted() {
    this.getOrderList();
  }
}
</script>

<style scoped>
body {
  background-color: #F9F9F9;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.order-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.content-container {
  max-width: 800px;
  /* 폭을 넓게 설정 */
  width: 100%;
  background: white;
  text-align: center;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
  overflow-y: auto;
  max-height: 80vh;
  /* 스크롤 가능하도록 최대 높이 설정 */
  margin-top: 170px;
}

.text-with-image {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  text-align: center;
  justify-content: center;
  color: #494949;
  font-size: 16px;
}

.text-with-image img {
  width: 130px;
  height: auto;
  margin-right: 10px;
  border-radius: 20%;
}

.order-container h2 {
  color: #333;
}

.content-container a {
  color: #333;
  text-decoration: none;
  margin: 0 10px;
  font-size: 14px;
}

.line {
  margin-top: 20px;
  border: 1px solid #ccc;
  height: 0px;
  background-color: #C2C8CC;
}

a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: #00AB03;
}

.order-details {
  text-align: left;
  margin-bottom: 20px;
}

.order-details p {
  margin: 10px 0;
}

.confirmation-message {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.additional-actions a {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  margin-right: 10px;
}

.additional-actions a:hover {
  background-color: #45A049;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 90%;
}

.modal-content h3 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group textarea,
.form-group select,
.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-right: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

button[type="button"]:hover {
  background-color: #e53935;
}

/* 별점 스타일 */
.star-rating .stars {
  display: flex;
  cursor: pointer;
}

.star-rating .star {
  font-size: 24px;
  color: #ccc;
  margin-right: 5px;
}

.star-rating .star.filled {
  color: #f5c518;
}
</style>
