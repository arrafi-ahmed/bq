<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { isValidEmail, isValidPass, showApiQueryMsg } from "@/others/util";
import PageTitle from "@/components/PageTitle.vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();
const router = useRouter();
const fullName = ref(null);
const email = ref(null);
const password = ref(null);
const confirmPassword = ref(null);
const form = ref(null);
const isFormValid = ref(true);

const registerUser = async () => {
  await form.value.validate();
  if (!isFormValid.value) return;

  const user = {
    fullName: fullName.value,
    email: email.value,
    password: password.value,
  };
  $axios.post("/api/user/register", user).then((res) => {
    router.push({
      name: "signin",
    });
  });
};
onMounted(() => {
  showApiQueryMsg();
});
</script>
<template>
  <v-container class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" md="5">
        <page-title justify="center" title="Registration"></page-title>
        <v-card
          class="pa-2 pa-md-5 my-2 my-md-5 d-block mx-auto"
          color="grey-lighten-3"
          elevation="4"
          max-width="500"
        >
          <v-card-text>
            <v-form
              ref="form"
              v-model="isFormValid"
              fast-fail
              @submit.prevent="registerUser"
            >
              <!-- Full Name -->
              <v-text-field
                v-model="fullName"
                :rules="[
                  (v) => !!v || 'Full Name is required!',
                  (v) =>
                    (v && v.length <= 50) || 'Must not exceed 50 characters',
                ]"
                class="mt-2"
                clearable
                density="compact"
                hide-details="auto"
                label="Full Name"
                required
                variant="solo"
              ></v-text-field>

              <!-- Email Address -->
              <v-text-field
                v-model="email"
                :rules="[
                  (v) => !!v || 'Email is required!',
                  (v) => isValidEmail(v) || 'Invalid Email',
                ]"
                class="mt-2"
                clearable
                density="compact"
                hide-details="auto"
                label="Email Address"
                required
                variant="solo"
              ></v-text-field>

              <!-- Password -->
              <v-text-field
                v-model="password"
                :rules="isValidPass"
                class="mt-2"
                clearable
                density="compact"
                hide-details="auto"
                label="Password"
                required
                type="password"
                variant="solo"
              ></v-text-field>

              <v-text-field
                v-model="confirmPassword"
                :rules="[
                  (v) => !!v || 'Confirm Password is required!',
                  (v) => v === password || 'Confirm password didn\'t match!',
                ]"
                class="mt-2"
                clearable
                density="compact"
                hide-details="auto"
                label="Confirm Password"
                required
                type="password"
                variant="solo"
              ></v-text-field>

              <!-- Register Button -->
              <v-btn
                :density="mobile ? 'comfortable' : 'default'"
                block
                class="mt-2"
                color="primary"
                @click="registerUser"
                >Register
              </v-btn>
              <div
                class="clickable mt-3 text-center text-blue"
                @click="router.push({ name: 'signin' })"
              >
                Already registered?
              </div>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style></style>
