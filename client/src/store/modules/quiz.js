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
  setInputArrAtIndex(state, payload) {
    console.log(3, payload);
    state.inputArr[payload.line][payload.level] = payload.value;
    console.log(4, state.inputArr);
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
