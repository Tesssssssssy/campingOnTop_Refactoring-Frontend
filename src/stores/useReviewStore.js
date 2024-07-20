import { defineStore } from "pinia"
import axios from "axios";
import { getTokenFromCookie } from "@/utils/authCookies"; // 쿠키 관리 유틸리티 임포트

const backend = process.env.VUE_APP_API_URL;
// const backend = process.env.VUE_APP_LOCAL_URL;

export const useReviewStore = defineStore("review", {
    state: () => ({ 
      reviewList: [],
    }),
    actions: {

      async getReviewListByUser() {
        try {
            const token = getTokenFromCookie('accessToken'); // 토큰 쿠키에서 가져오기
    
            const headers = {
                Authorization: `Bearer ${token}`,
            };
    
            const response = await axios.get(backend + "/review/mylist/", { headers });
            console.log(response);
    
            this.reviewList = response.data.list ? response.data.list : [];
        } catch (error) {
            console.error("Error fetching review list:", error);
            throw error;
        }
    },

      async getReviewListByHouseId(houseId) {
        try {
          const response = await axios.get(backend + "/review/find/" + houseId);
          console.log(response);
  
          this.reviewList = response.data.list ? response.data.list : [];
        } catch (error) {
          console.error("Error fetching review list:", error);
          throw error;
        }
      },

      async createReview(postCreateReviewDtoReq) {
        try {
          const token = getTokenFromCookie('accessToken'); // 토큰 쿠키에서 가져오기
          
          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json', // Set content type to application/json
          };
          
          const response = await axios.post(
            backend + '/review/create', 
            JSON.stringify(postCreateReviewDtoReq), 
            { headers }
          );
          
          console.log(response.data);
          return response.data;
        } catch (error) {
          console.error(error);
        }
      },

      async updateReview(updateReviewDtoReq) {
        try {
          const token = getTokenFromCookie('accessToken');
          const headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          };
          console.log('Updating review:', updateReviewDtoReq);
          const response = await axios.patch(backend + '/review/update', updateReviewDtoReq, { headers });
          return response.data;
        } catch (error) {
          console.error(error);
        }
      },

      async deleteReview(reviewId) {
        try {
          const token = getTokenFromCookie('accessToken');
          const headers = {
            Authorization: `Bearer ${token}`,
          };
          const response = await axios.patch(backend + `/review/delete/${reviewId}`, null, { headers });
          return response.data;
        } catch (error) {
          console.error(error);
        }
      },
    },
  });