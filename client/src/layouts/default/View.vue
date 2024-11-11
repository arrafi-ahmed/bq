<script setup></script>
<template>
  <v-main>
    <div class="limit-max-width-xl fill-height">
      <router-view/>
    </div>
  </v-main>
</template>
<style>
.limit-max-width-xl {
  max-width: 1400px !important;
  margin: 0 auto;
}
</style>
