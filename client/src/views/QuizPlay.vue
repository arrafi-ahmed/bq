<script setup>
import PageTitle from "@/components/PageTitle.vue";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useStore} from "vuex";
import {useRoute, useRouter} from "vue-router";
import {shuffleArray} from "@/others/util";

const store = useStore();
const route = useRoute();
const router = useRouter();

const quiz = computed(() => store.state.quiz.quiz);

const quizItems = ref([]);
const quizItemCurrent = reactive({
  id: null,
  question: null,
  answerCorrectOptions: [],
  keyword: null,
});
const answerAllOptions = {};

const shuffleAnswerAllOptions = computed(() => {
  return shuffleArray(answerAllOptions[quizItemCurrent.keyword]);
});

const generateQuiz = () => {
  const quizItems = [];
  quiz.value.jsonData.forEach((diseaseCategoryItem, diseaseCategoryIndex) => {
    const diseasesCategory = diseaseCategoryItem.diseases_category;

    let diseaseIndex = 0;
    for (let diseasesCategoryKey in diseasesCategory) {
      if (!diseasesCategoryKey.startsWith("disease_category_name")) {
        const disease = diseasesCategory[diseasesCategoryKey];

        let keywordIndex = 0;
        for (let diseaseKey in disease) {
          if (!diseaseKey.startsWith("disease_name")) {
            const keyword = disease[diseaseKey];

            const targetObj = {
              id: `${diseaseCategoryIndex}_${diseaseIndex}_${keywordIndex}`,
              question: `${diseaseKey} of ${disease.disease_name}`,
              answerCorrectOptions: [],
              keyword: diseaseKey,
            };

            for (let keywordKey in keyword) {
              const keywordChild = keyword[keywordKey];
              targetObj.answerCorrectOptions.push(keywordChild.name);
              if (answerAllOptions.hasOwnProperty(diseaseKey)) {
                if (!answerAllOptions[diseaseKey].includes(keywordChild.name)) {
                  answerAllOptions[diseaseKey].push(keywordChild.name);
                }
              } else {
                answerAllOptions[diseaseKey] = [keywordChild.name];
              }
            }
            quizItems.push(targetObj);
            keywordIndex++;
          }
        }
        diseaseIndex++;
      }
    }
  });
  return quizItems;
};

const preferredQuizPlayCount = ref(5);
const preferredPlayCountDialog = ref(true);

const quizItemsTraversed = ref([]);
const selectedAnswers = ref([]);

const selectedChips = ref([]);
const selectKeyword = (selectedKeyword) => {
  const foundIndex = selectedAnswers.value.findIndex(
    (item) => item == selectedKeyword
  );
  if (foundIndex === -1) {
    selectedAnswers.value.push(selectedKeyword);
  } else {
    selectedAnswers.value.splice(foundIndex, 1);
  }
};

const assignQuizItemCurrent = () => {
  //check quizTraversed, and if not present add to quizCurrent
  if (quizItemsTraversed.value.length === preferredQuizPlayCount.value) return;

  const randomQuizItem = shuffleArray(quizItems.value)[0];
  if (!quizItemsTraversed.value.includes(randomQuizItem)) {
    Object.assign(quizItemCurrent, randomQuizItem);
    quizItemsTraversed.value.push(quizItemCurrent.id);
  } else {
    assignQuizItemCurrent();
  }
};
const correctAnswer = ref([]);
const inCorrectAnswer = ref([]);
const missedAnswer = ref([]);

const pointsGame = ref(0);
const pointsRound = computed(
  () =>
    correctAnswer.value.length * 10 -
    inCorrectAnswer.value.length * 5 -
    missedAnswer.value.length * 5
);

watch(
  () => pointsRound.value,
  (newVal) => {
    pointsGame.value += newVal;
  }
);

const answerColor = ref([]); // i->incorrect, c->correct, n->neutral

const assignAnswerColor = (targetItem, char) => {
  const foundIndex = shuffleAnswerAllOptions.value.findIndex(
    (item) => item == targetItem
  );
  if (foundIndex !== -1) {
    answerColor.value[foundIndex] = char;
  }
};

const initialSubmissionDone = ref(false);
const answerSubmitted = ref(false);

const submitAnswer = () => {
  if (!answerSubmitted.value) answerSubmitted.value = true;
  initialSubmissionDone.value = true;

  quizItemCurrent.answerCorrectOptions.forEach((correctOption) => {
    if (!selectedAnswers.value.includes(correctOption)) {
      missedAnswer.value.push(correctOption);
      assignAnswerColor(correctOption, "m");
    }
    selectedAnswers.value.forEach((selectedAnswer) => {
      if (selectedAnswer == correctOption) {
        correctAnswer.value.push(selectedAnswer);
        assignAnswerColor(selectedAnswer, "c");
      }
    });
  });
  selectedAnswers.value.forEach((selectedAnswer) => {
    if (!quizItemCurrent.answerCorrectOptions.includes(selectedAnswer)) {
      inCorrectAnswer.value.push(selectedAnswer);
      assignAnswerColor(selectedAnswer, "i");
    }
  });
};
const resetQuiz = () => {
  answerSubmitted.value = false;
  selectedChips.value = [];
  selectedAnswers.value = [];
  correctAnswer.value = [];
  inCorrectAnswer.value = [];
  missedAnswer.value = [];
  answerColor.value = new Array(
    answerAllOptions[quizItemCurrent.keyword].length
  ).fill("n");
};
const next = () => {
  resetQuiz();
  assignQuizItemCurrent();
};
const repeatQuiz = () => {
  preferredPlayCountDialog.value = true;
  pointsGame.value = 0;
  quizItemsTraversed.value = [];
  resetQuiz();
  assignQuizItemCurrent();
};
const newQuiz = () => {
  router.push({name: "quiz-list"});
};

