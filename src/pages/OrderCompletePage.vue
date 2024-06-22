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
        <br>
      </div>
      <div class="additional-actions">
        <router-link to="/">
          홈으로 돌아가기
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getTokenFromCookie } from "@/utils/authCookies";

// const backend = "http://www.campingontop.kro.kr/api"; 
const backend = "http://localhost:8080"; 

export default {
  name: "OrderCompletePage",
  data() {
    return {
      orders: []
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
  max-width: 800px;  /* 폭을 넓게 설정 */
  width: 100%;
  background: white;
  text-align: center;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
  overflow-y: auto;
  max-height: 80vh;  /* 스크롤 가능하도록 최대 높이 설정 */
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
</style>
