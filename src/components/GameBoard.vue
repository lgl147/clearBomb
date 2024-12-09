<template>
  <div>
    <div class="board" :style="boardStyle">
      <div v-for="(row, rowIndex) in boards">
        <v-card
          v-for="(col, colIndex) in row"
          class="d-flex justify-center align-center col pa-1"
          :class="{ pointer: col != 0, 'bg-error': col == 9 }"
          @click="open(rowIndex, colIndex)"
          :ripple="false"
          @contextmenu.prevent="mark(rowIndex, colIndex)"
        >
          <v-icon v-if="col == 9" icon="mdi-bomb" size="x-large"></v-icon>
          <span v-if="col != 9 && col != 0">{{ col }}</span>
          <div class="unknown" v-if="ground[rowIndex][colIndex] < 2" v-ripple>
            <v-icon icon="mdi-flag" color="error" v-if="ground[rowIndex][colIndex] == 1"></v-icon>
          </div>
        </v-card>
      </div>
    </div>
    <v-overlay
      activator="parent"
      contained
      v-model="gameover"
      :close-on-back="false"
      opacity="0.9"
      class="align-center justify-center"
    >
      <div class="d-flex justify-center align-center flex-column h-100 w-100">
        <div class="text-error text-h3 mb-4">结束</div>
        <v-btn @click="init" color="primary">重新开始</v-btn>
      </div>
    </v-overlay>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from "@/stores/app";

let store = useAppStore();

let props = defineProps({
  title: {
    type: [Boolean, String],
    default: "clear bomb",
  },
});

let ground = computed(() => store.ground);
let boards = computed(() => store.boards);
let gameover = computed(() => !store.gaming);
let size = store.size;

let boardStyle = computed(() => {
  return `grid-template-columns: repeat(${size}, 1fr)`;
});

function open(row: number, col: number) {
  store.open(row, col);
}
function mark(row: number, col: number) {
  store.mark(row, col);
}
function init() {
  store.initBoard();
}
</script>

<style lang="scss" scoped>
.board {
  display: grid;
  flex-direction: column;
  justify-content: space-between;
  aspect-ratio: 1;
  max-width: 100%;
  max-height: 100%;
}
.col {
  aspect-ratio: 1;
  user-select: none;
  position: relative;
}
.pointer {
  cursor: pointer;
}

.unknown {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: gray;
  opacity: 0.9;
}
</style>
