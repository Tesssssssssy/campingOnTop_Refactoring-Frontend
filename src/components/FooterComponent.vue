<template>
  <footer>
    <div class="container-fluid">
      <br />
      <div class="row">
        <div class="col-sm">
          <div class="row">
            <div class="col">
              <dl>
                <dt>고객서비스</dt>
                <dd><a href="#">연락처</a></dd>
                <dd><a href="#" target="_blank">이용약관</a></dd>
                <dd><a href="#">개인정보보호정책</a></dd>
                <dd><a href="#" target="_blank">공유숙박 실증특례</a></dd>
              </dl>
            </div>
            <div class="col">
              <dl>
                <dt>캠핑온탑 소개</dt>
                <dd><a href="#">회사 소개</a></dd>
                <dd><a href="#">팀 소개</a></dd>
                <dd><a href="#">인재채용</a></dd>
                <dd><a href="#">언론보도</a></dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <img src="@/assets/images/footer/ic_kakaopay.png" alt="Kakao Pay" width="50" />
        </div>
      </div>
    </div>
    <div class="copyright">
      <address>
        회사명 (주)캠핑온탑 | 대표 임태우 | 개인정보보호책임자 길민석 | 사업자등록번호 000-00-00000 | 과학기술정통부 공유숙박 규제특례 번호
        0000-00-0호 | 통신판매업 신고번호 0000-서울동작-0000 | 관광사업등록번호 서울동작0000-00000 | 공유도시서울지정번호 서울시지정 제 000호 |
        벤처기업등록번호 제000000000000000
        <br /><br />
        고객센터: 0000-0000 운영시간: 평일 10시~12시 / 13시~18시 (주말, 공유일 휴무)<br />
        주소: 서울특별시 동작구 보라매로 87 플레이데이터 3층 <br />
        이메일: dlaxodn9999@gmail.com | 사업제휴문의: dlaxodn9999@gmail.com
      </address>
      <p class="disclaim">
        캠핑온탑은 통신판매중개자이며 통신판매의 당사자가 아닙니다. 따라서 상품·거래정보 및 거래에 대하여 책임을 지지않습니다.
      </p>
      <p>&copy;2024 campingOnTop. All rights reserved</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: "FooterComponents",
};
</script>

<style scoped>
footer {
  padding-top: 50px;
  padding-bottom: 50px;
  font-size: 0.8rem;
  background-color: #FFFFFF;
}

img {
  margin-right: 10px;
}

footer dt {
  margin-bottom: 5px;
}
footer a {
  color: #000;
}
footer .copyright {
  padding: 15px;
  font-size: 0.8em;
}
footer .sns_link img {
  padding-bottom: 10px;
}
footer .app_link img {
  width: 130px;
  margin-bottom: 5px;
}

/*  Medium devices (tablets, 768px and up) */
@media (min-width: 768px) {
  footer {
    font-size: 1rem;
  }
  footer .sns_link img {
    width: 48px;
  }
}

/* Large devices (desktops, 992px and up) */
@media (min-width: 992px) {
  footer {
    max-width: 1180px;
    margin: 0 auto;
    clear: both;
  }
}
</style>
