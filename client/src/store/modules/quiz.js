import $axios from "@/plugins/axios";

export const namespaced = true;

export const state = {
  inputArr: null,
  level: null,
};

export const mutations = {
  setInputArr(state, payload) {
    state.inputArr = payload;
  },
  setLevel(state, payload) {
    state.level = payload;
  },
  modifyLevel(state, payload) {
    if (payload.action === "add") state.level[payload.rowIndex]++;
    if (payload.action === "sub") state.level[payload.rowIndex]--;
  },
};

export const actions = {
  setInputArr({ commit }, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/user/setInputArr", request)
        .then((response) => {
          commit("setInputArr", response.data?.payload);
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const getters = {};
