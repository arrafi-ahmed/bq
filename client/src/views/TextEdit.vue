<script setup>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import PageTitle from "@/components/PageTitle.vue";
import {
  convertArrayToText,
  convertTextToJson,
  showToast,
} from "@/others/util";

const store = useStore();
const data = computed(() => store.state.quiz.inputArr);
const level = computed(() => store.state.quiz.level);
const downloadJsonFile = () => {
  const convertedText = convertArrayToText(data.value, level.value);
  let convertedJson = null;
  try {
    convertedJson = JSON.stringify(convertTextToJson(convertedText), null, 2);
  } catch (err) {
    showToast(err.message, "error");
    return;
  }
  const blob = new Blob([convertedJson], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "output.json";
  link.click();
  URL.revokeObjectURL(link.href);
};

const modifyLevel = (rowIndex, action) => {
  store.commit("quiz/modifyLevel", { rowIndex, action });
};
</script>

<template>
  <v-container>
    <page-title title="Text Output" justify="space-between">
      <v-btn
        prepend-icon="mdi-arrow-down"
        variant="text"
        @click="downloadJsonFile"
        >Download
      </v-btn>
    </page-title>
    <v-row>
      <v-col v-if="data">
        <template v-for="(row, rowIndex) in data" :key="rowIndex">
          <template v-for="(col, colIndex) in row" :key="colIndex">
            <div v-if="col">
              <v-row no-gutters>
                <v-col
                  cols="1"
                  :class="`level-${level[rowIndex] + 1}-color`"
                  class="ps-2"
                  >{{ rowIndex + 1 }}
                </v-col>
                <v-col
                  cols="11"
                  :class="`level-${level[rowIndex] + 1}`"
                  class="pe-1"
                >
                  <span class="d-flex justify-space-between align-center">
                    <span>{{ col }}</span>
                    <span class="d-flex">
                      <v-btn
                        @click="modifyLevel(rowIndex, 'sub')"
                        :disabled="level[rowIndex] === 0"
                        icon="mdi-arrow-left"
                        size="x-small"
                        variant="text"
                      ></v-btn>
                      <v-btn
                        @click="modifyLevel(rowIndex, 'add')"
                        :disabled="level[rowIndex] === 3"
                        icon="mdi-arrow-right"
                        size="x-small"
                        variant="text"
                      ></v-btn>
                    </span>
                  </span>
                </v-col>
              </v-row>
              <v-divider></v-divider>
            </div>
          </template>
        </template>
      </v-col>
      <v-col v-else>
        <v-alert variant="outlined" type="warning" border="top">
          No Data Available
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.level-1-color {
  background-color: #b4c7e7;
}

.level-2-color {
  background-color: #f8cbad;
}

.level-3-color {
  background-color: #ffd966;
}

.level-4-color {
  background-color: #a9d18e;
}

.level-1 {
  background-color: #b4c7e7;
  padding-left: 50px !important;
}

.level-2 {
  background-color: #f8cbad;
  padding-left: 100px !important;
}

.level-3 {
  background-color: #ffd966;
  padding-left: 150px !important;
}

.level-4 {
  background-color: #a9d18e;
  padding-left: 200px !important;
}
</style>
