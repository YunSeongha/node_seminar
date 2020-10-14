import Vue from "vue";
import Vuex from "vuex";
import Router from "../router/index";

import Axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    id: "",
    name: "",
    role: "",
  },
  mutations: {
    login(state, userModel) {
      state.id = userModel.id;
      state.name = userModel.name;
      state.role = userModel.role;
    },
    logout(state) {
      Axios.post("/api/auth/logout");
      state.id = "";
      state.name = "";
      Router.push("/");
    },
  }, //sync
  actions: {}, //async
  modules: {},
});
