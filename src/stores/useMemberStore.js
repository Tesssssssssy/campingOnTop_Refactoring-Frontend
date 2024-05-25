import { defineStore } from "pinia";
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";

// const backend = "http://www.campingontop.kro.kr/api"; 
const backend = "http://localhost:8080"; 

export const useMemberStore = defineStore("member", {
  state: () => ({
    isAuthenticated: false,
    decodedToken: null,
  }),
  actions: {
    async login(email, password) {
      try {
        let loginMember = { username: email, password: password };

        let response = await axios.post(backend + "/user/login", loginMember);

        if (response.status === 200 && response.data.token !== null) {
          let token = response.data.token;
          let userClaims = VueJwtDecode.decode(token);

          window.localStorage.setItem("token", token);
          this.setDecodedToken(userClaims); 

          this.isAuthenticated = true;
        } else {
          console.error("토큰 발급 실패");
        }
      } catch (error) {
        console.error("Login failed:", error);
      }
    },

    setDecodedToken(decodedToken) {
      this.decodedToken = decodedToken;
    },

    logout() {
      window.localStorage.removeItem("token");
      this.isAuthenticated = false;
      this.decodedToken = null;
    },

    checkTokenExpiration() {
      const token = window.localStorage.getItem("token");
      if (token) {
        const decoded = VueJwtDecode.decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          this.logout();
          alert("로그인 만료시간이 되어 로그아웃되었습니다.");
          window.location.href = "/login";
        }
      }
    },
  },
});
