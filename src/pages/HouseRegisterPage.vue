<template>
  <div class="page-content">
    <main class="newadd center">
      <div class="center">
        <h1 class="newest">🏕️ 숙소 등록🏕️ </h1>
        <h2 class="newest-content">캠핑온탑에서 방을 공유해서 수익도 올리고 <br>글로벌 친구도 사귀세요.
        </h2>

      </div>
      <div id="main">

        <form @submit.prevent="submitForm" enctype="multipart/form-data">
          <div class="input-group">
            <label for="name">이름: </label>
            <input class="input-group-type" type="text" id="name" name="name" v-model="formData.name" />
          </div>
          <br />
          <div class="input-group">
            <label for="content">소개: </label>
            <input class="input-group-type" type="text" id="content" name="content" v-model="formData.content" />
          </div>
          <br />
          <div class="input-group">
            <label for="price">이용 가격: </label>
            <input class="input-group-type" type="number" id="price" name="price" v-model="formData.price" />
          </div>
          <br />
          <div class="input-group">
            <label for="address">도로명 주소: </label><br />
            <input class="input-group-type" type="text" id="address" name="address" placeholder="서울 동작구 보라매로 87 (신이빌딩)"
              v-model="formData.address" />
            <button class="address-btn" @click="openPostcode">주소 검색</button>
          </div>
          <br />
          <div class="input-group">
            <label for="latitude">위도: </label><br />
            <input type="text" id="latitude" name="latitude" v-model="formData.latitude" />
          </div>
          <div class="input-group">
            <label id="longitude" for="longitude">경도: </label><br />
            <input type="text" id="longitude" name="longitude" v-model="formData.longitude" />
          </div>
          <div class="input-group">
            <label for="maxUser">최대 인원: </label>
            <input class="input-group-type" type="text" id="name" name="name" v-model="formData.maxUser" />
          </div>
          <div class="input-group">
            <label id="uploadFile" for="hasImage">이미지 : &nbsp; &nbsp;
            </label>
            <input type="file" id="hasImage" name="uploadFiles" @change="handleFileUpload" multiple />
            <p>이미지는 최대 5장까지 등록 가능합니다!</p>
            <br />
          </div>
          <br class="checkbox" />
          <h2 id="option">옵션</h2>
          <div class="checkbox">
            <div class="checkbox-option">
              <label for="hasAirConditioner">에어컨 &nbsp;</label>
              <input type="checkbox" id="hasAirConditioner" name="hasAirConditioner"
                v-model="formData.hasAirConditioner" /><br />
            </div>
            <div class="checkbox-option">
              <label for="hasWashingMachine">세탁기 &nbsp; </label>
              <input type="checkbox" id="hasWashingMachine" name="hasWashingMachine"
                v-model="formData.hasWashingMachine" />
            </div>
            <div class="checkbox-option">
              <label for="hasBed">침대 &nbsp;</label>
              <input type="checkbox" id="hasBed" name="hasBed" v-model="formData.hasBed" />
            </div>
            <div class="checkbox-option">
              <label for="hasHeater">히터 &nbsp;</label>
              <input type="checkbox" id="hasHeater" name="hasHeater" v-model="formData.hasHeater" />
            </div>
          </div>

          <div class="btns">
            <button type="submit" id="next_btn" class="btn btn_red continue_btn">
              등록
            </button>
          </div>
        </form>
      </div>
    </main>
  </div>
</template>

<script>
/* global kakao, daum */

import { mapStores } from "pinia";
import { useHouseStore } from "/src/stores/useHouseStore";

