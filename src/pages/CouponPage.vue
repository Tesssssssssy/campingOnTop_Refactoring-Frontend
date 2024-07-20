<template>
    <div class="coupon-page">
        <h1>숙박 할인 쿠폰</h1>
        <button @click="requestCoupon" class="request-btn">쿠폰 받기</button>
        <p v-if="message" class="response-message">{{ message }}</p>
    </div>
</template>

<script>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { getTokenFromCookie } from "@/utils/authCookies";

export default {
    setup() {
        const message = ref('');
        const router = useRouter();

        const requestCoupon = async () => {
            const token = getTokenFromCookie('accessToken');
            const backend = process.env.VUE_APP_API_URL;
            // const backend = process.env.VUE_APP_LOCAL_URL;
            try {
                const response = await axios.post(`${backend}/coupons/request/FREE_CAMPING`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                message.value = response.data; // 서버에서 전달된 메시지를 사용
                // 성공 메시지에 따라 홈 페이지로 이동할 수 있도록 로직 추가
                if (response.data === "쿠폰 발급 요청이 되었습니다.") {
                    setTimeout(() => router.push('/'), 2000); // 2초 후 홈으로 리다이렉트
                }
            } catch (error) {
                message.value = error.response.data || "쿠폰 발급 요청에 실패했습니다.";
            }
        };

        return {
            message,
            requestCoupon
        };
    }
};
</script>

<style scoped>
.coupon-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: white;
    margin: 0;
    font-family: 'Arial', sans-serif;
}

h1 {
    color: #333;
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
</style>
