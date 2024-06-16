import { defineStore } from "pinia";
import axios from "axios";
import { useMemberStore } from './useMemberStore.js';

const backend = "http://localhost:8080";

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartList: [],
    isSelectedAll: false,
    selectedCoupon: null,
    coupons: [],
    custom_data: [],
  }),
  getters: {
    finalCost: (state) => {
      const totalSelectedAmount = state.cartList.reduce((total, item) => {
        return item.selected ? total + item.price : total;
      }, 0);
      const discount = state.selectedCoupon ? state.coupons.find(c => c.id === state.selectedCoupon)?.price : 0;
      const finalAmount = totalSelectedAmount - (discount || 0);
      return Math.max(finalAmount, 0);
    }
  },
  actions: {
    async getCartList(userId) {
      try {
        let response = await axios.get(backend + "/cart/find/" + userId);
        this.cartList = response.data;
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
            Authorization: `Bearer ${token}`,
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
    async processPayment() {
      const memberStore = useMemberStore();
      const finalAmount = this.finalCost;
      console.log("finalAmount: ", finalAmount);

      if (finalAmount <= 0) {
        alert('결제할 금액이 부족합니다. 쿠폰 할인이 너무 높거나 선택된 항목이 없습니다.');
        return;
      }

      const token = localStorage.getItem('token');
      const apiKey = process.env.VUE_APP_PORTONE_API_KEY;

      if (!apiKey) {
        alert('결제 시스템 설정 오류입니다. 관리자에게 문의하세요.');
        return;
      }

      const { IMP } = window;
      IMP.init(apiKey);

      let customData = this.cartList.filter(item => item.selected).map(item => ({
        id: item.id,
        price: item.price
      }));

      IMP.request_pay({
        pg: 'kakaopay.TC0ONETIME',
        pay_method: 'card',
        merchant_uid: 'IMP' + new Date().getTime(),
        name: '캠핑온탑 장바구니 결제',
        amount: finalAmount,
        buyer_email: memberStore.decodedToken.email,
        buyer_name: memberStore.decodedToken.nickname,
        buyer_tel: "010-1111-1111",
        buyer_addr: "서울시 동작구 신대방동",
        buyer_postcode: '123-456',
        custom_data: JSON.stringify(customData)
      }, async (response) => {
        if (response.success) {
          try {
            let validationResponse = await axios.post(`${backend}/orders/validation`, {
              impUid: response.imp_uid,
              finalAmount: finalAmount
            }, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            if (validationResponse.data.isSuccess === true) {
              window.location.href = "/orders/complete";
            } else {
              alert('결제 검증 실패');
            }
          } catch (error) {
            console.error("서버 응답 오류:", error);
            alert('결제 검증 과정에서 오류가 발생했습니다.');
          }
        } else {
          alert(`결제에 실패하였습니다. 다시 시도해주세요. 오류: ${response.error_msg}`);
        }
      });
    }
  },
});
