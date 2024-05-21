import { defineStore } from "pinia";
import axios from "axios";

// const backend = "http://www.campingontop.kro.kr/api"; 
const backend = "http://localhost:8080"; 

export const useCartStore = defineStore("cart", {
  state: () => ({
    cartList: [],
    isSelectedAll: false,
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
    }    
  },
});
