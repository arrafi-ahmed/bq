import {createStore} from "vuex";
import * as user from "./modules/user";
import * as quiz from "./modules/quiz";

const store = createStore({
  modules: {
    user,
    quiz,
  },
  state: () => ({
    progress: null,
  }),
  mutations: {
    setProgress(state, payload) {
      state.progress = payload;
    },
  },
  actions: {},
});

export default store;
