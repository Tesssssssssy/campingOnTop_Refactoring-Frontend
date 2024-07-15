<template>
    <div class="coupon-list-page">
      <h1>내 쿠폰 목록</h1>
      <div v-if="coupons.length > 0">
        <div class="coupon" v-for="coupon in coupons" :key="coupon.id">
          <p><strong>쿠폰명:</strong> {{ coupon.eventName }}</p>
          <p><strong>할인금액:</strong> {{ coupon.price }}원</p>
          <p><strong>발급 일자:</strong> {{ formatDate(coupon.issuedAt) }}</p>
        </div>
      </div>
      <div v-else>
        <p>사용할 수 있는 쿠폰이 없습니다.</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { getTokenFromCookie } from "@/utils/authCookies";
  
  export default {
    data() {
      return {
        coupons: [],
      };
    },
    created() {
      this.fetchCoupons();
    },
    methods: {
      async fetchCoupons() {
        const token = getTokenFromCookie('accessToken');
        try {
          // const response = await axios.get('http://localhost:8080/coupons/my', {
          const response = await axios.get('http://www.campingontop.kro.kr/api/coupons/my', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.coupons = response.data;
        } catch (error) {
          console.error('Failed to fetch coupons:', error);
        }
      },
      formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.getFullYear() + '-' + 
               (date.getMonth() + 1).toString().padStart(2, '0') + '-' + 
               date.getDate().toString().padStart(2, '0') + ' ' + 
               date.getHours().toString().padStart(2, '0') + '시 ' + 
               date.getMinutes().toString().padStart(2, '0') + '분';
      }
    }
  };
  </script>
  
  <style scoped>
  .coupon-list-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: 300px;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: 100px;
    width: 50%;
    min-width: 300px;
  }
  
  .coupon {
    border: 1px solid #ccc;
    border-radius: 10px;
    padding: 20px;
    margin-top: 20px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    transition: box-shadow 0.3s;
  }
  
  .coupon:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
  }
  
  h1 {
    color: #333;
    margin-bottom: 20px;
  }
  </style>
  