export default {
  name: "HouseRegisterPage",
  data() {
    return {
      formData: {
        name: "",
        content: "",
        price: null,
        address: "",
        latitude: "",
        longitude: "",
        maxUser: null,
        hasAirConditioner: false,
        hasWashingMachine: false,
        hasBed: false,
        hasHeater: false,
      },
      geocoder: null,  // Geocoder 인스턴스 저장
    };
  },
  mounted() {
    this.loadKakaoMapScript();
  },
  computed: {
    ...mapStores(useHouseStore),
  },
  methods: {
    async submitForm() {
      try {
        const response = await this.houseStore.createHouse(this.formData);
        if (response) {
          console.log("House created successfully:", response);
          alert("숙소 등록 성공!");
          this.$router.push("/details/" + response.id);
        }
      } catch (error) {
        console.error("Error creating house:", error);
      }
    },
    handleFileUpload(event) {
      this.formData.uploadFiles = Array.from(event.target.files);
    },

    // 카카오 맵 JavaScript SDK를 로드하는 메서드
    loadKakaoMapScript() {
      // API 키와 추가 라이브러리 매개변수를 포함하여 URL을 구성합니다
      const kakaoScriptUrl = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.VUE_APP_KAKAOMAP_API_KEY}&libraries=services,clusterer,drawing&autoload=false`;
      // 스크립트를 로드하고 카카오 맵 초기화를 위한 콜백을 전달합니다
      this.loadScript(kakaoScriptUrl, this.initializeKakaoMaps);
    },

    // 외부 스크립트를 동적으로 로드하는 함수
    loadScript(src, callback) {
      const script = document.createElement('script');
      script.src = src;
      script.onload = callback.bind(this);  // 콜백 함수에서 this 컨텍스트가 유지되도록 bind 사용
      script.onerror = (e) => {
        console.error("스크립트 로드 오류: ", e);
      };
      document.head.appendChild(script);  // 문서의 head에 스크립트 태그를 추가하여 로드
    },

    // 카카오 맵이 로드된 후 호출되는 초기화 함수
    initializeKakaoMaps() {
      kakao.maps.load(() => {
        this.geocoder = new kakao.maps.services.Geocoder(); // 지오코더 인스턴스 생성
        this.loadDaumPostcodeScript(); // 다음 우편번호 서비스 스크립트 로드
      });
    },

    // 다음 우편번호 서비스 스크립트를 로드하는 메서드
    loadDaumPostcodeScript() {
      const daumScriptUrl = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
      this.loadScript(daumScriptUrl, () => {
        console.log("다음 우편번호 스크립트 로드 완료.");
      });
    },

    // 주소 검색을 위한 팝업 창을 열고 주소 검색 완료 후 처리를 수행하는 메서드
    openPostcode() {
      const element_wrap = document.createElement('div');
      element_wrap.style = "position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%); border: 1px solid; width: 500px; height: 400px; background-color: white; z-index: 1000; box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);";
      document.body.appendChild(element_wrap);  // 생성된 div를 body에 추가

      new daum.Postcode({
        oncomplete: (data) => {
          this.formData.address = data.roadAddress; // 폼 데이터에 주소 저장
          if (this.geocoder) {
            this.geocoder.addressSearch(data.roadAddress, (results, status) => {
              if (status === kakao.maps.services.Status.OK) {
                this.formData.latitude = results[0].y;  // 위도 저장
                this.formData.longitude = results[0].x; // 경도 저장
              }
            });
          } else {
            console.error('지오코더가 초기화되지 않았습니다.');
          }
          document.body.removeChild(element_wrap);  // 사용이 끝난 element_wrap 제거
        },
        width: '100%',
        height: '100%'
      }).embed(element_wrap);  // 우편번호 찾기 위젯을 element_wrap에 삽입
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: #555;

}

body {
  background-color: #f5f5f5;
  font-size: 16px;
  color: #333;
  padding-top: 50px;
}

/* 주소 검색 버튼 스타일 */
.address-btn {
  padding: 10px 16px;
  margin-left: 30px;
  background-color: #007BFF;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.address-btn:hover {
  background-color: #0056b3;
}

#wrap {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid;
  width: 500px;
  height: 300px;
  background-color: white;
  z-index: 1000;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  /* 확장되는 내용이 모달 밖으로 나가지 않도록 */
}

/* 페이지 컨텐츠 스타일링 */
.page-content {
  display: flex;
  justify-content: center;
  padding: 20px;
}

.checkbox div {
  margin-right: -100px;
}

.checkbox label,
.checkbox input {
  display: inline-block;
}

.checkbox,
.btns {
  margin-left: 0px;
}


main.newadd {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 40px;
  margin: 40px;
  width: 80%;
  max-width: 1100px;
}


.input-group {
  margin-bottom: 20px;
}

#option {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
}

.newest {
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
}

.newest-content {
  text-align: center;
  margin-bottom: 20px;
}

.input-group-type,
input[type="text"],
input[type="number"] {
  width: calc(100% - 20px);
  padding: 10px;
  border: 1px solid #ccc;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  font-size: 14px;
}

/* 옵션 체크박스 스타일링 */

/* 버튼 스타일링 */
.btns {
  text-align: center;
  margin-top: 20px;
}

.page-content {
  margin-top: 100px;
}

.btn {
  background-color: #007BFF;
  /* Green */
  border: none;
  color: white;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 20px;
  font-weight: 40px;
  margin: 4px 2px;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #45a049;
}

/* 반응형 디자인 */
@media screen and (max-width: 768px) {
  main.newadd {
    width: 95%;
    padding: 20px;
  }

  .register_ {
    font-size: 24px;
  }
}
</style>
