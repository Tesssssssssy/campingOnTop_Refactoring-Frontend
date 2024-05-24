import { defineStore } from "pinia";
import axios from "axios";
import { useMemberStore } from './useMemberStore.js';

// const backend = "http://www.campingontop.kro.kr/api"; 
const backend = "http://localhost:8080";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartList: [],
    isSelectedAll: false,
    custom_data: [],
  }),
  actions: {
    async getCartList(userId) {
      try {
        let response = await axios.get(backend + "/cart/find/" + userId);
        this.cartList = response.data;

        console.log(response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching cart list:", error);
        throw error;
      }
    },
    async addHouseToCart(token, requestBody) {
      try {
        const response = await axios.post(backend + "/cart/add", requestBody, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the Bearer token
          },
        });

        return response;
      } catch (error) {
        console.error("Error while adding the house to cart:", error);
        throw error;
      }
    },
    async deleteSelectedItems() {
      try {
        const selectedItems = this.cartList.filter(item => item.selected);
        for (let item of selectedItems) {
          await axios.patch(backend + `/cart/delete/${item.id}`);
          this.cartList = this.cartList.filter(cartItem => cartItem.id !== item.id);
        }
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 처리 중 문제가 발생했습니다.');
      }
    },
    calculateTotalAmount() {
      return this.cartList.filter(item => item.selected)
        .reduce((acc, item) => acc + item.price, 0);
    },

    async processPayment() {
      const memberStore = useMemberStore();
      const totalAmount = this.calculateTotalAmount();
      const token = localStorage.getItem('token');
      const { IMP } = window;  // Iamport 결제 라이브러리를 로드
      IMP.init('imp32123581');  // 가맹점 식별 코드

      // 선택된 아이템의 custom_data 생성
      let customData = this.cartList.filter(item => item.selected).map(item => ({
        id: item.id,
        price: item.price
      }));
      
      IMP.request_pay({
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        merchant_uid: 'IMP' + new Date().getTime(),
        name: '장바구니 결제',
        amount: totalAmount,
        buyer_email: memberStore.decodedToken.email,
        buyer_name: memberStore.decodedToken.nickname,
        buyer_tel: "010-1111-1111",
        buyer_addr: "서울시 동작구 신대방동",
        buyer_postcode: '123-456',
        custom_data: customData   
      }, async (response) => {
        if (response.success) {
          console.log("결제 성공, imp_uid:", response.imp_uid);
          try {
            let validationResponse = await axios.post(`${backend}/orders/validation`, {
              impUid: response.imp_uid
            }, {
              headers: {
                'Authorization': `Bearer ${token}`,  // 'Bearer ' 접두사를 붙여 토큰을 전달
                'Content-Type': 'application/json'
              }
            });
            console.log("서버 응답:", validationResponse.data);
            if (validationResponse.status === 200) {
              window.location.href = "/orders/complete";
            } else {
              alert('결제 검증 실패');
            }
          } catch (error) {
            console.error("서버 응답 오류:", error);
            alert('결제 검증 과정에서 오류가 발생했습니다.');
          }
        } else {
          alert('결제에 실패하였습니다. 다시 시도해주세요.');
        }
      });
    },
  },
});
