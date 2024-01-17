<script setup>
import { useStore } from "vuex";
import { computed, ref } from "vue";
import PageTitle from "@/components/PageTitle.vue";
import { convertArrayToText, convertTextToJson } from "@/others/util";

const store = useStore();
const data = computed(() => store.state.quiz.inputArr);
const level = computed(() => store.state.quiz.level);
const text = ref(null);
const downloadJsonFile = () => {
  const convertedText = convertArrayToText(data.value);
  const convertedJson = JSON.stringify(
    convertTextToJson(convertedText),
    null,
    2
  );
  text.value = convertedText;
  // console.log(2, convertedText);
  // console.log(3, convertedJson);
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
        <!--        <pre>-->
        <!--                        {{ data }}-->
        <!--                                  {{ text }}-->
        <!--                      </pre-->
        <!--        >-->
        <template v-for="(row, rowIndex) in data" :key="rowIndex">
          <template v-for="(col, colIndex) in row" :key="colIndex">
            <div v-if="col">
              <div
                class="d-flex justify-space-between"
                :class="`level-${level[rowIndex] + 1}`"
              >
                <p class="pa-1">{{ col }}</p>
                <div class="d-flex">
                  <v-btn
                    @click="modifyLevel(rowIndex, 'sub')"
                    :disabled="level[rowIndex] === 0"
                    icon="mdi-arrow-left"
                    size="small"
                    variant="text"
                  ></v-btn>
                  <v-btn
                    @click="modifyLevel(rowIndex, 'add')"
                    :disabled="level[rowIndex] === 3"
                    icon="mdi-arrow-right"
                    size="small"
                    variant="text"
                  ></v-btn>
                </div>
              </div>
              <v-divider></v-divider>
            </div>
          </template>
        </template>
        <!--        <p class="level-1 pa-2 pl-l1">-->
        <!--          {{ inputJson.data.Diseases_category?.Disease_category_name }}-->
        <!--        </p>-->

        <!--        <div v-for="(item, index) in inputArr" :key="index">-->
        <!--          <div v-if="diseaseKey !== 'Disease_category_name'" class="level-2">-->
        <!--            <div class="pa-2 pl-l2">{{ disease.Disease_Name }}</div>-->
        <!--            <div-->
        <!--              v-for="(subcategory, key) in disease"-->
        <!--              :key="key"-->
        <!--              v-if="key !== 'Disease_Name'"-->
        <!--            >-->
        <!--              <div v-if="key !== 'Disease_Name'" class="level-3">-->
        <!--                <div class="pa-2 pl-l3">{{ key }}:</div>-->
        <!--                <div-->
        <!--                  v-for="(item, subcategoryChildIndex) in subcategory"-->
        <!--                  :key="subcategoryChildIndex"-->
        <!--                  class="level-4"-->
        <!--                >-->
        <!--                  <div class="pa-2 pl-l4">{{ item }}</div>-->
        <!--                  <v-divider-->
        <!--                    v-if="subcategoryChildIndex + 1 !== subcategory.length"-->
        <!--                  ></v-divider>-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </div>-->
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
