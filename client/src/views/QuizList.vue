<script setup>
import PageTitle from "@/components/PageTitle.vue";
import { convertTextToArr, isValidTxtfile } from "@/others/util";
import { computed, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

const quizzes = computed(() => store.state.quiz.quizzes);

onMounted(() => {
  store.dispatch("quiz/setQuizzes");
});
</script>
<template>
  <v-container class="fill-height">
    <page-title title="Quiz List"></page-title>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="6">
        <v-list v-if="quizzes.length > 0">
          <v-list-item
            v-for="(item, index) in quizzes"
            :key="item.id"
            :title="item.name"
            link
            @click.stop="
              (e) =>
                router.push({
                  name: 'quiz-play',
                  params: { id: item.id },
                })
            "
          >
            <template #append>
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi-dots-vertical" v-bind="props" variant="text">
                  </v-btn>
                </template>
                <v-list density="compact">
                  <v-list-item
                    link
                    title="Edit"
                    @click.stop="
                      (e) =>
                        router.push({
                          name: 'quiz-edit',
                          params: { id: item.id },
                        })
                    "
                  ></v-list-item>
                  <v-list-item
                    link
                    title="Play"
                    @click.stop="
                      (e) =>
                        router.push({
                          name: 'quiz-play',
                          params: { id: item.id },
                        })
                    "
                  ></v-list-item>
                </v-list>
              </v-menu>
            </template>
            <v-divider
              v-if="index != quizzes.length - 1"
              class="mt-3"
            ></v-divider>
          </v-list-item>
        </v-list>
        <v-alert v-else variant="outlined" type="warning" border="top">
          No Data Available
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
