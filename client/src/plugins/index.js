/**
 * plugins/index.js
 *
 * Automatically included in `./src/main.js`
 */

// Plugins
import vuetify from "./vuetify";
import router from "../router";
import store from "../store";
import $axios from "@/plugins/axios";
import {appear} from "@/directive/appear";
import {getQueryParam, removeQueryParams} from "@/others/util";

function handleApiQueryMsg() {
  //check if message came from server through query params
  const apiQueryMsg = getQueryParam("apiQueryMsg");

  if (apiQueryMsg) {
    const newUrl = removeQueryParams(window.location.href, ["apiQueryMsg"]);
    localStorage.setItem("apiQueryMsg", apiQueryMsg);
    window.location.href = newUrl;
  }
}

function handleAuthRoutes(to, signedin) {
  if (to.matched.some((record) => record.meta.requiresNoAuth) && signedin) {
    return {name: "home"};
  } else if (
    to.matched.some((record) => record.meta.requiresAuth) &&
    !signedin
  ) {
    return {name: "signin"};
  }
  return null;
}

export function registerPlugins(app) {
  router.beforeEach((to, from, next) => {
    const signedin = store.getters["user/signedin"];
    const redirectRoute = handleAuthRoutes(to, signedin);
    if (redirectRoute) {
      next(redirectRoute);
    }
    handleApiQueryMsg();
    next();
  });

  app.use(vuetify).use(router).use(store);
  app.directive("appear", appear);
  app.provide("$axios", $axios);
  window.$axios = $axios;
}
