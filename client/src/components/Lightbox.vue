<script setup>
import { getEventImageUrl } from "@/others/util";
import { ref } from "vue";

const { imgSrc, aspectRatio } = defineProps(["imgSrc", "aspectRatio"]);
const dialog = ref(false);
const fullSize = ref(false);

const switchDialog = () => {
  fullSize.value = false;
  dialog.value = !dialog.value;
};
const switchFullsize = () => {
  fullSize.value = !fullSize.value;
};
</script>

<template>
  <v-img
    :aspect-ratio="aspectRatio || 1.7"
    :src="getEventImageUrl(imgSrc || null)"
    class="clickable"
    cover
    @click="switchDialog"
  ></v-img>

  <v-dialog v-model="dialog" :max-width="!fullSize ? '100vh' : undefined">
    <v-card class="position-relative">
      <v-btn
        :block="false"
        :max-width="20"
        class="rounded-sm z-index-max"
        color="primary"
        icon="mdi-close"
        location="top end"
        position="absolute"
        size="sm"
        @click="dialog = !dialog"
      ></v-btn>
      <v-img
        :contain="!fullSize"
        :max-height="!fullSize ? '85vh' : undefined"
        :src="getEventImageUrl(imgSrc || null)"
        @click="switchFullsize"
      ></v-img>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.right-0 {
  right: 0 !important;
}

.top-0 {
  top: 0 !important;
}
</style>
