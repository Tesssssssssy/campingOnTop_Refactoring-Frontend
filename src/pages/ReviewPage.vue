<template>
  <div class="review-container">
    <div class="content-container">
      <div>
        <h2>작성한 리뷰 내역</h2>
      </div>
      <hr class="line">
      <div v-if="reviewStore.reviewList.length >0">
        <div class="review-details" v-for="review in reviewStore.reviewList" :key="review.id">
          <div class="review-item">
              <div class="review-top">
              <p class="order-num">Order {{ review.ordersNum }}</p>
              <p class="updated-at">{{ review.updatedAt }}</p>
            </div>
            <p class="house-name">{{ review.houseName }}</p>
            <p class="contents">{{ review.reviewContent }}</p>
            <p>
              <span class="star-rating">
                <span v-for="n in review.stars" :key="'filled-' + n" class="star filled">★</span>
                <span v-for="n in (5 - review.stars)" :key="'empty-' + n" class="star">★</span>
              </span>
            </p>
            <button class="review-button-update" @click="openModal(review)">리뷰 수정하기</button>
            <button class="review-button-delete" @click="deleteReview(review.reviewId)">리뷰 삭제하기</button>
            <br>
          </div>
        </div>
      </div>
      <div v-else class="reviewImage">
        <a href="/orders/complete">
          <img src="@/assets/images/home/NoReviewforReviewPage.jpg" alt="No Reviews">
        </a>
      </div>
      <div class="additional-actions">
        <router-link to="/">
          홈으로 돌아가기
        </router-link>
      </div>
    </div>

    <!-- 모달 -->
    <div v-if="isModalVisible" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <h3>리뷰 수정하기</h3>
        <form @submit.prevent="submitReview">
          <div class="form-group">
            <label for="review-content">리뷰 내용:</label>
            <textarea id="review-content" v-model="review.content" placeholder="리뷰 내용을 입력하세요." rows="4" required></textarea>
          </div>
          <div class="form-group star-rating">
            <label>별점:</label>
            <div class="stars">
              <span 
                v-for="n in 5" 
                :key="n" 
                :class="{'star': true, 'filled': review.stars >= n}" 
                @click="setStarRating(n)"
              >
                ★
              </span>
            </div>
          </div>
          <input type="hidden" v-model="review.id" />
          <button type="submit">제출</button>
          <button type="button" @click="closeModal">취소</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useReviewStore } from "@/stores/useReviewStore";

export default {
  name: "ReviewPage",
  data() {
    return {
      isModalVisible: false,
      review: {
        id: null,
        content: '',
        stars: 1
      }
    }
  },
  computed: {
    ...mapStores(useReviewStore),
  },
  async mounted() {
    await this.reviewStore.getReviewListByUser();
  },
  methods: {
    openModal(review) {
      this.review = {
        id: review.reviewId, // reviewId를 설정
        content: review.reviewContent,
        stars: review.stars
      };
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
      this.review = {
        reviewId: null,
        content: '',
        stars: 1
      };
    },
    setStarRating(stars) {
      this.review.stars = stars;
    },
    async submitReview() {
      try {
        const updatedReview = {
          reviewId: this.review.id, // Ensure reviewId is included
          content: this.review.content,
          stars: this.review.stars
        };
        await this.reviewStore.updateReview(updatedReview);
        alert('리뷰가 성공적으로 수정되었습니다.');
        this.closeModal();
        await this.reviewStore.getReviewListByUser(); // Refresh the review list
      } catch (error) {
        console.error('Error updating review:', error);
        alert('리뷰 수정에 실패했습니다. 다시 시도해 주세요.');
      }
    },
    async deleteReview(reviewId) {
      const userConfirmed = confirm("리뷰를 지우면 해당 결제 건에 대한 리뷰를 더이상 작성하실 수 없습니다. 그래도 지우시겠습니까?");

      if (!userConfirmed) {
        return;
      }

      try {
        await this.reviewStore.deleteReview(reviewId);
        alert('리뷰가 성공적으로 삭제되었습니다.');
        await this.reviewStore.getReviewListByUser(); // Refresh the review list
      } catch (error) {
        console.error('Error deleting review:', error);
        alert('리뷰 삭제에 실패했습니다. 다시 시도해 주세요.');
      }
    }
  }
}
</script>

<style scoped>
body {
  background-color: #F9F9F9;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100%;
}

.review-container {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.content-container {
  max-width: 800px;  /* 폭을 넓게 설정 */
  width: 100%;
  background: white;
  text-align: center;
  padding: 20px;
  border: 2px solid #ccc;
  border-radius: 10px;
  overflow-y: auto;
  max-height: 80vh;  /* 스크롤 가능하도록 최대 높이 설정 */
  margin-top: 170px;
}

.text-with-image {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  text-align: center;
  justify-content: center;
  color: #494949;
  font-size: 16px;
}

.text-with-image img {
  width: 130px;
  height: auto;
  margin-right: 10px;
  border-radius: 20%;
}

.review-container h2 {
  color: #333;
}

.content-container a {
  color: #333;
  text-decoration: none;
  margin: 0 10px;
  font-size: 14px;
}

.line {
  margin-top: 20px;
  border: 1px solid #ccc;
  height: 0px;
  background-color: #C2C8CC;
}

a {
  color: #333;
  text-decoration: none;
  transition: color 0.3s;
}

a:hover {
  color: #00AB03;
}

.review-details {
  text-align: left;
  margin-bottom: 20px;
}

.review-details p {
  margin: 10px 0;
}

.review-item {
  border: 1px solid #ddd;
  border-radius: 5px;
  padding: 15px;
  background-color: #f9f9f9;
}

.confirmation-message {
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 20px;
}

.additional-actions a {
  display: inline-block;
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  text-decoration: none;
  border-radius: 5px;
  margin-right: 10px;
}

.additional-actions a:hover {
  background-color: #45A049;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 5px;
  width: 400px;
  max-width: 90%;
}

.modal-content h3 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group textarea, .form-group select, .form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  margin-right: 10px;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button[type="submit"] {
  background-color: #4CAF50;
  color: white;
}

button[type="button"] {
  background-color: #f44336;
  color: white;
}

button[type="submit"]:hover {
  background-color: #45a049;
}

button[type="button"]:hover {
  background-color: #e53935;
}

/* 별점 스타일 */
.star-rating {
  display: flex;
}

.star {
  font-size: 24px; /* 별 모양의 크기 조절 */
  color: #d3d3d3; /* 비어있는 별의 색상 */
  cursor: pointer;
}

.star.filled {
  color: #f5b301; /* 채워진 별의 색상 */
}

.review-top {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;
}

.updated-at {
  font-size: 0.8em; 
  color: rgba(0, 0, 0, 0.5); 
  font-style: italic;
}

.order-num {
  font-size: 0.8em; 
  color: rgba(0, 0, 0, 0.5); 
  font-style: italic;
}

.contents {
  font-size: 1.2em;
  font-weight: 900;
  color: black; 
  padding: 5px;
}

.house-name {
  color: black;
}

.reviewImage {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 30vh;
  width: 100%;
}

.reviewImage img {
  width: 60%;
  height: auto; 
  object-fit: contain;
}
</style>