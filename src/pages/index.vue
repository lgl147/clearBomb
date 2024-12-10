<template>
  <v-container class="d-flex justify-center align-center h-100">
    <v-card>
      <v-card-title>
        <v-btn @click="useAppStore().initBoard">开始</v-btn>
      </v-card-title>
      <game-board></game-board>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/stores/app";
</script>
