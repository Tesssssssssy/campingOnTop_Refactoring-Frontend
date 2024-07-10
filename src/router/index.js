import { createRouter, createWebHistory } from "vue-router";
import VueJwtDecode from "vue-jwt-decode";
import { getTokenFromCookie } from "@/utils/authCookies";

import CartPage from "../pages/CartPage";
import DetailsPage from "../pages/DetailsPage";
import HomePage from "../pages/HomePage";
import LikesPage from "../pages/LikesPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import SellerSignupPage from "../pages/SellerSignupPage";
import HouseRegisterPage from "../pages/HouseRegisterPage";
import CouponPage from '../pages/CouponPage';
import MyCouponPage from '../pages/MyCouponPage';
import OrderCompletePage from "../pages/OrderCompletePage";
import MapPage from "../pages/MapPage";
import ReviewPage from "../pages/ReviewPage";

const requireAuth = () => (to, from, next) => {
  const token = getTokenFromCookie('refreshToken');
  if (!token) {
    next("/login");
  } else {
    try {
      const decoded = VueJwtDecode.decode(token);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        alert("로그인 시간이 만료되었습니다.");
        next("/login"); // 로그인 페이지로 리다이렉트
      } else {
        next(); // 유효한 토큰, 페이지 접근 허용
      }
    } catch (error) {
      console.error("Token decoding failed:", error);
      next("/login"); // 디코딩 실패 시 로그인 페이지로 리다이렉트
    }
  }
};

const routes = [
  { path: "/cart", component: CartPage, beforeEnter: requireAuth() },
  { path: "/details/:id", component: DetailsPage },
  { path: "/", component: HomePage },
  { path: "/likes", component: LikesPage, beforeEnter: requireAuth() },
  { path: "/login", component: LoginPage },
  { path: "/map", component: MapPage },
  { path: "/signup", component: SignupPage },
  { path: "/sellerSignup", component: SellerSignupPage },
  { path: "/houseRegister", component: HouseRegisterPage, beforeEnter: requireAuth() },
  { path: "/orders/complete", component: OrderCompletePage, beforeEnter: requireAuth() },
  { path: "/coupon", component: CouponPage, beforeEnter: requireAuth() },
  { path: "/my/coupon", component: MyCouponPage, beforeEnter: requireAuth() },
  { path: "/review", component: ReviewPage}
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});


export default router;
