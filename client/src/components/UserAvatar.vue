<script setup>
import {getUserImageUrl} from "@/others/util";

const {imgSrc, clickable} = defineProps({
  imgSrc: {},
  clickable: {default: true},
});
</script>

<template>
  <v-avatar
    :class="{ clickable }"
    color="primary"
    size="45"
    @click="clickable ? $emit('clickAvatar') : undefined"
  >
    <v-img
      :aspect-ratio="1"
      :src="getUserImageUrl(imgSrc)"
      alt="User Avatar"
      cover
    />
  </v-avatar>
</template>

<style scoped></style>
