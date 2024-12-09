<template>
  <v-container>
    <v-card class="ma-auto w-50">
      <v-card-title class="d-flex">
        <v-spacer></v-spacer>
        <v-btn theme="light" @click="init">开始</v-btn>
      </v-card-title>
      <v-card-subtitle class="d-flex"></v-card-subtitle>
      <v-card-text>
        <game-board class="flex-1-1"></game-board>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/stores/app";

let store = useAppStore();
function init() {
  store.initBoard();
}
onMounted(() => {
  init();
});
</script>

<style scoped></style>
