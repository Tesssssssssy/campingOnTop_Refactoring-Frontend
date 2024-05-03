import { defineStore } from "pinia";
import axios from "axios";

const backend = "http://www.campingontop.kro.kr/api"; 

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
  },
});
