<script setup>
import {computed, defineEmits, defineProps, ref, watch} from "vue";
import {useDisplay} from "vuetify";
import {formatDate} from "@/others/util";

const {width, height, mobile} = useDisplay();
const emit = defineEmits(["update:modelValue"]);
const {label, color, modelValue, customClass, rules, variant} = defineProps([
  "label",
  "color",
  "modelValue",
  "customClass",
  "rules",
  "variant",
]);

const selectedDate = ref(modelValue);
const menu = ref(false);
const formattedSelectedDate = computed(() =>
  selectedDate.value ? formatDate(selectedDate.value) : ""
);

const handleDateChange = (newDate) => {
  selectedDate.value = newDate;
  emit("update:modelValue", newDate);
};

watch(selectedDate, () => {
  menu.value = false;
});
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false">
    <template v-slot:activator="{ props }">
      <v-text-field
        v-model="formattedSelectedDate"
        :label="label"
        :rules="rules"
        :variant="variant"
        class="customClass"
        density="compact"
        hide-details="auto"
        prepend-inner-icon="mdi-calendar"
        readonly
        v-bind="props"
        @click:clear="selectedDate = null"
      />
    </template>
    <v-date-picker
      v-model="selectedDate"
      :color="color"
      :height="mobile ? height : 'auto'"
      :width="mobile ? width : 'auto'"
      show-adjacent-months
      title=""
      @change="handleDateChange"
    />
  </v-menu>
</template>
<style>
.v-overlay__content:has(> .v-date-picker) {
  min-width: auto !important;
}

.v-picker-title {
  padding: 0 !important;
}

@media only screen and (max-width: 600px) {
  .v-overlay__content:has(> .v-date-picker) {
    left: 0 !important;
  }
}
</style>
