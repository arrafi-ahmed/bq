import axios from "axios";
import store from "@/store";
import { toast } from "vuetify-sonner";

const $axios = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

$axios.interceptors.request.use((config) => {
  store.commit("setProgress", true);
  const token = store.getters["user/getToken"];
  if (token) {
    config.headers["Authorization"] = token;
  }
  return config;
});

$axios.interceptors.response.use(
  (response) => {
    store.commit("setProgress", false);

    let color = "blue";
    if (response.data?.msg) {
      if (response.status >= 200 && response.status <= 299) {
        color = "success";
      } else if (response.status >= 400 && response.status <= 499) {
        color = "error";
      }
      toast(response.data.msg, {
        cardProps: { color },
        action: {
          label: "Close",
          buttonProps: {
            color: "white",
          },
          onClick() {},
        },
      });
    }
    return response;
  },
  (err) => {
    store.commit("setProgress", false);
    if (err.response?.data?.msg) {
      toast(err.response?.data?.msg, {
        cardProps: { color: "error" },
        action: {
          label: "Close",
          buttonProps: {
            color: "white",
          },
          onClick() {},
        },
      });
    }
    return Promise.reject(err);
  }
);

export default $axios;
