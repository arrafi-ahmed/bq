<script setup>
import {appName, getToLink} from "@/others/util";

const items = [{title: "Home", to: {name: "home"}}];
</script>
<template>
  <v-footer class="bg-grey-lighten-3 flex-grow-0">
    <v-row justify="center" no-gutters>
      <v-btn
        v-for="(item, index) in items"
        :key="index"
        :to="getToLink(item)"
        class="mx-md-2"
        color="primary"
        exact
        rounded
        size="small"
        variant="text"
      >
        {{ item.title }}
      </v-btn>
      <v-col class="text-center mt-md-1" cols="12">
        <small>
          &copy; {{ new Date().getFullYear() }} —
          <strong>{{ appName }}</strong> v1.0
        </small>
      </v-col>
    </v-row>
  </v-footer>
</template>
