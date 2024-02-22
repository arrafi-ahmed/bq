<script setup>
import { useStore } from "vuex";
import { computed, onMounted, reactive, ref } from "vue";
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
  const prevLevel = level.value[rowIndex];
  store.commit("quiz/modifyLevel", { rowIndex, action });

  store.commit("quiz/setInputArrAtIndex", {
    value: data.value[rowIndex][prevLevel],
    line: rowIndex,
    level: level.value[rowIndex],
  });
  store.commit("quiz/setInputArrAtIndex", {
    value: null,
    line: rowIndex,
    level: level.value[prevLevel],
  });
};
const targetLevel = ref(2);
const targetLevelOptions = [
  { value: 0, title: 1 },
  { value: 1, title: 2 },
  { value: 2, title: 3 },
  { value: 3, title: 4 },
];

const uniqueTargetLevelKeywords = computed(() => {
  const allTargetLevelKeywords = [];

  if (data.value?.length > 0) {
    data.value.forEach((item, rowIndex) => {
      const foundLevel = level.value[rowIndex];
      if (Number(foundLevel) === targetLevel.value) {
        allTargetLevelKeywords.push({
          value: item[targetLevel.value] || item[level.value[rowIndex]],
          line: rowIndex,
        });
      }
    });
  }
  let map = new Map();
  allTargetLevelKeywords.forEach((obj) => {
    if (!map.has(obj.value)) {
      map.set(obj.value, { value: obj.value, lines: [obj.line] });
    } else {
      map.get(obj.value).lines.push(obj.line);
    }
  });
  return Array.from(map.values()).sort((a, b) =>
    a.value.localeCompare(b.value)
  );
});
const editingKeywords = ref([]);
const newEditingKeyword = ref("");
const selectedChips = ref([]);

const selectKeyword = (index) => {
  const foundIndex = editingKeywords.value.findIndex(
    (item) => item.index == index
  );
  if (foundIndex === -1) {
    editingKeywords.value.push({
      ...uniqueTargetLevelKeywords.value[index],
      index, // return Array.from(map.values());
    });
  } else {
    editingKeywords.value.splice(foundIndex, 1);
  }
};
const checkLevelDialog = ref(false);

const saveKeyword = () => {
  editingKeywords.value.forEach((editingKeyword) => {
    editingKeyword.lines.forEach((line, index) => {
      store.commit("quiz/setInputArrAtIndex", {
        value: newEditingKeyword.value,
        line,
        level: targetLevel.value,
      });
    });
    // checkLevelDialog.value = !checkLevelDialog.value;
  });
  showToast("Keyword Saved!", "success");
  editingKeywords.value = selectedChips.value = [];
};
</script>

<template>
  <v-container>
    <page-title title="Text Output" justify="space-between">
      <div>
        <v-btn
          prepend-icon="mdi-magnify"
          variant="text"
          @click="checkLevelDialog = !checkLevelDialog"
          >Check Level
        </v-btn>
        <v-btn
          prepend-icon="mdi-arrow-down"
          variant="text"
          @click="downloadJsonFile"
          >Download
        </v-btn>
      </div>
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
  <v-dialog v-model="checkLevelDialog" max-width="700">
    <v-card>
      <v-card-title class="d-flex">
        <span>Check keywords at level:</span>
        <span
          ><v-select
            v-model="targetLevel"
            :items="targetLevelOptions"
            item-title="title"
            item-value="value"
            :max-width="30"
            density="compact"
            variant="outlined"
            class="ms-2"
          ></v-select
        ></span>
      </v-card-title>
      <v-card-text>
        <v-row justify="center">
          <v-col>
            <h4 class="mb-2">Select keyword to modify:</h4>
            <v-chip-group filter multiple v-model="selectedChips">
              <v-chip
                @click="selectKeyword(index)"
                v-for="(item, index) in uniqueTargetLevelKeywords"
                :key="index"
                :filter="true"
                filter-icon="mdi-checkbox-marked-circle"
                size="large"
                class="v-label--clickable ms-2 mt-2"
                >{{ item.value }}
              </v-chip>
            </v-chip-group>
            <v-text-field
              v-model="newEditingKeyword"
              label="Replacing Keyword"
              density="comfortable"
              variant="outlined"
              class="mt-6"
              clearable
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="saveKeyword">Apply</v-btn>
        <v-btn @click="checkLevelDialog = !checkLevelDialog">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
