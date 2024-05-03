import { defineStore } from "pinia";
import axios from "axios";
import VueJwtDecode from "vue-jwt-decode";

// const backend = "http://13.125.229.218:8080";
// const backend = "http://192.168.0.115:8080";
// const backend = "http://52.78.9.103:9999/api";
const backend = "http://www.campingontop.kro.kr/api"; 

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
          this.setDecodedToken(userClaims); // Call setDecodedToken to update the store

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
  },
});