onMounted(async () => {
  await store.dispatch("quiz/setQuiz", route.params.id).then((response) => {
    quizItems.value = generateQuiz();
    assignQuizItemCurrent();
  });
});
watch(
  () => answerAllOptions[quizItemCurrent.keyword],
  (newVal) => {
    answerColor.value = new Array(newVal.length).fill("n");
  }
);
</script>

<template>
  <v-container class="fill-height quiz-play">
    <page-title title="Play Quiz"></page-title>
    <v-row
      v-if="quizItemCurrent?.id"
      align="center"
      class="fill-height"
      justify="center"
    >
      <v-col cols="12" md="8">
        <v-row>
          <v-col class="text-capitalize text-center border rounded my-5">
            {{ quizItemCurrent.question }}
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12">
            <v-chip-group
              v-model="selectedChips"
              class="v-row justify-space-between"
              filter
              multiple
              variant="outlined"
            >
              <v-chip
                v-for="(item, index) in shuffleAnswerAllOptions"
                :key="index"
                :class="{ 'bg-missed': answerColor[index] === 'm' }"
                :color="
                  answerColor[index] === 'i'
                    ? 'error'
                    : answerColor[index] === 'c'
                    ? 'success'
                    : ''
                "
                :disabled="answerSubmitted"
                :filter="true"
                :filter-icon="
                  answerColor[index] == 'i'
                    ? 'mdi-close-circle'
                    : 'mdi-check-circle'
                "
                class="ms-2 mt-2 chip-answer v-col v-col-5"
                label
                size="x-large"
                @click="selectKeyword(item)"
              >{{ item }}
              </v-chip>
            </v-chip-group>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col :class="{ 'border rounded': answerSubmitted }" cols="12">
            <v-row
              :justify="initialSubmissionDone ? 'space-around' : 'center'"
              align="center"
            >
              <v-col :md="initialSubmissionDone ? 6 : null" cols="auto">
                <div class="text-center">
                  Remaining Play Count:
                  {{ preferredQuizPlayCount - quizItemsTraversed.length }}
                </div>
                <v-btn
                  v-if="!answerSubmitted"
                  block
                  class="my-2"
                  variant="outlined"
                  @click="submitAnswer"
                >Submit answer
                </v-btn>
                <v-btn
                  v-else
                  :disabled="
                    preferredQuizPlayCount == quizItemsTraversed.length
                  "
                  block
                  class="my-2"
                  variant="outlined"
                  @click="next"
                >Next
                </v-btn>
                <template
                  v-if="
                    preferredQuizPlayCount == quizItemsTraversed.length &&
                    answerSubmitted
                  "
                >
                  <v-btn
                    block
                    class="my-2"
                    variant="outlined"
                    @click="repeatQuiz"
                  >Repeat quiz
                  </v-btn>
                  <v-btn block class="my-2" variant="outlined" @click="newQuiz"
                  >Run new quiz
                  </v-btn>
                </template>
              </v-col>
              <v-col v-if="initialSubmissionDone">
                <v-table density="compact">
                  <tbody>
                  <tr>
                    <td>Correct Answers: {{ correctAnswer.length }}</td>
                    <td class="text-green">
                      +
                      {{ correctAnswer.length * 10 }} points
                    </td>
                  </tr>
                  <tr>
                    <td>Incorrect Answers: {{ inCorrectAnswer.length }}</td>
                    <td class="text-red">
                      -
                      {{ inCorrectAnswer.length * 5 }} points
                    </td>
                  </tr>
                  <tr>
                    <td>Missed Answers: {{ missedAnswer.length }}</td>
                    <td class="text-red">
                      -
                      {{ missedAnswer.length * 5 }} points
                    </td>
                  </tr>
                  <tr>
                    <td>Total points for this round</td>
                    <td :class="pointsRound > 0 ? 'text-green' : 'text-red'">
                      <b>{{ pointsRound }}</b> points
                    </td>
                  </tr>
                  <tr>
                    <td>Total points for this game</td>
                    <td :class="pointsGame > 0 ? 'text-green' : 'text-red'">
                      <b>{{ pointsGame }}</b> points
                    </td>
                  </tr>
                  </tbody>
                </v-table>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-row justify="center">
          <v-col class="text-center mb-6" cols="12" md="6"></v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>

  <v-dialog v-model="preferredPlayCountDialog" max-width="400">
    <v-card>
      <v-card-title>Preferred Quiz Play Count</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="preferredQuizPlayCount"
          :hint="`Max allowed count: ${quizItems.length}`"
          :persistent-hint="true"
          clearable
          density="compact"
          label="Set Play Count"
          type="number"
          variant="outlined"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="preferredPlayCountDialog = !preferredPlayCountDialog"
        >OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.chip-answer {
  white-space: pre-wrap !important;
  --v-chip-height: auto !important;
  padding: 10px !important;
}

.bg-missed {
  color: rgb(42, 41, 41) !important;
  background-color: rgb(76 175 80 / 33%) !important;
}

.v-chip--disabled {
  opacity: 0.8 !important;
}
</style>
