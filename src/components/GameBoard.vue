<template>
  <v-card>
    <v-card-title class="d-flex align-center">
      <v-select
        density="compact"
        v-model="selectedSize"
        label="尺寸"
        hide-details
        variant="outlined"
        :items="BOARD_SIZES"
      ></v-select>
      <v-select
        density="compact"
        v-model="store.diff"
        label="难度"
        hide-details
        :items="GAME_DIFFICULT"
        variant="outlined"
        class="mx-4"
      ></v-select>
      <v-btn @click="init" color="primary">重新开始</v-btn>
    </v-card-title>
    <v-card-subtitle>
      <div>已标记: {{ store.flagCount }} / 总炸弹数: {{ store.bombsList.length }}</div>
    </v-card-subtitle>
    <v-card-text class="board" :style="boardStyle">
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
            <v-icon icon="mdi-flag" size="x-large" color="error" v-if="ground[rowIndex][colIndex] == 1"></v-icon>
          </div>
        </v-card>
      </div>

      <v-dialog v-model="gameover" contained persistent opacity=".7">
        <v-card :title="store.isWin ? '胜利!' : '失败!'" :subtitle="store.isWin ? '您已取得成功' : '你已取得失败'">
          <v-card-actions>
            <v-btn color="primary" @click="init">重新开始</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>
<script setup lang="ts">
import { BOARD_SIZES, GAME_DIFFICULT, useAppStore } from "@/stores/app";

let store = useAppStore();

let ground = computed(() => store.ground);
let boards = computed(() => store.boards);
let size = computed(() => store.size);
let gameover = ref(false);
let selectedSize = ref();
watch(
  () => store.gaming,
  (val) => {
    gameover.value = !val;
  }
);

let boardStyle = computed(() => {
  return `grid-template-columns: repeat(${size.value}, 1fr)`;
});

function open(row: number, col: number) {
  store.open(row, col);
}
function mark(row: number, col: number) {
  store.mark(row, col);
}
function init() {
  store.size = selectedSize.value;
  store.initBoard();
}

onMounted(() => {
  selectedSize.value = store.size;
});
</script>

<style lang="scss" scoped>
.board {
  display: grid;
  flex-direction: column;
  justify-content: space-between;
  // aspect-ratio: 1;
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
}
</style>
