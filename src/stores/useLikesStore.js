import { defineStore } from "pinia";
import axios from "axios";

// const backend = "http://www.campingontop.kro.kr/api"; 
const backend = "http://localhost:8080"; 

export const useLikesStore = defineStore("likes", {
  state: () => ({ 
    likesList: [],
    isSelectedAll: false, 
  }),
  actions: {
    async getLikesList(userId) {
      try {
        const response = await axios.get(backend + "/likes/user/" + userId);
        console.log(response);

        // Ensure likesList is initialized as an array
        this.likesList = response.data.likesList
          ? Object.values(response.data.likesList)
          : [];
      } catch (error) {
        console.error("Error fetching likes list:", error);
        throw error;
      }
    },
    async likesHouse(userId, houseId) {
      try {
        const response = await axios.post(backend + "/likes/create", {
          userId,
          houseId,
        });

        return response;
      } catch (error) {
        console.error("Error while liking the house:", error);

        throw error;
      }
    },
    async deleteSelectedItems() {
      try {
        const selectedItems = this.likesList.filter(item => item.isSelected);
        for (let item of selectedItems) {
          await axios.patch(backend + `/likes/delete/${item.id}`);
          this.likesList = this.likesList.filter(likeItem => likeItem.id !== item.id);
        }
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        alert('삭제 처리 중 문제가 발생했습니다.');
      }
    },
  },
});
