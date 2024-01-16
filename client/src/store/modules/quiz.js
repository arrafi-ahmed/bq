import $axios from "@/plugins/axios";

export const namespaced = true;

export const state = {
  inputJson: null,
};

export const mutations = {
  setInputJson(state, payload) {
    state.inputJson = payload;
  },
};

export const actions = {
  setInputJson({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/user/signin", request)
        .then((response) => {
          commit("setToken", response.headers?.authorization);
          commit("setCurrentUser", response.data?.payload?.currentUser);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  signout({ commit }) {
    return new Promise((resolve, reject) => {
      commit("removeToken");
      commit("removeCurrentUser");
      resolve();
    });
  },
  register({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/user/register", request)
        .then((response) => {
          commit("setToken", response.headers?.authorization);
          commit("setCurrentUser", response.data?.payload?.currentUser);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const getters = {
  getToken(state) {
    return state.token;
  },
  getCurrentUser(state) {
    return state.currentUser;
  },
  isAdmin(state) {
    return state.currentUser.role === "admin";
  },
  signedin(state) {
    return !!state.token;
  },
};
