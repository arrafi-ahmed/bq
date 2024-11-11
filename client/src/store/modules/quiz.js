import $axios from "@/plugins/axios";

export const namespaced = true;

const quizInit = {
  name: null,
  levelQuestion: null,
  levelAnswer: null,
  levelDeepest: null,
  data: [],
  level: [],
};

export const state = {
  quizzes: [],
  quiz: {...quizInit},
};

export const mutations = {
  setQuizzes(state, payload) {
    state.quizzes = payload;
  },
  setQuiz(state, payload) {
    state.quiz = payload;
  },
  resetQuiz(state) {
    state.quiz = {...quizInit};
  },
  setDataAtIndex(state, payload) {
    state.quiz.data[payload.line][payload.level] = payload.value;
  },
  setData(state, payload) {
    state.quiz.data = payload;
  },
  setLevel(state, payload) {
    state.quiz.level = payload;
  },
  modifyLevel(state, payload) {
    if (payload.action === "add") state.quiz.level[payload.rowIndex]++;
    if (payload.action === "sub") state.quiz.level[payload.rowIndex]--;
  },
};

export const actions = {
  saveQuiz({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .post("/api/quiz/saveQuiz", request)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setQuizzes({commit}) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/quiz/getQuizzes")
        .then((response) => {
          commit("setQuizzes", response.data.payload);
          resolve(response.data.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  setQuiz({commit}, request) {
    return new Promise((resolve, reject) => {
      $axios
        .get("/api/quiz/getQuiz", {params: {id: request}})
        .then((response) => {
          commit("setQuiz", response.data.payload);
          resolve(response.data.payload);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};

export const getters = {
  deepestLevel(state) {
    return Math.max(...state.quiz.level);
  },
};
