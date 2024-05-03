import { defineStore } from "pinia";
import axios from "axios";

// const backend = "http://13.125.229.218:8080";
// const backend = "http://192.168.0.115:8080";
// const backend = "http://52.78.9.103:9999/api";
const backend = "http://www.campingontop.kro.kr/api"; 

export const useLikesStore = defineStore("likes", {
  state: () => ({ likesList: [] }),
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
    async deleteLikes(likeIds) {
      try {
        for (const likeId of likeIds) {
          await axios.patch(backend + "/likes/delete/" + likeId);
        }
        alert("선택한 숙소가 좋아요 목록에서 삭제되었습니다.");
      } catch (error) {
        console.error("Error deleting likes:", error);
        throw error;
      }
    },
  },
});
