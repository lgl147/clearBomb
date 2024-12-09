// Utilities
import { defineStore } from "pinia";

export const BOARD_SIZES = [9, 12, 15];

export const GAME_DIFFICULT = [];

export const useAppStore = defineStore("app", {
  state: () => ({
    size: BOARD_SIZES[0],
    time: 0,
  }),
  actions: {
    resetTime() {
      this.time = 0;
    },
  },
  persist: true,
});
