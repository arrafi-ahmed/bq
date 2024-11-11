<script setup>
import Logo from "@/components/Logo.vue";
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {computed, ref} from "vue";
import {getToLink} from "@/others/util";
import {useDisplay} from "vuetify";
import UserAvatar from "@/components/UserAvatar.vue";

const store = useStore();
const {mobile} = useDisplay();
const router = useRouter();
const signedin = computed(() => store.getters["user/signedin"]);
const currentUser = computed(() => store.getters["user/getCurrentUser"]);

const drawer = ref(false);

const items = [
  {title: "Home", to: {name: "home"}},
  {title: "Quiz List", to: {name: "quiz-list"}},
];
const getFirstName = computed(
  () => currentUser.value?.name?.split(" ")?.[0] || ""
);
const getGreetings = computed(() => {
  const hour = new Date().getHours();
  return `Good ${hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening"}!`;
});
</script>

<template>
  <v-app-bar :order="1" class="px-2 px-md-5" color="grey-lighten-3" dense flat>
    <logo custom-class="clickable" @click="router.push({ name: 'home' })"/>

    <template v-slot:append>
      <v-btn
        v-if="signedin"
        :size="mobile ? 'default' : 'large'"
        icon
        v-bind="props"
      >
        <user-avatar
          :imgSrc="currentUser.image"
          @click-avatar="drawer = !drawer"
        ></user-avatar>
      </v-btn>
    </template>
  </v-app-bar>
  <v-navigation-drawer
    v-if="signedin"
    v-model="drawer"
    :width="200"
    location="end"
    temporary
  >
    <v-list>
      <v-list-item>
        <div class="d-flex justify-start align-center">
          <user-avatar
            :imgSrc="currentUser.image"
            @click-avatar="drawer = !drawer"
          ></user-avatar>
          <div class="ml-3">
            <small>
              {{ getGreetings }}
            </small>
            <div>
              {{ getFirstName }}
            </div>
          </div>
        </div>
      </v-list-item>
      <v-divider class="mt-2 mb-2"></v-divider>
      <v-list-item
        v-for="(item, index) in items"
        :key="index"
        :to="getToLink(item)"
      >
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
    </v-list>
    <template v-slot:append>
      <div class="ma-5">
        <v-btn :to="{ name: 'signout' }" block color="primary">Signout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<style scoped></style>
