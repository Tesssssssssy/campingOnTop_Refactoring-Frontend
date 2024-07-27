<template>
  <div class="page-content">
    <main>
      <div class="signup-contents-wrapper">
        <h2 class="signup-title">일반 회원가입</h2>
        <div offset="100px" class="signup-contents">
          <i :class="`signup-progress-icon step${currentStep}`"></i>
          <div v-if="currentStep === 1" class="signup-agreement-wrapper">
            <h3 class="signup-agreement-info">캠핑온탑 서비스 이용약관 동의</h3>
            <div id="signup-contents">
              <div class="all-agreement-wrapper">
                <span @click="allAgree" class="all-agreement-span">
                  <input
                    v-model="allAgreed"
                    class="all-agreement-input agreement-check"
                    name="all"
                    type="checkbox"
                  />
                  <label class="all-agreement-label" for="all" title="all"
                    >모두 동의 (선택 정보 포함)</label
                  >
                </span>
              </div>
              <ul class="agreement-wrapper">
                <li
                  class="agreement-item-wrapper"
                  v-for="(agreement, index) in agreements"
                  :key="index"
                >
                  <span class="agreement-span">
                    <input
                      v-model="agreement.checked"
                      class="agreement-input agreement-check"
                      :name="agreement.name"
                      :id="agreement.name"
                      type="checkbox"
                      @change="checkAgreement"
                    />
                    <label
                      :for="agreement.name"
                      :title="agreement.name"
                      class="agreement-label"
                      >{{ agreement.label }}</label
                    >
                  </span>
                </li>
              </ul>
              <button
                @click="next"
                :class="{
                  'signup-progress-btn': true,
                  disabled: !isSubmitEnabled,
                }"
                :disabled="!isSubmitEnabled"
              >
                동의하고 가입하기
              </button>
            </div>
          </div>
          <div v-if="currentStep === 2" class="signup-email-wrapper">
            <h4 class="signup-email-title">
              회원가입을 위한 필수 정보 입력. <br />
              양식에 맞게 입력해 주세요.
            </h4>
            <div class="signup-email-contents">
              <input
                class="signup-email-input"
                placeholder="아이디 (이메일) 입력"
                v-model="email"
                type="text"
                id="email"
                name="email"
              />
            </div>
            <div class="signup-email-contents">
              <input
                class="signup-email-input"
                placeholder="비밀번호 입력 (특수문자/문자/숫자 포함 8-15자리 이내)"
                v-model="password"
                type="password"
                id="password"
                name="password"
              />
            </div>
            <div class="signup-email-contents">
              <input
                class="signup-email-input"
                placeholder="비밀번호 확인"
                v-model="passwordCheck"
                type="password"
                id="passwordCheck"
                name="passwordCheck"
              />
            </div>
            <div class="signup-email-contents">
              <input
                class="signup-email-input"
                placeholder="성명"
                v-model="name"
                type="text"
                id="name"
                name="name"
              />
            </div>
            <div class="signup-email-contents">
              <input
                class="signup-email-input"
                placeholder="닉네임"
                v-model="nickName"
                type="text"
                id="nickName"
                name="nickName"
              />
            </div>
            <div class="signup-email-contents">
              <input
                class="signup-email-input"
                placeholder="성별 (M / F (대문자))"
                v-model="gender"
                type="text"
                id="gender"
                name="gender"
              />
            </div>
            <div class="signup-email-contents">
              <input
                class="signup-email-input"
                placeholder="핸드폰 번호 (010-1111-1111)"
                v-model="phoneNum"
                type="text"
                id="phoneNum"
                name="phoneNum"
              />
            </div>
            <h6>
              다음 버튼을 누르면 인증 메일이 발송되고 있어 <br />
              약간의 지연 시간이 발생할 수 있습니다. <br />
              이메일 인증을 완료해야 <br />
              캠핑온탑의 모든 서비스를 이용할 수 있습니다.
            </h6>
            <button
              @click="submitRegistration"
              :disabled="!isSubmitEnabled"
              class="signup-progress-btn"
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "SignupPage",
  data() {
    return {
      currentStep: 1,
      allAgreed: false,
      email: "",
      password: "",
      passwordCheck: "",
      name: "",
      nickName: "",
      gender: "",
      phoneNum: "",
      agreements: [
        {
          name: "age",
          type: "checkbox",
          label: "[필수] 만 14세 이상입니다",
          checked: false,
        },
        {
          name: "term",
          type: "checkbox",
          label: "[필수] 이용약관 동의",
          checked: false,
        },
        {
          name: "requiredPrivacy",
          type: "checkbox",
          label: "[필수] 개인정보 수집 및 이용 동의",
          checked: false,
        },
        {
          name: "marketingPrivacy",
          type: "checkbox",
          label: "[선택] 마케팅 목적의 개인정보 수집 및 이용 동의",
          checked: false,
        },
        {
          name: "advertising",
          type: "checkbox",
          label: "[선택] 광고성 정보 수신 동의",
          checked: false,
        },
      ],
    };
  },
  computed: {
    isSubmitEnabled() {
      return (
        this.allAgreed ||
        this.agreements.slice(0, 3).every((agreement) => agreement.checked)
      );
    },
    isSignUpEnabled() {
      const isAllFieldsFilled =
        this.email &&
        this.password &&
        this.passwordCheck &&
        this.name &&
        this.nickName &&
        this.gender &&
        this.phoneNum;
      const isEmailValid = this.validateEmail(this.email);
      const isPasswordMatch = this.password === this.passwordCheck;
      return isAllFieldsFilled && isEmailValid && isPasswordMatch;
    },
  },
  methods: {
    allAgree() {
      this.allAgreed = !this.allAgreed;
      this.agreements.forEach((agreement) => {
        agreement.checked = this.allAgreed;
      });
    },
    checkAgreement() {
      this.allAgreed = this.agreements.every((agreement) => agreement.checked);
    },
    next() {
      this.currentStep++;
    },
    validateEmail(email) {
      const re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email.toLowerCase());
    },
    async submitRegistration() {
      // const backend = process.env.VUE_APP_API_URL;
      const backend = process.env.VUE_APP_LOCAL_URL;

      if (!this.isSignUpEnabled) return;
      try {
        const data = {
          email: this.email,
          password: this.password,
          name: this.name,
          nickName: this.nickName,
          gender: this.gender,
          phoneNum: this.phoneNum,
        }; 
        const response = await axios.post(
          `${backend}/user/signUp`,
          data
        );
        if (response.status === 200 && response.data) {
          alert(
            "이메일이 발송되었습니다.\n이메일을 확인하여 인증을 완료해야 모든 서비스를 이용할 수 있습니다."
          );
          this.$router.push("/login");
        } else {
          console.error("회원 가입 실패");
        }
      } catch (error) {
        console.error("회원가입 에러:", error);
      }
    },
    changeName(e) {
      this.name = e.target.value;
    },
    changeNickName(e) {
      this.nickName = e.target.value;
    },
  },
};
</script>

