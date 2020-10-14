import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import User from "../views/User.vue";
import Login from "../views/Login.vue";

import Axios from "axios";
import Store from "../store/index.js";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { forAll: true },
  },
  {
    path: "/user",
    name: "User",
    component: User,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { forAll: true },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((v) => v.meta.forAll)) return next();

  Axios.post("/api/auth/refresh")
    .then((result) => {
      if (result.data.role != "admin") {
        Store.commit("logout");
        return next();
      }
      Store.commit("login", result.data);
      return next();
    })
    .catch((err) => {
      console.log(err);
    });
});

export default router;
