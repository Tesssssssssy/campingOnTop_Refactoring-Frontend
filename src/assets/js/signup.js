import axios from "axios";

//회원가입 및 동의 절차 관련
export function next2() {
  console.log("test");

  let signup_email_wrapper = document.getElementsByClassName(
    "signup-email-wrapper"
  )[0];
  let signupContainer = signup_email_wrapper.parentElement;

  signup_email_wrapper.remove();

  let signup_progress_icon = document.getElementsByClassName(
    "signup-progress-icon"
  )[0];
  let step = signup_progress_icon.getAttribute("step");

  signup_progress_icon.classList.remove("step" + step);
  signup_progress_icon.classList.add("step" + (Number(step) + 1));
  signup_progress_icon.setAttribute("step", Number(step) + 1);

  let signup_email_contents = document.createElement("div");
  signup_email_wrapper.classList.add("signup-email-contents");

  signup_email_contents.innerHTML =
    '<div class="signup-email-wrapper"><h3 class="signup-email-title">회원가입 완료!<br>Welcome CampingOnTop</h3></div>';

  signupContainer.appendChild(signup_email_contents);
}

export function validationEmail(event) {
  let btn = document.getElementsByClassName("signup-progress-btn");

  if (event.value != "") {
    btn[0].classList.remove("disabled");
    btn[0].removeAttribute("disabled");
  } else {
    btn[0].classList.add("disabled");
    btn[0].setAttribute("disabled", "");
  }
}

export async function next() {
  let signupAgreementWrapper = document.querySelector(
    ".signup-agreement-wrapper"
  );

  if (signupAgreementWrapper) {
    let signupContainer = signupAgreementWrapper.closest(".signup-contents");

    if (signupContainer) {
      signupAgreementWrapper.remove();

      let signupProgressIcon = document.querySelector(".signup-progress-icon");
      let step = signupProgressIcon.getAttribute("step");
      signupProgressIcon.classList.remove("step" + step);
      signupProgressIcon.classList.add("step" + (Number(step) + 1));
      signupProgressIcon.setAttribute("step", Number(step) + 1);

      let signupEmailWrapper = document.createElement("div");
      signupEmailWrapper.classList.add("signup-email-wrapper");

      signupEmailWrapper.innerHTML =
        '<h4 class="signup-email-title">회원가입을 위한 필수 정보를 <br>입력해주세요.</h4><div class="signup-email-contents"><input class="signup-email-input" placeholder="아이디 (이메일) 입력" @input="validationEmail" v-model="email" type="text" id="email" name="email"></div><div class="signup-email-contents"><input class="signup-email-input" placeholder="비밀번호 입력" v-model="password" type="password" id="password" name="password"></div><div class="signup-email-contents"><input class="signup-email-input" placeholder="비밀번호 확인" v-model="passwordCheck" type="password" id="passwordCheck" name="passwordCheck"></div><div class="signup-email-contents"><input class="signup-email-input" placeholder="성명" v-model="name" type="text" id="name" name="name"></div><div class="signup-email-contents"><input class="signup-email-input" placeholder="닉네임" v-model="nickName" type="text" id="nickName" name="nickName"></div><div class="signup-email-contents"><input class="signup-email-input" placeholder="성별 (M / F)" v-model="gender" type="text" id="gender" name="gender"></div><div class="signup-email-contents"><input class="signup-email-input" placeholder="핸드폰 번호" v-model="phoneNum" type="text" id="phoneNum" name="phoneNum"></div><button @click="submitRegistration" class="signup-progress-btn disabled" id="signupBtn" :disabled="!isSubmitEnabled">다음</button>';
      signupContainer.appendChild(signupEmailWrapper);
    }
  }
}

export async function submitRegistration() {
  const backend = "http://13.125.229.218:8080";

  try {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let passwordCheck = document.getElementById("passwordCheck").value;
    let name = document.getElementById("name").value;
    let nickName = document.getElementById("nickName").value;
    let gender = document.getElementById("gender").value;
    let phoneNum = document.getElementById("phoneNum").value;

    if (password !== passwordCheck) {
      console.error("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    let data = {
      email: email,
      password: password,
      name: name,
      nickName: nickName,
      gender: gender,
      phoneNum: phoneNum,
    };

    let response = await axios.post(backend + "/user/sellerSignUp", data);

    console.log(response.data);

    if (response.data) {
      let ans = response.data;
      console.log("response:", ans);

      showEmailVerificationPage();
    } else {
      console.error("회원 가입 실패");
    }
  } catch (error) {
    console.error("회원가입 에러:", error);
  }
}

export function showEmailVerificationPage() {
  let signupContainer = document.getElementById("signupBtn");

  if (signupContainer !== null) {
    // 회원가입 완료 페이지 대신 이메일 인증 페이지를 보여줍니다.
    signupContainer.innerHTML = `
  <div id="emailVerification">
    <p>이메일로 전송된 인증 링크를 확인하여 인증을 완료해주세요.</p>
    <!-- 인증 관련 내용 및 링크 등을 표시하는 부분 -->
  </div>
`;
  }
}

export function checkAgreement() {
  let requiredTags = document.getElementsByClassName(
    "agreement-check required"
  );

  let requiredStatus = true;

  for (let i = 0; i < requiredTags.length; i++) {
    requiredStatus = requiredStatus && requiredTags[i].checked;
  }

  let btn = document.getElementsByClassName("signup-progress-btn");

  if (requiredStatus) {
    btn[0].classList.remove("disabled");
    btn[0].removeAttribute("disabled");
  } else {
    btn[0].classList.add("disabled");
    btn[0].setAttribute("disabled", "");
  }
}

export function allAgree() {
  let inputTags = document.getElementsByClassName("agreement-check");
  if (!inputTags[0].checked) {
    for (let i = 0; i < inputTags.length; i++) {
      inputTags[i].checked = true;
    }
  } else {
    for (let i = 0; i < inputTags.length; i++) {
      inputTags[i].checked = false;
    }
  }

  checkAgreement();
}

export function agree(event) {
  event.getElementsByTagName("input")[0].checked =
    !event.getElementsByTagName("input")[0].checked;

  let inputTags = document.getElementsByClassName("agreement-check");
  let temp = true;

  for (let i = 1; i < inputTags.length; i++) {
    temp = inputTags[i].checked && temp;
  }

  inputTags[0].checked = temp;
  checkAgreement();
}

let inputTags = document.getElementsByClassName("agreement-check");
for (let i = 1; i < inputTags.length; i++) {
  inputTags[i].addEventListener("click", agree);
}
