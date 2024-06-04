<template>
  <div class="page-content">
    <div class="login-contents">
      <h2>로그인</h2>
      <div class="login-form-wrapper">
        <form id="loginForm" @submit.prevent="onLoginFormSubmit">
          <div class="form-input-userinfo-wrapper">
            <input
              class="form-input-userinfo"
              placeholder="아이디 (이메일)"
              type="text"
              id="email"
              name="email"
              v-model="email"
            />
          </div>
          <div class="form-input-userinfo-wrapper">
            <input
              class="form-input-userinfo"
              placeholder="비밀번호"
              type="password"
              id="password"
              name="password"
              v-model="password"
            />
          </div>
          <button id="loginBtn" class="form-user-btn">로그인</button>
        </form>
        <!--
        <div class="sns-login-wrapper">
          <h3 class="sns-login-text">SNS 계정으로 로그인하기</h3>
          <div class="sns-login-icon-wrapper">
            <div class="sns-login-icon">
              <button class="sns-login-icon-kakao" type="button">
                <i class="fa-solid fa-comment"></i>
                <span class="sns-login-icon-kakao-text">빠른 시작</span>
              </button>
              <div class="sns-login-three-second-wrapper">
                <p class="sns-login-three-second-text">
                  3초만에 시작하기<span
                    class="css-o8ddvr e1t9ajzo2"
                  ></span>
                </p>
              </div>
            </div>
            <div class="sns-login-icon">
              <button
                id="naverIdLogin"
                class="sns-login-icon-naver"
                type="button"
              >
                <i class="fa-solid fa-n"></i>
              </button>
            </div>
            <div class="sns-login-icon">
              <button class="sns-login-icon-facebook" type="button">
                <i class="fa-brands fa-facebook-f"></i>
              </button>
            </div>
            <div class="sns-login-icon">
              <button class="sns-login-icon-apple" type="button">
                <i class="fa-brands fa-apple"></i>
              </button>
            </div>
          </div>
        </div>
      -->
        <a class="signup-btn" href="/signUp">일반 회원가입</a>
        <a class="signup-btn" href="/sellerSignUp">판매자 회원가입</a>
        <!--
        <ul class="login-bottom-menu">
          <li class="login-bottom-menu-item">
            <a href="#">아이디 (이메일) 찾기</a>
          </li>
          <li class="login-bottom-menu-item">
            <a class="#" href="#">비밀번호 찾기</a>
          </li>
        </ul>
        -->
      </div>
    </div>
  </div>
</template>

<script>
import { mapStores } from "pinia";
import { useMemberStore } from "/src/stores/useMemberStore";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "test01@naver.com",
      password: "qwer1234@",
    };
  },
  computed: {
    ...mapStores(useMemberStore),
  },
  components: {},
  mounted() {},
  methods: {
    async onLoginFormSubmit() {
      try {
        await this.memberStore.login(this.email, this.password);
        // Redirect to the home page
        this.$router.push("/");
      } catch (error) {
        console.error("Login failed:", error);
        // Handle login error, e.g., show an error message to the user
      }
    },
  },
};
</script>

<style scoped>
.login-contents {
  max-width: 400px;
  margin: 0 auto;
  padding: 43px 0 50px;
}

.login-contents > h2 {
  margin-bottom: 20px;
  color: #000000;
  font-size: 44px;
  font-weight: 500;
  text-align: center;
}

.login-form-wrapper {
  padding-top: 18px;
  border-top: 4px solid #000000;
}

.form-input-userinfo-wrapper {
  margin-top: 8px;
  margin-bottom: 8px;
}

.form-input-userinfo {
  box-sizing: border-box;
  border: 1px solid #d4d4d4;
  border-radius: 2px;
  display: block;
  width: 100%;
  height: 48px;
  padding: 0 14px;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  outline: none;
}

.form-user-btn {
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  min-height: 25px;
  width: 100%;
  height: 56px;
  margin: 20px 0 0;
  background: #000000;
  border-radius: 2px;
  color: #ffffff;
  font-size: 16px;
  line-height: 56px;
  font-weight: 600;
}

.sns-login-wrapper {
  margin: 35px 0;
}

.sns-login-text {
  margin-bottom: 20px;
  font-weight: 500;
  font-size: 16px;
  text-align: center;
  line-height: 1.3;
  color: #000000;
}

.sns-login-icon-wrapper {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
}

.sns-login-icon {
  margin-right: 16px;
}

.sns-login-icon-kakao {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  min-width: 40px;
  min-height: 25px;
  width: 114px;
  height: 44px;
  border-radius: 100px;
  background: #ffde00;
}

.sns-login-icon-kakao-text {
  margin-left: 9px;
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  color: black;
}

.sns-login-three-second-wrapper {
  opacity: 1;
  display: flex;
  position: relative;
  -webkit-box-pack: center;
  justify-content: center;
  align-items: center;
  height: 100%;
  pointer-events: none;
  transition: opacity 0.3s;
}

.sns-login-three-second-text {
  z-index: 1;
  position: absolute;
  padding: 5px 11px;
  border: 1px solid #ff4800;
  border-radius: 2px;
  background: #ff4800;
  font-size: 12px;
  color: #ffffff;
  line-height: 14px;
  white-space: nowrap;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
}

.sns-login-icon-naver {
  width: 44px;
  height: 44px;
  border-radius: 100px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  background: #2db400;
}

.sns-login-icon-facebook {
  width: 44px;
  height: 44px;
  border-radius: 100px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  background: #3c5a99;
}

.sns-login-icon-apple {
  width: 44px;
  height: 44px;
  border-radius: 100px;
  color: white;
  font-size: 20px;
  font-weight: bold;
  background: black;
}

.coupon-text {
  padding: 40px 0 14px;
  font-weight: 500;
  font-size: 13px;
  text-align: center;
}

.coupon-text > a {
  text-decoration: underline;
  color: #ff4800;
}

.signup-btn {
  margin-top: 20px;
  display: block;
  height: 56px;
  border: 1px solid #5d5d5d;
  border-radius: 28px;
  box-sizing: border-box;
  font-weight: 600;
  font-size: 14px;
  color: #1d1d1d;
  text-align: center;
  line-height: 56px;
}

.login-bottom-menu {
  display: flex;
  -webkit-box-pack: center;
  justify-content: center;
  margin: 20px -20px 0;
  padding: 20px 0;
}

.login-bottom-menu-item {
  position: relative;
  display: inline-block;
  padding: 0 12px;
}

.login-bottom-menu-item > a {
  position: relative;
  padding: 20px 0;
  font-weight: 500;
  font-size: 10px;
  color: #5d5d5d;
}
</style>
