<script setup>
import { useStore } from "vuex";
import { computed } from "vue";
import PageTitle from "@/components/PageTitle.vue";

const store = useStore();
const inputJson = computed(() => store.state.quiz.inputJson);

const downloadJsonFile = () => {
  const formattedJson = JSON.stringify(inputJson.value.data, null, 2);
  const blob = new Blob([formattedJson], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "output.json";
  link.click();
  URL.revokeObjectURL(link.href);
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
      <v-col>
        <div v-if="inputJson.data.Diseases_category">
          <p class="level-1 pa-2 pl-l1">
            Disease Category Name:
            {{ inputJson.Diseases_category?.Disease_category_name }}
          </p>

          <div
            v-for="(disease, diseaseKey) in inputJson.data.Diseases_category"
            :key="diseaseKey"
            v-if="diseaseKey !== 'Disease_category_name'"
          >
            <div v-if="diseaseKey !== 'Disease_category_name'" class="level-2">
              <div class="pa-2 pl-l2">{{ disease.Disease_Name }}</div>
              <div
                v-for="(subcategory, key) in disease"
                :key="key"
                v-if="key !== 'Disease_Name'"
              >
                <div v-if="key !== 'Disease_Name'" class="level-3">
                  <div class="pa-2 pl-l3">{{ key }}:</div>
                  <div
                    v-for="(item, subcategoryChildIndex) in subcategory"
                    :key="subcategoryChildIndex"
                    class="level-4"
                  >
                    <div class="pa-2 pl-l4">{{ item }}</div>
                    <v-divider
                      v-if="subcategoryChildIndex + 1 !== subcategory.length"
                    ></v-divider>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.level-1 {
  background-color: #b4c7e7;
}

.level-2 {
  background-color: #f8cbad;
}

.level-3 {
  background-color: #ffd966;
}

.level-4 {
  background-color: #a9d18e;
}

.pl-l1 {
  padding-left: 50px !important;
}

.pl-l2 {
  padding-left: 100px !important;
}

.pl-l3 {
  padding-left: 150px !important;
}

.pl-l4 {
  padding-left: 200px !important;
}
</style>
