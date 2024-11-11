<script setup>
import PageTitle from "@/components/PageTitle.vue";
import {convertTextToArr, isValidTxtfile} from "@/others/util";
import {ref} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";

const store = useStore();
const router = useRouter();
const inputFile = ref(null);

const handleTextUpload = (files) => {
  inputFile.value = files[0];
};

const handleClickConvert = () => {
  if (isValidTxtfile(inputFile.value)) {
    store.commit("setProgress", true);
    store.commit("resetQuiz");
    convertTextToArr(inputFile.value)
      .then((quiz) => {
        store.commit("quiz/setQuiz", quiz);
        router.push({name: "quiz-edit"});
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        store.commit("setProgress", false);
      });
  } else {
    alert("Invalid file!");
  }
};
</script>
<template>
  <v-container class="fill-height">
    <page-title title="Upload Quiz"></page-title>
    <v-row align="center" class="fill-height" justify="center">
      <v-col cols="12" md="6">
        <v-file-input
          :rules="[
            (v) =>
              (Array.isArray(v) ? v : [v]).every((file) =>
                isValidTxtfile(file)
              ) || 'Only .txt allowed!',
          ]"
          clearable
          hide-details="auto"
          label="Upload text file containing quiz data"
          prepend-icon=""
          prepend-inner-icon="mdi-attachment"
          show-size
          variant="outlined"
          @update:modelValue="handleTextUpload"
        >
          <template v-slot:selection="{ fileNames }">
            <template v-for="fileName in fileNames" :key="fileName">
              <v-chip class="me-2" color="primary" label size="small">
                {{ fileName }}
              </v-chip>
            </template>
          </template>
        </v-file-input>

        <v-row class="mt-2" justify="center">
          <v-col cols="auto">
            <v-btn
              class="mx-auto"
              variant="outlined"
              @click="handleClickConvert"
            >Convert
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
