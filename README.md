# 🏕️ 캠핑온탑 campingOnTop

![캠핑온탑 로고](https://github.com/Tesssssssssy/HanwhaBC-be02-campingOnTop-config/assets/105422037/177289fc-5e89-4907-aea1-c5eb453c4059)
![캠핑온탑-001](https://github.com/beyond-sw-camp/be02-2nd-MTM-cityCamp/assets/105422037/90d4ac16-a769-498b-912a-7ca4265230ad)

<br>
<br>

# 💪 팀원 구성

<div align="left">

|                    **임태우**                    |                 **길민석**                 |                **한경훈**                |                   **이준국**                    |                **장대현**                |
| :----------------------------------------------: | :----------------------------------------: | :--------------------------------------: | :---------------------------------------------: | :--------------------------------------: |
| [@Tesssssssssy](https://github.com/Tesssssssssy) | [@gilms0730](https://github.com/gilms0730) | [@Kyungqq](https://github.com/heejiyang) | [ @Lee-Jun-Guk](https://github.com/Lee-Jun-Guk) | [@poil4291](https://github.com/poil4291) |

</div>

<br>
<br>


# 배포 URL
- [campingOnTop](http://www.campingontop.kro.kr)

<br>
<br>

# ✒️ 사용 기술 스택
<details>
<summary><b style="font-size: 18px;">기술 설명</b></summary>

### Vue.js
- 컴포넌트 기반의 모듈화로 코드를 재사용하기에 유지보수를 하기 간편하다. 
- 데이터 바인딩을 통해 모델과 뷰를 손쉽게 동기화할 수 있으며, 가상 DOM을 활용하여 실제 DOM 조작을 최소화하여 성능을 향상시킨다.
- 기존 html, js를 사용할 떄와 달리 Store, Pinia 등을 이용해 불필요한 데이터 조회를 줄여 결과적으로 서버에 부담을 줄일 수 있다.
- <b>Pinia, Store</b>
  - Vue.js에서 제공하는 Pinia, Store 기능을 활용해 최대한 동적으로 페이지, 데이터를 제공할 수 있도록 구현했다. 
  - 기존에 HTML, JS에서 페이지 이동 등을 통해 데이터 제공, 페이지 접근을 할 수 있었지만 <br>
   Pinia, Store를 활용해 가상 DOM 등을 이용했기 때문에 유저가 빠르고 쾌적하게 서비스를 이용할 수 있도록 구현했다. 

### JWT
- 페이로드에 필요한 사용자 정의 데이터를 포함할 수 있어, 다양한 환경에서 다양한 요구사항을 충족한다. <br>
 특히 campingOnTop은 id, nickname, email 등을 token에 포함하고 memberStore에 저장하는데 사용된다. 
- JWT는 표준 규격을 따르고 있어, 이를 지원하는 다양한 라이브러리와 플랫폼에서 쉽게 사용할 수 있다. 이는 서비스 간의 상호 운용성을 향상시킨다.
- JWT는 JSON 형식을 사용하며, 정보를 포함하는 데 필요한 최소한의 필드만을 가지고 있다. 
   이는 토큰 크기를 작게 유지하면서 필요한 정보를 전송하는 데 효과적이다.

### MySQL 8.0.32
- 기존에 가상 머신 CentOS8의 mysql-server를 사용하던 중 배포, 성능 등을 고려한 결과 DB 변경을 결정했다. <br>
 -> Amazon RDS 서버에 MySQL 8.0.32 버전을 선택.
- Amazon RDS를 활용하여 데이터베이스를 관리하며, 안정적인 운영 환경을 제공한다.
- 인바운드, 아웃바운드 규칙 설정 등을 통해 안정적이고 빠른 데이터 쿼리 및 API 응답을 가능하게 한다.

### Spring 서버 배포(AWS EC2 Ubuntu 20.04 LTS)
- Spring Boot 프로젝트를 빌드한 후 실행 파일 jar 파일을 AWS EC2 Ubuntu 20.04 서버에 배포했다.
- 인바운드, 아웃바운드 규칙 설정 등을 통해 특정 포트만 접속할 수 있도록 허용했고 <br>
 기본적으로 AWS에서 제공하는 보안, 성능을 최대한 활용할 수 있다. 

### Spring Config 서버 배포(AWS EC2)
- Private Git Repository에서 환경 변수등을 불러오는 Spring Config 서버를 <br>
 AWS EC2 Ubuntu 20.04 서버에 배포했다. 
- Spring 서버와 마찬가지로 규칙 설정 등을 통해 Spring 서버만 접속할 수 있도록 허용했고 <br>
 Spring refresh 등을 통해 수정된 환경 변수 등의 정보를 Spring 서버에 제공한다. 
</details>
<br>
<br>


# Badges
<div align="left">
	<img src="https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=HTML5&logoColor=white" />
	<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=CSS3&logoColor=white" />
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=JavaScript&logoColor=white" />
  <img src="https://img.shields.io/badge/vuejs-%2335495e.svg?style=flat&logo=vuedotjs&logoColor=%234FC08D" />

  <br>

  <img src="https://img.shields.io/badge/jQuery-0769AD?style=flat&logo=jQuery&logoColor=white" />
  <img src="https://img.shields.io/badge/Bootstrap-7952B3?style=flat&logo=Bootstrap&logoColor=white" />

  <br>

  <img src="https://img.shields.io/badge/SpringBoot-6DB33F?style=flat&logo=SpringBoot&logoColor=white" />
  <img src="https://img.shields.io/badge/Java-007396?style=flat&logo=Conda-Forge&logoColor=white" />

  <br>

  <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=GitHub&logoColor=white"/>

  <br>

  <img src="https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=MySQL&logoColor=white"/>
  <img src="https://img.shields.io/badge/Ubuntu-E95420?style=flat-square&logo=Ubuntu&logoColor=white"/>
  <img src="https://img.shields.io/badge/Amazon AWS-232F3E?style=flat-square&logo=amazonaws&logoColor=white"/>

  <br />
</div>

<br>
<br>

# 🖥️ System Architecture

[campingOnTop System Architecture](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/105422037/a2298147-69fa-405e-9485-79b89b706371)

<br>
<br>

# 📜 Front End 요구사항 명세서 (진행중)
[campingOnTop Front 요구 사항 명세서](https://docs.google.com/spreadsheets/d/1M9KUdkTvYwlbRystq-_26WpynnnbtVQdG6v5hFsb93Y/edit#gid=1284096346)

<br>
<br>

# 📷 Figma

[campingOnTop Figma](https://www.figma.com/file/JeGMJmeA0suRljrCCnQ7Ny/campingOnTop-Figma?type=design&node-id=0-1&mode=design&t=ED4wl242eXWHWpMy-0)

<br>
<br>

# 상세 기능

<details>
  <summary><b style="font-size: 18px;">페이지 별 기능</b></summary>

<details>
  <summary style="margin-left: 20px;"><b style="font-size: 16px;">초기화면</b></summary>

[campingOnTop Home 조회 기능 시연](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/144295389/63df35da-793e-4c6c-8f38-624c47384d2d)

</details>

<details>
  <summary style="margin-left: 20px;"><b style="font-size: 16px;">회원가입</b></summary>

[campingOnTop 회원가입 기능 시연](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/144295389/36f39df2-6d8d-4686-837f-99a0a8bb81e1)

</details>

<details>
  <summary style="margin-left: 20px;"><b style="font-size: 16px;">이메일 인증</b></summary>

[이메일 인증 시연 영상](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/144295389/d12f7db7-97cf-4c2e-8c33-fb19a145a93b)
[이메일 인증 시연 gif](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/105422037/d1b98b01-a8c3-44e9-bb43-51d237d1f719)
</details>

<details>
  <summary style="margin-left: 20px;"><b style="font-size: 16px;">로그인</b></summary>

[로그인 기능 시연 영상](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/144295389/784671b6-f2ef-4d62-91a9-d6c7abe13d5e)
[로그인 기능 시연 gif](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/105422037/2486c22a-10e4-40e8-90a0-85c65aef7693)
</details>

<details>
  <summary style="margin-left: 20px;"><b style="font-size: 16px;">로그아웃</b></summary>

[로그아웃 기능 시연 영상](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/144295389/a85336c7-2074-4d74-83bb-126256a78c08)
[로그아웃 기능 시연 gif](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/105422037/fba6d743-4772-4cdf-b87e-e1e159940f02)

</details>

<details>
  <summary style="margin-left: 20px;"><b style="font-size: 16px;">숙소 검색</b></summary>

[숙소 이름으로 검색 기능 시연 영상](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/144295389/c6b5b0cf-29f4-4297-9d39-d4116f0ecb68)
[숙소 이름으로 검색 기능 시연 gif](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/105422037/ebb9792f-ac91-4f9d-b2f0-1c2b6cf66fdd)

<br>  

[숙소 주소로 검색 기능 시연 영상](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/144295389/5a1a9497-a53e-44f3-a110-2a9e66ac481a)
[숙소 주소로 검색 기능 시연 gif](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/105422037/0e7641b5-70a0-4aa5-bd4e-faa5da251880)

</details>

<details>
  <summary style="margin-left: 20px;"><b style="font-size: 16px;">숙소 등록</b></summary>

[숙소 등록 기능 시연 영상](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/144295389/e43b04bc-8481-4b56-9b46-34f04bb8bc6f)
[숙소 등록 기능 시연 gif](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/105422037/a3762cb0-18a6-4f38-ad89-058c7669fd2a)

</details>

<details>
  <summary style="margin-left: 20px;"><b style="font-size: 16px;">좋아요</b></summary>

[좋아요 기능 시연 영상](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/144295389/9383cf9a-8d7e-4def-8a6e-2ad7206f0722)
[좋아요 기능 시연 gif](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/105422037/3791fb00-3450-443a-8e64-503cdec82c5b)

</details>

<details>
  <summary style="margin-left: 20px;"><b style="font-size: 16px;">장바구니</b></summary>

[장바구니 기능 시연 영상](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/144295389/83215b61-a975-4c3b-85ba-aced116884e3)
[장바구니 기능 시연 gif](https://github.com/beyond-sw-camp/be02-3rd-MTM-cityCamp/assets/105422037/a1b5356f-fb60-496b-9f49-11a22942568d)
</details>
</details>
