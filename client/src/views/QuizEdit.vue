<script setup>
import { useStore } from "vuex";
import { computed, onMounted, reactive, ref, watch } from "vue";
import PageTitle from "@/components/PageTitle.vue";
import {
  convertArrayToText,
  convertTextToJson,
  showToast,
} from "@/others/util";
import { useRoute, useRouter } from "vue-router";

const store = useStore();
const router = useRouter();
const route = useRoute();

const quiz = computed(() => store.state.quiz.quiz);

const convertToJson = () => {
  const convertedText = convertArrayToText(quiz.value);
  try {
    return JSON.stringify(convertTextToJson(convertedText), null, 2);
  } catch (err) {
    showToast(err.message, "error");
    return null;
  }
};

const downloadJsonFile = () => {
  const convertedJson = convertToJson();
  if (!convertedJson) return;

  const blob = new Blob([convertedJson], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "output.json";
  link.click();
  URL.revokeObjectURL(link.href);
};

const modifyLevel = (rowIndex, action) => {
  const prevLevel = quiz.value.level[rowIndex];
  store.commit("quiz/modifyLevel", { rowIndex, action });

  store.commit("quiz/setDataAtIndex", {
    value: quiz.value.data[rowIndex][prevLevel],
    line: rowIndex,
    level: quiz.value.level[rowIndex],
  });

  store.commit("quiz/setDataAtIndex", {
    value: null,
    line: rowIndex,
    level: prevLevel,
  });
};
const targetLevel = ref(2);
const targetLevelOptions = computed(() => {
  const arr = [];
  for (let i = 0; i < 5; i++) {
    //TODO: deepestLevel hardcoded
    arr.push({ value: i, title: i + 1 });
  }
  return arr;
});

const uniqueTargetLevelKeywords = computed(() => {
  const allTargetLevelKeywords = [];

  if (quiz.value.data?.length > 0) {
    quiz.value.data.forEach((item, rowIndex) => {
      const foundLevel = quiz.value.level[rowIndex];
      if (Number(foundLevel) === targetLevel.value) {
        allTargetLevelKeywords.push({
          value:
            item[targetLevel.value] ||
            quiz.value.data[quiz.value.level[rowIndex]],
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
    a.value.localeCompare(b.value),
  );
});
const editingKeywords = ref([]);
const newEditingKeyword = ref("");
const selectedChips = ref([]);

const selectKeyword = (index) => {
  const foundIndex = editingKeywords.value.findIndex(
    (item) => item.index == index,
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
const quizDetailsDialog = ref(false);

const saveKeyword = () => {
  if (!newEditingKeyword.value) {
    showToast("Invalid replacing keyword!", "error");
    return;
  }

  editingKeywords.value.forEach((editingKeyword) => {
    editingKeyword.lines.forEach((line, index) => {
      store.commit("quiz/setDataAtIndex", {
        value: newEditingKeyword.value,
        line,
        level: targetLevel.value,
      });
    });
  });
  showToast("Keyword Saved!", "success");
  editingKeywords.value = selectedChips.value = [];
};

const quizDetails = reactive({
  name: null,
  levelQuestion: null,
  levelAnswer: null,
  levelDeepest: null,
});

// watch(
//   () => quiz.value.name,
//   (newVal) => {
//     quizDetails.name = newVal;
//   },
// );
// watch(
//   () => quiz.value.levelQuestion,
//   (newVal) => {
//     quizDetails.levelQuestion = newVal;
//   },
// );
// watch(
//   () => quiz.value.levelAnswer,
//   (newVal) => {
//     quizDetails.levelAnswer = newVal;
//   },
// );
watch(
  () => quiz.value,
  (newVal) => {
    quizDetails.name = newVal.name;
    quizDetails.levelQuestion = newVal.levelQuestion;
    quizDetails.levelAnswer = newVal.levelAnswer;
    quizDetails.levelDeepest = Math.max(...newVal.level);
  },
  { deep: true },
);

const saveQuiz = () => {
  const jsonData = convertToJson();
  if (!jsonData) return;

  const quizObj = {
    name: quizDetails.name,
    levelQuestion: quizDetails.levelQuestion,
    levelAnswer: quizDetails.levelAnswer,
    levelDeepest: quizDetails.levelDeepest,
    data: quiz.value.data,
    level: quiz.value.level,
    jsonData,
  };
  if (route.params.id) quizObj.id = route.params.id;

  store.dispatch("quiz/saveQuiz", quizObj).then((res) => {
    router.push({ name: "quiz-list" });
  });
};

onMounted(async () => {
  if (route.params.id) {
    await store.commit("quiz/resetQuiz");
    await store.dispatch("quiz/setQuiz", route.params.id);
  }
});
</script>

<template>
  <v-container>
    <page-title
      :title="quizDetails.name || 'Quiz Output'"
      justify="space-between"
    >
      <div class="d-flex align-center">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props" variant="text">
            </v-btn>
          </template>
          <v-list density="compact">
            <v-list-item
              link
              title="Check Level"
              @click="checkLevelDialog = !checkLevelDialog"
            ></v-list-item>
            <v-list-item
              link
              title="Quiz Details"
              @click="quizDetailsDialog = !quizDetailsDialog"
            ></v-list-item>
            <v-list-item
              link
              title="Download"
              @click="downloadJsonFile"
            ></v-list-item>
            <v-list-item link title="Save" @click="saveQuiz"></v-list-item>
          </v-list>
        </v-menu>
      </div>
    </page-title>

    <v-row>
      <v-col v-if="quiz.data">
        <template v-for="(row, rowIndex) in quiz.data" :key="rowIndex">
          <template v-for="(col, colIndex) in row" :key="colIndex">
            <div v-if="col">
              <v-row no-gutters>
                <v-col
                  :class="`level-${quiz.level[rowIndex] + 1}-color`"
                  class="ps-2"
                  cols="1"
                  >{{ rowIndex + 1 }}
                </v-col>
                <v-col
                  :class="`level-${quiz.level[rowIndex] + 1}`"
                  class="pe-1"
                  cols="11"
                >
                  <span class="d-flex justify-space-between align-center">
                    <span>{{ col }}</span>
                    <span class="d-flex">
                      <v-btn
                        :disabled="quiz.level[rowIndex] === 0"
                        icon="mdi-arrow-left"
                        size="x-small"
                        variant="text"
                        @click="modifyLevel(rowIndex, 'sub')"
                      ></v-btn>
                      <v-btn
                        :disabled="
                          quiz.level[rowIndex] === quizDetails.levelDeepest
                        "
                        icon="mdi-arrow-right"
                        size="x-small"
                        variant="text"
                        @click="modifyLevel(rowIndex, 'add')"
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
        <v-alert border="top" type="warning" variant="outlined">
          No Data Available
        </v-alert>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="checkLevelDialog" max-width="700">
    <v-card>
      <v-card-title>Check Level</v-card-title>
      <v-card-text>
        <v-row justify="center">
          <v-col>
            <v-select
              v-model="targetLevel"
              :items="targetLevelOptions"
              class="ms-2"
              density="compact"
              item-title="title"
              item-value="value"
              label="Check keywords at level"
              variant="outlined"
            ></v-select>
            <h4 class="mb-2">Select keyword to modify:</h4>
            <v-chip-group v-model="selectedChips" filter multiple column>
              <v-chip
                v-for="(item, index) in uniqueTargetLevelKeywords"
                :key="index"
                :filter="true"
                class="v-label--clickable ms-2 mt-2"
                filter-icon="mdi-checkbox-marked-circle"
                size="large"
                @click="selectKeyword(index)"
                >{{ item.value }}
              </v-chip>
            </v-chip-group>
            <v-text-field
              v-model="newEditingKeyword"
              class="mt-6"
              clearable
              density="comfortable"
              label="Replacing Keyword"
              variant="outlined"
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

  <v-dialog v-model="quizDetailsDialog" max-width="700">
    <v-card>
      <v-card-title>Quiz Details</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="quizDetails.name"
          clearable
          density="compact"
          label="Quiz name"
          variant="outlined"
        ></v-text-field>
        <v-select
          v-model="quizDetails.levelQuestion"
          :items="targetLevelOptions"
          density="compact"
          item-title="title"
          item-value="value"
          label="Select question level"
          variant="outlined"
        ></v-select>
        <v-select
          v-model="quizDetails.levelAnswer"
          :items="targetLevelOptions"
          density="compact"
          item-title="title"
          item-value="value"
          label="Select answer level"
          variant="outlined"
        ></v-select>
        <v-select
          v-model="quizDetails.levelDeepest"
          :items="targetLevelOptions"
          density="compact"
          item-title="title"
          item-value="value"
          label="Select deepest level"
          variant="outlined"
        ></v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="quizDetailsDialog = !quizDetailsDialog">OK</v-btn>
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

.level-5-color {
  background-color: #ceabd7;
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

.level-5 {
  background-color: #ceabd7;
  padding-left: 250px !important;
}
</style>