<style scoped>
@charset "utf-8";
@font-face {
  font-family: "S-CoreDream-3Light";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/S-CoreDream-3Light.woff")
    format("woff");
  font-weight: 400;
  font-style: normal;
}

footer {
  font-family: "S-CoreDream-3Light";
}

.signup-contents-wrapper {
  max-width: 400px;

  margin: 0 auto;
  padding-bottom: 10px;
}

.signup-title {
  margin-bottom: 34px;
  color: #000000;
  font-size: 44px;
  font-weight: 600;
  text-align: center;
}

.signup-progress-btn.disabled {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  min-width: 40px;
  min-height: 25px;
  width: 100%;
  height: 52px;
  background: rgb(196, 196, 196);
  color: rgb(255, 255, 255);
  font-size: 14px;
  font-weight: 700;
}

.signup-progress-btn.disabled:disabled {
  cursor: not-allowed;
}

.signup-progress-btn {
  display: flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  min-width: 40px;
  min-height: 25px;
  width: 100%;
  height: 52px;
  background: rgb(0, 0, 0);
  color: rgb(255, 255, 255);
  font-size: 14px;
  font-weight: 700;
}

.signup-contents {
  display: flex;
  position: relative;
  overflow-y: auto;
  height: auto;
  min-height: calc(100vh - 100px);
}

.signup-progress-icon {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 4px;
  background: #000000;
  transition: width 0.2s;
  z-index: 1;
}

.signup-progress-icon.step1 {
  width: 33%;
}

.signup-progress-icon.step2 {
  width: 66%;
}

.signup-progress-icon.step3 {
  width: 99%;
}

.signup-agreement-wrapper {
  position: relative;
  flex: 1 0 100%;
  padding-top: 18px;
  border-top: 4px solid #f4f4f4;
}

.signup-agreement-info {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  white-space: pre-wrap;
}

.all-agreement-wrapper {
  padding: 22px 0;
  margin-bottom: 15px;
  border-bottom: 1px solid #f4f4f4;
}

