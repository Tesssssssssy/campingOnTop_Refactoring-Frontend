<template>
     <div class="coupon-list-page">
        <h1>이벤트 쿠폰 목록</h1>
        <div v-if="coupons.length > 0" class="coupon-container">
            <div class="coupon" v-for="coupon in coupons" :key="coupon.value">
            <strong>쿠폰명:</strong> {{ coupon.name }}
            <p><strong>할인금액:</strong> {{ coupon.amount }}원</p>
            <p><strong>쿠폰 만료:</strong>  발급일로부터 {{ coupon.expiredTime }}일</p>
            <button @click="requestCoupon(coupon.value)" class="request-btn">쿠폰 받기</button>
            <p v-if="message" class="response-message">{{ message }}</p>
            </div>
        </div>
        <div v-else>
            <p>사용할 수 있는 쿠폰이 없습니다.</p>
        </div>
    </div>
  </template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { getTokenFromCookie } from "@/utils/authCookies";

export default {
    data() {
        return {
            coupons: [
                { name: '무료숙박권', value: 'FREE_CAMPING', amount: 10000, expiredTime: 14 },
                { name: '할인쿠폰', value: 'DISCOUNT', amount: 5000, expiredTime: 14},
                { name: '기프트카드', value: 'GIFT_CARD', amount: 20000, expiredTime: 14 },
            ],
        };
    },
    setup() {
        const message = ref('');
        const router = useRouter();

        const requestCoupon = async (optionValue) => {
            const token = getTokenFromCookie('accessToken');
            // const backend = process.env.VUE_APP_API_URL;
            const backend = process.env.VUE_APP_LOCAL_URL;
            try {
                const response = await axios.post(`${backend}/coupons/request/${optionValue}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                message.value = response.data.message;
                console.log(response.data)
                if (response.data === "쿠폰이 발급되었습니다.") {
                    const userConfirmed = confirm("쿠폰이 발급되었습니다! 쿠폰 내역 페이지로 이동하시겠습니까?");
                    if (userConfirmed) {
                        router.push('/my/coupon');
                    }
                }
            } catch (error) {
                // message.value = error.response.data.message || "이미 발급받은 쿠폰입니다!";
                alert(error.response.data.message || "이미 발급받은 쿠폰입니다!");
            }
        };

        return {
            message,
            requestCoupon,
        };
    },
};
</script>

<style scoped>
.coupon-list-page {
  margin-top: 300px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 100px;
  width: 80%;
  min-width: 300px;
}

.coupon-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.coupon {
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 20px;
  background-color: #f9f9f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s;
}

.coupon:hover {
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.request-btn {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s ease;
}

.request-btn:hover {
  background-color: #45a049;
}

.response-message {
  margin-top: 20px;
  color: #d32f2f;
  font-size: 14px;
}

h1 {
  color: #333;
  margin-bottom: 20px;
}
</style>
