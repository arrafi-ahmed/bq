<script setup>
import { defineEmits, defineProps, onMounted, reactive, ref } from "vue";
import { useDisplay } from "vuetify";

const { item, index } = defineProps(["item", "index", "quantityIndex", "type"]);
const { mobile } = useDisplay();
const emit = defineEmits(["updatePhone"]);

// phone input
const selectedCountry = reactive({
  flag: null,
  name: null,
  code: null,
  dialCode: null,
});

const formatItem5Title = ({ flag, code, name, dialCode }) => {
  return (flag ? flag : code) + " " + name + " " + dialCode;
};
const code = ref(null);
const phone = ref(null);

const formatPhoneInput = (index) => {
  const formattedPhone = `${selectedCountry.dialCode}${phone.value}`;
  emit("updatePhone", { formattedPhone, index });
};

const formatSelectedDialCode = (selectedCode) => {
  const { flag, code, name, dialCode } = item.options.find(
    (item) => item.code == selectedCode
  );
  Object.assign(selectedCountry, {
    ...selectedCountry,
    flag,
    code,
    name,
    dialCode,
  });
};
// set initial selection to uk
onMounted(() => {
  const ukOption = item.options.find((option) => option.code === "GB");
  if (ukOption) {
    code.value = ukOption.code;
    formatSelectedDialCode(code.value);
  }
});
</script>

<template>
  <v-row class="phone" no-gutters>
    <v-col cols="auto">
      <v-select
        v-model="code"
        :item-title="formatItem5Title"
        :items="item.options"
        :menu-props="
          mobile
            ? { maxHeight: '300px', width: '100%' }
            : { maxHeight: '300px', width: '300px' }
        "
        :rules="[(v) => !!v || !item.required || 'required']"
        class="mt-2 mt-md-4 dialCode"
        density="compact"
        hide-details="auto"
        item-value="code"
        @update:modelValue="formatSelectedDialCode"
      >
        <template v-slot:selection="{ item }">
          <div class="d-flex justify-space-between" style="width: 70px">
            <span>{{ selectedCountry.flag }}</span>
            <span>{{ selectedCountry.dialCode }}</span>
          </div>
        </template>
      </v-select>
    </v-col>
    <v-col class="flex-grow-1" cols="auto">
      <v-text-field
        v-model="phone"
        :label="item.text"
        :rules="[(v) => !!v || !item.required || 'required']"
        class="mt-2 mt-md-4"
        density="compact"
        hide-details="auto"
        @update:modelValue="formatPhoneInput(index)"
      >
        <template v-slot:label>
          <span>{{ item.text }}</span>
          <span v-if="item.required" style="color: red">*</span>
        </template>
      </v-text-field>
    </v-col>
  </v-row>
</template>

<style>
.phone .dialCode .v-field__input {
  padding: 5px 0 5px 10px !important;
}

.phone .dialCode .v-field--appended {
  padding-inline-end: 2px;
}
</style>
