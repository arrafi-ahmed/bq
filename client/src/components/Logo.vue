<script setup>
import { useDisplay } from "vuetify";
import { appName, getClientPublicImgUrl } from "@/others/util";

const { mobile } = useDisplay();
const { customClass } = defineProps(["customClass"]);
</script>

<template>
  <div :class="`d-flex align-center ${customClass}`">
    <div style="width: 28px">
      <!--      <v-img :src="getClientPublicImgUrl('logo.png')"></v-img>-->
    </div>

    <div class="pl-2">
      <component :is="mobile ? 'h2' : 'h1'">
        <span class="text-primary">{{ appName }}</span>
      </component>
    </div>
  </div>
</template>

<style scoped></style>
