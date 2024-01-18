<script setup>
import { Toaster } from "vue-sonner";
import ProgressLoader from "@/components/ProgressLoader.vue";

import { watch } from "vue";
import { useRoute } from "vue-router";
import { appName } from "@/others/util";

const route = useRoute();

watch(route, (to) => {
  document.title =
    (to.meta.title && to.meta.title + " | " + appName) || appName;
});
</script>
<template>
  <progress-loader />
  <Toaster :expand="true" closeButton position="bottom-left" rich-colors />
  <router-view />
</template>
<style>
@import url("https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@100;300;400;500;700;900&display=swap");

.v-application {
  font-family: "Source Sans 3", sans-serif !important;
}

.clickable {
  cursor: pointer;
}

.flex-sticky {
  position: sticky;
  align-self: flex-start;
  z-index: 999;
}

.div-sticky {
  position: sticky;
  height: auto;
  z-index: 999;
}
</style>
