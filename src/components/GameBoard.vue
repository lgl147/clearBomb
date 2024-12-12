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
        item-value="value"
        item-title="name"
        label="难度"
        hide-details
        :items="diffs"
        variant="outlined"
        class="mx-4"
      ></v-select>
      <v-btn @click="init" color="primary">开始</v-btn>
    </v-card-title>
    <v-card-subtitle>
      <div>已标记: {{ store.flagCount }} / 总炸弹数: {{ store.bombsList.length }}</div>
    </v-card-subtitle>
    <v-card-text class="board" :style="boardStyle">
      <div v-for="(row, rowIndex) in boards">
        <v-card
          v-for="(col, colIndex) in row"
          class="d-flex justify-center align-center col overflow-hidden"
          :class="{ pointer: col != 0 }"
          :ripple="false"
          @click="handleClick(rowIndex, colIndex)"
          @click.right.prevent="mark(rowIndex, colIndex)"
        >
          <div class="unknown" v-if="ground[rowIndex][colIndex] < 2" v-ripple>
            <v-icon icon="mdi-flag" size="x-large" color="error" v-if="ground[rowIndex][colIndex] == 1"></v-icon>
          </div>
          <template v-else>
            <v-icon v-if="col == 9" icon="mdi-bomb" size="x-large" color="error"></v-icon>
            <span v-if="col != 9 && col != 0">{{ col }}</span>
          </template>
        </v-card>
      </div>

      <v-dialog v-model="gameover" contained persistent opacity=".7">
        <v-card :subtitle="store.isWin ? '您已取得成功' : '你已取得失败'">
          <v-card-title>
            <v-icon :icon="store.isWin ? 'mdi-emoticon' : 'mdi-emoticon-cry'"></v-icon>
            {{ store.isWin ? "牛逼!" : "失败了~~不要灰心" }}
          </v-card-title>
          <v-card-actions>
            <v-btn color="primary" @click="init" block size="x-large">重新开始</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
    <v-card-actions class="px-4 py-0 d-sm-none d-block">
      <v-btn @click="isMark = !isMark" :color="isMark ? 'error' : 'primary'">
        切换:
        {{ isMark ? "标记" : "挖掘" }}
        <v-icon :icon="isMark ? 'mdi-flag-variant-plus' : 'mdi-shovel'"></v-icon>
      </v-btn>
    </v-card-actions>
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

let isMark = ref(false);

let diffs: any = computed(() => {
  return GAME_DIFFICULT.map((item) => ({
    name: ["", "简单", "中等", "困难"][item],
    value: item,
  }));
});

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
  isMark.value = false;
  store.size = selectedSize.value;
  store.initBoard();
}

function handleClick(rowIndex: any, colIndex: any) {
  isMark.value ? mark(rowIndex, colIndex) : open(rowIndex, colIndex);
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
  z-index: 2;
  &:hover {
    opacity: 0.9;
  }
}
</style>