.all-agreement-span {
  display: inline-block;
  overflow: hidden;
  position: relative;
  vertical-align: top;
  min-width: 20px;
  min-height: 22px;
  line-height: 20px;
}

.all-agreement-input {
  overflow: hidden;
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: -1;
  width: 1px;
  height: 1px;
  border: 0;
  background: transparent;
  visibility: hidden;
  appearance: none;
}

.all-agreement-input:checked + label:before {
  border-color: #6800cd;
  background: #6800cd;
}

.all-agreement-label {
  display: inline-block;
  position: relative;
  z-index: 1;
  color: #303033;
  cursor: pointer;
  vertical-align: top;
  padding-left: 29px;
  font-size: 14px;
}

.all-agreement-label:before {
  position: absolute;
  top: 0;
  left: 0;
  background: #ffffff;
  border: 1px solid #d4d4d4;
  border-radius: 2px;
  text-align: center;
  content: "";
  width: 20px;
  height: 20px;
  transition: background-color 0.2s;
}

.all-agreement-label:after {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-width: 0 1px 1px 0;
  transform: rotate(45deg);
  content: "";
  top: 3px;
  left: 7px;
  width: 5px;
  height: 10px;
  box-sizing: content-box;
}

.agreement-wrapper {
  margin-bottom: 34px;
}
.agreement-item-wrapper {
  display: flex;
  -webkit-box-align: flex-start;
  align-items: flex-start;
}

.agreement-span {
  display: inline-block;
  overflow: hidden;
  position: relative;
  vertical-align: top;
  min-width: 20px;
  min-height: 20px;
  line-height: 20px;
}

.agreement-input {
  overflow: hidden;
  position: absolute;
  top: 2px;
  left: 2px;
  z-index: -1;
  width: 1px;
  height: 1px;
  border: 0;
  background: transparent;
  visibility: hidden;
  appearance: none;
}

.agreement-input:checked + label::after {
  border-color: #6800cd;
}

.agreement-label {
  display: inline-block;
  position: relative;
  z-index: 1;
  color: #303033;
  cursor: pointer;
  vertical-align: top;
  padding: 5px 0 5px 26px;
  font-size: 14px;
  line-height: 26px;
}
.agreement-label::after {
  position: absolute;
  border: 1px solid #d4d4d4;
  border-width: 0 1px 1px 0;
  transform: rotate(45deg);
  content: "";
  top: 50%;
  left: 6px;
  width: 6px;
  height: 11px;
  margin-top: -8px;
  box-sizing: content-box;
}

.signup-email-wrapper {
  height: auto;
  position: relative;
  flex: 1 0 100%;
  padding-top: 18px;
  border-top: 4px solid rgb(244, 244, 244);
  animation: 300ms ease-out 0s 1 normal forwards running animation-slide;
}

.signup-email-title {
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: 500;
  line-height: 28px;
  white-space: pre-wrap;
}

.signup-email-contents {
  margin-bottom: 30px;
}

.signup-email-input {
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

main {
  margin: 0 auto;
}

/*  Medium devices (tablets, 768px and up) */
@media (min-width: 100px) {
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  nav {
    display: none !important;
  }
  main {
    max-width: 1180px;
    margin: 0 auto;
  }

  .label {
    margin-bottom: 10px;
  }

  /* Extra large devices (large desktops, 1200px and up) */
  @media (min-width: 1200px) {
  }

  @keyframes animation-slide {
    0% {
      opacity: 0.9;
      transform: translateX(100%);
    }

    100% {
      opacity: 1;
      transform: translateX(0%);
    }
  }

  .label {
    margin-bottom: 10px;
  }
  div#pop_login div.login_cont,
  div.pop_auth div.login_cont {
    background-color: #fff;
    padding: 19px 31px;
  }

  a.pop_close {
    color: #9fa4b0;
    font-size: 16px;
    font-weight: normal;
    position: absolute;
    right: 0px;
    top: 0px;
    display: inline-block;
    height: 44px;
    width: 36px;
    overflow: hidden;
  }
  a.btn_fb {
    background-color: #1877f2;
    width: 100%;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    padding: 0;
  }
  a.btn_kakao {
    background-color: #fee500;
    width: 100%;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    padding: 0;
    color: #000000d9;
  }
  a.btn_naver {
    background-color: #03c75a;
    width: 100%;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    padding: 0;
    color: #fff;
  }
  a.btn_google {
    background-color: white;
    width: 100%;
    height: 40px;
    font-size: 16px;
    line-height: 40px;
    padding: 0;
    color: black;
    border: 0.5px solid black;
  }
}
</style>
