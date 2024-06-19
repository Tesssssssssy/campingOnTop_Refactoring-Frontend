<template>
    <div class="page-content">
      <main id="main">
        <section class="map">
          <div class="map__information">
            <h1 style="font-weight: bold">지도</h1>
            <ul>
              <li>위치 기반으로 숙소 서비스를 이용해보세요.</li>
            </ul>
          </div>
          <table class="map__container">
            <div id="kakaomap"></div>
            <button id="currentbutton" @click="resetToCurrentPosition">현재 위치로 이동</button>
          </table>
        </section>
      </main>
    </div>
  </template>
  
  <script>
  import { mapStores } from "pinia";
  import { useHouseStore } from "/src/stores/useHouseStore";

  export default {
    name: "MapPage",
    data() {
      return {
        map: null,
        markers: [],
        latitude: 0,
        longitude: 0,
        infowindow: null,
        centerMarker: null, // 중심 좌표를 표시하는 마커
      }
    },
    
    created(){
      if (!("geolocation" in navigator)) {
      return;
      }

      // get position
      navigator.geolocation.getCurrentPosition(pos => {
        this.latitude = pos.coords.latitude;
        this.longitude = pos.coords.longitude;

        if (window.kakao && window.kakao.maps) {

          this.initMap();

        } else {
          const script = document.createElement("script");
          /* global kakao */
          script.onload = () => kakao.maps.load(this.initMap);
          script.src = "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey="+process.env.VUE_APP_KAKAOMAP_API_KEY;
          document.head.appendChild(script);
        }

      }, err => {
        alert(err.message);
      })

    },
    computed: {
      ...mapStores(useHouseStore),
      allSelected: {
        
      }
    },

    watch: {
    },

    mounted() {
    },

    unmounted() {},

    methods: {
      async initMap() {
        const container = document.getElementById("kakaomap");
        const options = {
          center: new kakao.maps.LatLng(33.450701, 126.570667),
          level: 5,
        };
        this.map = new kakao.maps.Map(container, options);

        // 현재 위치 설정
        this.currentPosition = {
          title: '현재 위치',
          latlng: new kakao.maps.LatLng(this.latitude, this.longitude),
          isCurrentPosition: true // 현재 위치 표시 여부 추가
        };

        try {
          // 현재 위치를 기반으로 백엔드에서 positions 가져오기
          await this.fetchAndDisplayPositions(this.latitude, this.longitude, this.currentPosition);
        } catch (error) {
          console.error('Failed to fetch positions:', error);
          // 백엔드에서 positions를 가져오지 못한 경우, 현재 위치만 표시
          this.displayMarkers([this.currentPosition]);
        }

        this.addDragendEvent();

        // 지도 타입 컨트롤 추가
        const mapTypeControl = new window.kakao.maps.MapTypeControl();
        this.map.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

        // 줌 컨트롤 추가
        const zoomControl = new window.kakao.maps.ZoomControl();
        this.map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

        // 인포윈도우 객체 생성
        this.infowindow = new kakao.maps.InfoWindow();
      },

      async fetchAndDisplayPositions(latitude, longitude, centerPosition) {
        const positionsResponse = await this.houseStore.getHouseListByLoc(latitude, longitude);

        const positions = positionsResponse.map(house => ({
          title: house.name,
          latlng: new kakao.maps.LatLng(house.latitude, house.longitude),
          id: house.id,
          imageUrl: house.filenames
        }));

        // 중심 위치와 백엔드에서 가져온 positions 합치기
        const allPositions = [centerPosition, ...positions];

        // 마커 표시
        this.displayMarkers(allPositions);

        // 기존 원 제거
        this.removeRadiusCircle();

        // 반경 1km 표시하는 원 추가
        this.displayRadiusCircle(centerPosition.latlng);
      },

      displayMarkers(markerPositions) {
        if (this.markers && this.markers.length > 0) {
          this.markers.forEach((marker) => marker.setMap(null));
        }

        this.markers = markerPositions.map(pos => {
          const markerOptions = {
            map: this.map,
            position: pos.latlng,
            title: pos.title
          };

          if (pos.title === '현재 위치') {
            // 현재 위치 마커 이미지 설정
          } else if (pos.title === '중심 좌표') {
            // 중심 좌표 마커 이미지 설정
            markerOptions.image = new kakao.maps.MarkerImage(
              "redplaceholder.png", // 빨간색 마커 이미지 URL
              new kakao.maps.Size(38, 38)
            );
          } else {
            // 백엔드에서 불러온 마커 이미지 설정
            markerOptions.image = this.getMarkerImage(pos.imageUrl);
          }

          const marker = new kakao.maps.Marker(markerOptions);
          this.addMarkerEvents(marker, pos.title, pos.id);

          return marker;
        });

        if (markerPositions.length > 0) {
          const centerPos = markerPositions[0].latlng;
          this.map.setCenter(centerPos);
        }
        // 줌 레벨을 특정 레벨로 설정 (예: 7)
        this.map.setLevel(5);
      },

      getMarkerImage(imageUrl) {
        return new kakao.maps.MarkerImage(
          imageUrl,
          new kakao.maps.Size(35, 35),
        );
      },

      addMarkerEvents(marker, title, id) {

        // 현재 위치 마커와 중심 좌표 마커는 인포윈도우를 열지 않음
        if (title === '현재 위치' || title === '중심 좌표') {
            return;
          }

        const iwContent = `
          <div style="padding:5px;">
            ${title}<br>
            <a href="details/${id}" style="color:blue" target="_blank">상세 보기</a>
          </div>`;

        kakao.maps.event.addListener(marker, 'click', () => {
          // 마커 위에 인포윈도우를 표시합니다
          this.infowindow.setContent(iwContent);
          this.infowindow.open(this.map, marker);
        });

        kakao.maps.event.addListener(this.map, 'click', () => {
          // 인포윈도우를 클릭해서 끄기
          if (this.infowindow.getMap()){
            this.infowindow.close();
          }
        });

        kakao.maps.event.addListener(this.map, 'dragend', () => {
          // 맵을 드래그 해서 인포윈도우 끄기
          if (this.infowindow.getMap()){
            this.infowindow.close();
          }
        });
      },

      addDragendEvent() {
        kakao.maps.event.addListener(this.map, 'dragend', async () => {
          const latlng = this.map.getCenter();
          const currentLevel = this.map.getLevel(); 

          // 기존 중심 마커 제거
          if (this.centerMarker) {
            this.centerMarker.setMap(null);
          }

          // 새로운 중심 마커 생성 및 추가
          this.centerMarker = new kakao.maps.Marker({
            map: this.map,
            position: latlng,
            title: "중심 좌표",
            image: new kakao.maps.MarkerImage(
              "redplaceholder.png", // 빨간색 마커 이미지 URL
              new kakao.maps.Size(38, 38)
            )
          });

          // 중심 좌표 기반으로 백엔드에서 숙소 불러오기
          try {
            await this.fetchAndDisplayPositions(latlng.getLat(), latlng.getLng(), { title: '중심 좌표', latlng: latlng });
          } catch (error) {
            console.error('Failed to fetch positions:', error);
          }

          this.map.setLevel(currentLevel);
        });
      },

      displayRadiusCircle(centerLatLng) {
        this.radiusCircle = new kakao.maps.Circle({
          center: centerLatLng,  // 원의 중심 좌표입니다
          radius: 1000,          // 미터 단위의 원의 반지름입니다 (1km)
          strokeWeight: 2,       // 선의 두께입니다
          strokeColor: '#2E63F5', // 선의 색깔입니다
          strokeOpacity: 0.7,    // 선의 불투명도 (0에서 1 사이입니다)
          strokeStyle: 'solid',  // 선의 스타일입니다
          fillColor: '#2E63F5',   // 채우기 색깔입니다
          fillOpacity: 0.1       // 채우기 불투명도 (0에서 1 사이입니다)
        });

        this.radiusCircle.setMap(this.map);
      },

      removeRadiusCircle() {
        if (this.radiusCircle) {
          this.radiusCircle.setMap(null);
          this.radiusCircle = null;
        }
      },

      async resetToCurrentPosition() {
        // 기존 중심 마커 제거
        if (this.centerMarker) {
          this.centerMarker.setMap(null);
        }

        // 기존 원 제거
        this.removeRadiusCircle();

        // 현재 위치를 중심으로 지도 설정 및 마커 추가
        const currentPosition = this.currentPosition.latlng;
        this.map.setCenter(currentPosition);
        this.map.setLevel(5); // 기본 줌 레벨로 설정

        // 현재 위치 마커 다시 추가
        this.centerMarker = new kakao.maps.Marker({
          map: this.map,
          position: currentPosition,
          title: "현재 위치"
        });

        // 반경 1km 원 다시 추가
        this.displayRadiusCircle(currentPosition);

        // 중심 위치를 기반으로 백엔드에서 숙소 불러오기
        try {
          await this.fetchAndDisplayPositions(currentPosition.getLat(), currentPosition.getLng(), this.currentPosition);
        } catch (error) {
          console.error('Failed to fetch positions:', error);
        }
      }
    },

    components: {},

  };
  </script>
  
  <style scoped>
  body {
    margin: 0;
  }
  
  * {
    box-sizing: border-box;
  }

  .page-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  
  p,
  span {
    margin: 0;
  }
  
  a {
    color: black;
  }
  
  #main {
    width: 100%;
    height: 100%;
  }
  
  .map {
    width: 100%;
    max-width: 1000px; /* 최대 너비 설정 */
    margin: 0 auto;
  }

  .map__container {
    position: relative;
    width: 100%;
    height: 500px;
  }
  
  .map ul {
    background-color: whitesmoke;
    padding: 30px;
    border: whitesmoke solid 1px;
    border-radius: 5px;
    font-size: 13px;
    font-weight: 300;
  }
  
  .map ul :first-child {
    color: black;
  }
  
  table {
    border-collapse: collapse;
    width: 100%;
    font-size: 14px;
  }
  
  thead {
    text-align: center;
    font-weight: bold;
  }
  
  tbody {
    font-size: 12px;
  }
  
  td {
    padding: 15px 0px;
    border-bottom: 1px solid lightgrey;
  }
  
  .map__list__detail :nth-child(3) {
    vertical-align: top;
  }
  
  .map__list__detail :nth-child(3) a {
    font-size: 12px;
  }
  
  .map__list__detail :nth-child(3) p {
    margin-top: 6px;
    font-weight: bold;
  }
  
  .map__list__smartstore {
    font-size: 12px;
    color: gray;
  }
  
  .map__list__option {
    vertical-align: top;
    padding: 20px;
  }
  
  .map__list__option p {
    margin-bottom: 25px;
    position: relative;
  }
  
  .map__list__option p::after {
    content: "";
    width: 90%;
    height: 1px;
    background-color: lightgrey;
    left: 0px;
    top: 25px;
    position: absolute;
  }
  
  .map__list__optionbtn {
    display: inline-block;
    /* 블록 레벨 요소로 표시 */
    text-align: center;
    /* 텍스트 가운데 정렬 */
    padding-left: 10px;
    /* 패딩 추가 */
    padding-right: 10px;
    /* 패딩 추가 */
    padding-top: 10px;
    /* 패딩 추가 */
    padding-bottom: 10px;
    /* 패딩 추가 */
    background-color: #ff6b6b;
    /* 배경 색상 설정 */
    color: white;
    /* 글자 색상 설정 */
    font-size: 16px;
    /* 글자 크기 설정 */
    cursor: pointer;
    /* 마우스 오버 시 커서 변경 */
    border: none;
    /* 테두리 제거 */
    width: 125px;
  }
  
  .map__list__detail :nth-child(4),
  .map__list__detail :nth-child(5),
  .map__list__detail :nth-child(6) {
    border-left: 2px solid whitesmoke;
  }
  
  .map__list__detail :nth-child(5),
  .map__list__detail :nth-child(6) {
    text-align: center;
  }
  
  .map__list__detail :nth-child(5) button {
    background-color: limegreen;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 4px 8px;
    font-size: 12px;
    margin-top: 5px;
  }
  
  .map__list th,
  .map__list td {
    text-align: center;
    vertical-align: middle;
  }
  
  .map__list td:nth-child(3) {
    width: 150px;
  }
  
  .map__list td:nth-child(5),
  .map__list td:nth-child(6) {
    width: 120px;
  }
  
  .map__list img {
    max-width: 100px;
    height: auto;
    margin: 0 auto;
  }
  
  .map__list__optionbtn {
    display: block;
    text-align: left;
    margin-left: 75px;
  }
  
  .price {
    font-weight: bold;
  }
  
  .map__mainbtns {
    width: 420px;
    height: 200px;
    padding-top: 40px;
    display: block;
    margin: auto;
  }
  
  .map__bigorderbtn {
    width: 200px;
    height: 50px;
    font-size: 16px;
    margin: auto;
    border-radius: 5px;
    display: block;
  }
  
  .map__bigorderbtn.left {
    background-color: white;
    border: 1px lightgray solid;
  }
  
  .map__bigorderbtn.right {
    background-color: #ff6b6b;
    /* 배경 색상 설정 */
    color: white;
    border: none;
  }
  
  #tfoot_message {
    text-align: center;
  }
  
  .wh_cont {
    max-width: 1180px;
    padding: 0 20px;
  }
  
  section#category {
    text-align: center;
    width: auto;
    overflow: hidden;
  }
  
  section#category div.category_slide {
    height: 50px;
    margin-bottom: 100px;
  }
  
  section#category ul {
    list-style: none;
    padding: 0;
    margin: 0;
    width: auto;
    display: inline-flex;
  }
  
  section#category ul li {
    display: inline-block;
    padding: 16px 10px;
    text-align: center;
    margin: 0 8px;
    cursor: pointer;
    transition: color 0.15s ease-in-out;
  }
  
  section#category ul li i {
    font-size: 33px;
  }
  
  section#category ul li h6 {
    margin-top: 16px;
  }
  
  section#category ul li:hover h6 {
    color: var(--wehome-color);
  }
  
  section#category ul li.select {
    color: var(--wehome-color);
  }
  
  section#main_lists div.row,
  section#banners div.row {
    margin-left: -15px;
    margin-right: -15px;
  }
  
  section#main_lists div.row div.card_wrap {
    padding: 0 8px 16px;
  }
  
  section#main_lists div.card {
    border: none;
  }
  
  section#main_lists div.card div.ribbon {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }
  
  section#main_lists div.card div.p_images {
    aspect-ratio: 14/9;
    border-radius: 10px;
  }
  
  section#main_lists div.card div.card-body {
    padding: 16px 0;
  }
  
  section#main_lists div.card div.card-body h5.card-title a {
    font-size: 15px;
    color: #1c1c1c;
  }
  
  section#main_lists div.card div.card-body h6.card-subtitle {
    margin: 0 0 5px 0;
    color: #777;
  }
  
  section#main_lists div.card div.p_images span.btn_fav {
    color: #fff;
    padding: 10px;
    position: absolute;
    right: 5px;
    top: 0;
    z-index: 10;
    cursor: pointer;
  }
  
  section#main_lists div.card div.card-body div.p_price {
    text-align: right;
  }
  
  section#main_lists div.card div.card-body div.p_price span.price {
    font-size: 17px;
    color: #1c1c1c;
    font-weight: bold;
  }
  
  section#main_lists div.card div.card-body div.p_price span.night {
    font-size: 13px;
    color: #777;
  }
  
  main {
    margin: 0 auto;
  }
  
  .spinner-border {
    width: 5rem;
    height: 5rem;
    color: var(--wehome-color);
  }
  
  .swiper-container {
    width: 100%;
  }
  
  .swiper-container .swiper-slide {
    width: auto;
  }
  
  .swiper {
    width: 100%;
    height: 100%;
  }
  
  .p_images .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .swiper-pagination-bullet {
    background: rgba(255, 255, 255);
  }
  
  .swiper-pagination-bullet-active {
    background-color: white;
  }
  
  .swiper-button-prev2,
  .swiper-button-next2 {
    position: absolute;
    top: 50%;
    margin-top: -12px;
    z-index: 10;
    cursor: pointer;
    opacity: 0.7;
  }
  
  .swiper-button-prev2:hover,
  .swiper-button-next2:hover {
    opacity: 1;
  }
  
  .swiper-button-prev2 {
    left: 10px;
  }
  
  .swiper-button-next2 {
    right: 10px;
  }
  
  .swiper-button-prev2 img,
  .swiper-button-next2 img {
    width: 20px;
  }
  
  .swiper-lazy-preloader {
    border-color: var(--wehome-color);
    border-top-color: transparent;
  }
  
  section#banners {
    margin-bottom: 50px;
  }
  
  section#banners div.item img {
    border-radius: 10px;
  }
  
  section#banners .swiper-pagination-bullet {
    background: var(--wehome-color);
  }
  
  section#banners .swiper-pagination-bullet-active {
    background-color: var(--wehome-color);
  }
  
  nav {
    height: 66px;
    border-top: 1px solid #9ea0a3;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #fff;
    z-index: 100;
    padding-bottom: calc(66px + env(safe-area-inset-bottom));
  }
  
  nav div.button_wrap {
    position: relative;
    width: 25px;
    height: 25px;
    margin: 13px auto 4px auto;
  }
  
  nav div.row a {
    text-decoration: none;
    color: #666;
    text-align: center;
    padding: 0;
  }
  
  nav div.row a:hover h2,
  nav div.row a.on h2 {
    color: var(--wehome-color);
    font-weight: bold;
  }
  
  nav div.row a img {
    position: absolute;
    top: 0;
    left: 0;
  }
  
  nav div.row a img.over {
    opacity: 0;
    transition: 0.3s ease;
  }
  
  nav div.row a:hover img.over,
  nav div.row a.on img.over {
    opacity: 1;
  }
  
  nav div.row h2 {
    font-size: 0.8em;
    font-weight: normal;
  }
  
  /*  Medium devices (tablets, 768px and up) */
  @media (min-width: 768px) {
    nav {
      display: none !important;
    }
  }
  
  /* Large devices (desktops, 992px and up) */
  @media (min-width: 992px) {
    main {
      max-width: 1180px;
      margin: 0 auto;
    }
  }
  
  /* Extra large devices (large desktops, 1200px and up) */
  @media (min-width: 1200px) {
    section#search {
      margin: 0 auto;
    }
  }

  #kakaomap {
    width: 100%;
    height: 100%;
  }

  #currentbutton {
    position: absolute;
    top: 10px;
    left: 10px;
    z-index: 10; /* 버튼이 지도 위에 표시되도록 z-index 설정 */
    padding: 10px 20px;
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
  }
  </style>
  