import { defineStore } from "pinia";
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";
import { getTokenFromCookie, setTokenCookies, deleteTokenCookies } from "@/utils/authCookies"; // 쿠키 관리 유틸리티 임포트

const backend = process.env.VUE_APP_API_URL;
// const backend = process.env.VUE_APP_LOCAL_URL;

export const useMemberStore = defineStore("member", {
  state: () => ({
    isAuthenticated: false,
    decodedToken: null,
    tokenRefreshInterval: null, // 토큰 갱신 인터벌을 저장하기 위한 변수
  }),
  actions: {
    async login(email, password) {
      try {
        let loginMember = { username: email, password: password };
        let response = await axios.post(`${backend}/user/login`, loginMember);

        if (response.status === 200 && response.data.token) {
          setTokenCookies(response.data.token, response.data.refreshToken); // 로그인 시 받은 토큰을 쿠키에 저장

          let userClaims = VueJwtDecode.decode(response.data.token);
          this.setDecodedToken(userClaims);
          this.isAuthenticated = true;
          this.startTokenRefreshInterval(); // 로그인 시 토큰 갱신 인터벌 설정
        } else {
          console.error("토큰 발급 실패");
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },

    // 리프레시 토큰을 사용하여 액세스 토큰 갱신
    async refreshAccessToken() {
      try {
        const refreshToken = getTokenFromCookie('refreshToken'); // 쿠키에서 리프레시 토큰을 가져옴
        if (!refreshToken) {
          throw new Error("No refresh token available."); // 리프레시 토큰이 없으면 예외 처리
        }
        let response = await axios.post(`${backend}/user/refresh`, { refreshToken });

        if (response.status === 200 && response.data.token && response.data.refreshToken) {
          setTokenCookies(response.data.token, response.data.refreshToken); // 새로운 액세스 토큰과 리프레시 토큰을 쿠키에 저장

          let userClaims = VueJwtDecode.decode(response.data.token);
          this.setDecodedToken(userClaims);
          this.isAuthenticated = true;
        } else {
          console.error("Failed to refresh the access token.");
          this.logout(); // 토큰 갱신 실패 시 로그아웃 처리
        }
      } catch (error) {
        console.error("Failed to refresh token:", error);
        this.logout();
      }
    },

    setDecodedToken(decodedToken) {
      this.decodedToken = decodedToken;
    },

    // 로그아웃 시 모든 토큰 삭제 및 갱신 인터벌 해제
    logout() {
      deleteTokenCookies(); // 모든 토큰을 쿠키에서 삭제
      this.isAuthenticated = false;
      this.decodedToken = null;
      clearInterval(this.tokenRefreshInterval); // 로그아웃 시 토큰 갱신 인터벌 해제
    },

    // 액세스 토큰의 만료 시간을 체크하고 만료 1분 전에 갱신
    checkTokenExpiration() {
      const accessToken = getTokenFromCookie('accessToken'); // 쿠키에서 액세스 토큰을 가져옴
      if (accessToken) {
        const decoded = VueJwtDecode.decode(accessToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp - currentTime < 60) { // 1분 전에 갱신
          this.refreshAccessToken();
        }
      }
    },

    // 주기적으로 토큰 만료를 확인하여 갱신
    startTokenRefreshInterval() {
      if (this.tokenRefreshInterval) {
        clearInterval(this.tokenRefreshInterval);
      }
      this.tokenRefreshInterval = setInterval(() => {
        this.checkTokenExpiration();
      }, 30000); // 30초마다 토큰 만료 확인
    },
  },
});