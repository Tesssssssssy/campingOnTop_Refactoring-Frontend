import { createRouter, createWebHistory } from "vue-router";
import VueJwtDecode from "vue-jwt-decode";

import CartPage from "../pages/CartPage";
import DetailsPage from "../pages/DetailsPage";
import HomePage from "../pages/HomePage";
import LikesPage from "../pages/LikesPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import SellerSignupPage from "../pages/SellerSignupPage";
import HouseRegisterPage from "../pages/HouseRegisterPage";
import OrderCompletePage from "../pages/OrderCompletePage";

const requireAuth = () => (from, to, next) => {
  const token = localStorage.getItem("token");
  if (!token) {
    next("/login");
  } else {
    const decoded = VueJwtDecode.decode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (decoded.exp < currentTime) {
      window.localStorage.removeItem("token"); // 토큰 제거
      alert("로그인 시간이 만료되었습니다.");
      next("/login"); // 로그인 페이지로 리다이렉트
    } else {
      next(); // 유효한 토큰, 페이지 접근 허용
    }
  }
};

const routes = [
  { path: "/cart", component: CartPage, beforeEnter: requireAuth() },
  { path: "/details/:id", component: DetailsPage },
  { path: "/", component: HomePage },
  { path: "/likes", component: LikesPage, beforeEnter: requireAuth() },
  { path: "/login", component: LoginPage },
  { path: "/signup", component: SignupPage },
  { path: "/sellerSignup", component: SellerSignupPage },
  { path: "/houseRegister", component: HouseRegisterPage, beforeEnter: requireAuth() },
  { path: "/orders/complete", component: OrderCompletePage, beforeEnter: requireAuth() },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});


export default router;
