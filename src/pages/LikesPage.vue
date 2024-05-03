<template>
  <div class="page-content">
    <main id="main">
      <section class="cart__list">
        <div class="cart__information">
          <h1 style="font-weight: bold;">좋아요</h1>
          <h6>
            😅 좋아요 목록 수정, 삭제 기능은 추후 구현 예정입니다. (추가만 가능)
          </h6>
        </div>
        <table class="cart__list">
          <thead>
            <tr>
              <td colspan="2">숙소 이미지</td>
              <td>숙소 이름</td>
              <td>숙소 주소</td>
              <td>예상 결제 비용</td>
            </tr>
          </thead>
          <tbody v-if="likesStore.likesList && likesStore.likesList.length > 0">
            <template
              v-for="(likesItem, index) in likesStore.likesList"
              :key="index"
            >
              <tr :class="{ 'selected-row': likesItem.isSelected }">
                <td colspan="2">
                  <img
                    v-if="likesItem.filenames && likesItem.filenames.length > 0"
                    :src="likesItem.filenames[0]"
                    alt="Likes Image"
                    style="width: 100px"
                  />
                </td>
                <td>
                  <router-link :to="'/details/' + likesItem.id">
                    {{ likesItem.name }}
                  </router-link>
                </td>
                <td>{{ likesItem.address }}</td>
                <td>{{ likesItem.price.toLocaleString() }}원</td>
              </tr>
            </template>
          </tbody>
          <tbody v-else>
            <tr>
              <td colspan="5">
                {{
                  likesStore.likesList
                    ? "좋아요 목록에 숙소가 없습니다."
                    : "Loading..."
                }}
              </td>
            </tr>
            <tr>
              <td colspan="5"><a href="/">숙소 찾아보기</a></td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useMemberStore } from "/src/stores/useMemberStore";
import { useLikesStore } from "/src/stores/useLikesStore";

export default {
  computed: {
    ...mapStores(useMemberStore, useLikesStore),
    selectAll: {
      get() {
        return (
          Array.isArray(this.likesStore.likesList) &&
          this.likesStore.likesList.length > 0 &&
          this.likesStore.likesList.every((item) => !!item.isSelected)
        );
      },
      set(value) {
        if (Array.isArray(this.likesStore.likesList)) {
          this.likesStore.likesList.forEach((item) => {
            this.$set(item, "isSelected", !!value);
          });
        }
      },
    },
  },
  methods: {
    toggleSelectAll() {
      this.selectAll = !this.selectAll;
    },
    async deleteSelectedLikes() {
      try {
        const selectedLikes = this.likesStore.likesList
          .filter((item) => item.isSelected)
          .map((item) => item.id);

        if (selectedLikes.length > 0) {
          await this.likesStore.deleteLikes(selectedLikes);

          this.likesStore.likesList.forEach((item) => {
            // Directly assign isSelected property
            item.isSelected = false;
          });
        } else {
          console.log("No likes selected");
        }
      } catch (error) {
        console.error("Error deleting selected likes:", error);
      }
    },
  },

  async mounted() {
    const userId = this.memberStore.decodedToken.id;
    console.log(userId);
    if (userId) {
      try {
        await this.likesStore.getLikesList(userId);

        if (Array.isArray(this.likesStore.likesList)) {
          this.likesStore.likesList.forEach((item) => {
            item.isSelected = false;
          });
        }
      } catch (error) {
        console.error("Error loading likes list:", error);
      }
    }
  },
};
</script>

<style scoped>
#main {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px; /* Adjusted left and right padding */
}
.cart {
  width: 100%;
  margin: 0 auto; /* Center the cart horizontally */
  padding: 20px;
  overflow-x: auto;
}
.cart__information {
  margin: 10px 0 0; /* Adjusted top margin for 좋아요 section */
}

.cancelLikes {
  display: inline-block; /* 블록 레벨 요소로 표시 */
  text-align: center; /* 텍스트 가운데 정렬 */
  margin: 10px 0; /* 상하 마진 추가 */
  padding: 10px 0; /* 패딩 추가 */
  background-color: #ff6b6b; /* 배경 색상 설정 */
  color: white; /* 글자 색상 설정 */
  font-size: 20px; /* 글자 크기 설정 */
  cursor: pointer; /* 마우스 오버 시 커서 변경 */
  border: none; /* 테두리 제거 */
  width: 200px;
}

.cart__list {
  width: 100%;
  max-width: 1200px; /* Set a maximum width for the table */
  margin: 0 auto 30px; /* Center the table horizontally */
  font-size: 14px;
  overflow-x: auto;
}

thead {
  text-align: center;
  font-weight: bold;
  background-color: #f2f2f2;
}
tbody {
  font-size: 12px;
}
td {
  padding: 15px;
  border-bottom: 1px solid lightgrey;
  text-align: center;
}
.cart__list td:nth-child(3) {
  width: 150px;
}
.cart__list td:nth-child(5),
.cart__list td:nth-child(6) {
  width: 150px;
}
.cart__list img {
  max-width: 100px;
  height: auto;
  display: block;
  margin: 0 auto;
}
.cart__list__optionbtn {
  display: block;
  text-align: left;
  margin-left: 75px;
}
.cart__list__optionbtn {
  background-color: white;
  font-size: 10px;
  border: lightgrey solid 1px;
  padding: 7px;
}
.cart__mainbtns {
  width: 100%;
  margin: 20px auto; /* Adjusted top and bottom margin */
}
.cart__bigorderbtn {
  width: 200px;
  height: 50px;
  font-size: 16px;
  margin: 0 auto; /* Center the button horizontally */
  border-radius: 5px;
  display: block;
}
.cart__bigorderbtn.left {
  background-color: white;
  border: 1px lightgray solid;
}
.cart__bigorderbtn.right {
  background-color: blue;
  color: white;
  border: none;
}
#tfoot_message {
  text-align: center;
  margin: 20px 0; /* Adjusted top and bottom margin */
  color: #666;
}
</style>
