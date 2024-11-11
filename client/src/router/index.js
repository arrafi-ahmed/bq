// Composables
import {createRouter, createWebHistory} from "vue-router";

const Default = () => import("@/layouts/default/Default.vue");
const Signin = () => import("@/views/Signin.vue");
const Signout = () => import("@/views/Signout.vue");
const NotFound = () => import("@/views/NotFound.vue");
const Register = () => import("@/views/Register.vue");
const Home = () => import("@/views/Home.vue");
const QuizList = () => import("@/views/QuizList.vue");
const QuizEdit = () => import("@/views/QuizEdit.vue");
const QuizPlay = () => import("@/views/QuizPlay.vue");

const routes = [
  {
    path: "/",
    component: Default,
    children: [
      {
        path: "signin",
        name: "signin",
        component: Signin,
        meta: {
          requiresNoAuth: true,
          title: "Signin",
        },
      },
      {
        path: "signout",
        name: "signout",
        component: Signout,
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "register",
        name: "register",
        component: Register,
        meta: {
          requiresNoAuth: true,
          title: "Register",
        },
      },
      {
        path: "home",
        name: "home",
        component: Home,
        meta: {
          requiresAuth: true,
          title: "Home",
        },
      },
      {
        path: "quiz/list",
        name: "quiz-list",
        component: QuizList,
        meta: {
          requiresAuth: true,
          title: "Quiz List",
        },
      },
      {
        path: "quiz/edit/:id?",
        name: "quiz-edit",
        component: QuizEdit,
        meta: {
          requiresAuth: true,
          title: "Quiz Edit",
        },
      },
      {
        path: "quiz/play/:id?",
        name: "quiz-play",
        component: QuizPlay,
        meta: {
          requiresAuth: true,
          title: "Quiz Play",
        },
      },
    ],
  },
  {
    path: "",
    redirect: {name: "home"},
  },
  {
    path: "/not-found/:status?/:message?",
    name: "notFound",
    component: NotFound,
    props: (route) => ({
      status: route.params.status || 404,
      message: route.params.message || "Looks like you're lost!",
    }),
    meta: {
      requiresAuth: false,
    },
  },
  {
    path: "/:catchAll(.*)",
    redirect: {
      name: "notFound",
      params: {status: 404, message: "Looks like you're lost!"},
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
