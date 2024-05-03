import { createRouter, createWebHistory } from "vue-router";

import CartPage from "../pages/CartPage";
import DetailsPage from "../pages/DetailsPage";
import HomePage from "../pages/HomePage";
import LikesPage from "../pages/LikesPage";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignupPage";
import SellerSignupPage from "../pages/SellerSignupPage";
import HouseRegisterPage from "../pages/HouseRegisterPage";

const requireAuth = () => (from, to, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    return next();
  }
  next("/login");
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
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});


export default router;
