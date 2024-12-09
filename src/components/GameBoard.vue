<template>
  <div class="board" :style="boardStyle">
    <div v-for="(row, rowIndex) in boards">
      <div
        v-for="(col, colIndex) in row"
        class="d-flex justify-center align-center col"
        :class="{ pointer: col != 0, 'bg-primary': col == 9 }"
        v-ripple
        @click="open(rowIndex, colIndex)"
      >
        {{ col }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
let boards: any = ref();
let size = 9;
let diff = 2;

let boardStyle = computed(() => {
  return `grid-template-columns: repeat(${size}, 1fr)`;
});

let directions = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

function initBoard() {
  boards.value = Array.from({ length: size }, () => Array(size).fill(0));
  console.log(boards.value);
  let bombs = ((size * size) / 3 / 3) * diff;
  let bombsList = random(size * size, bombs);
  console.log(bombsList.sort((a, b) => a - b));
  bombsList.forEach((item: number) => {
    let row = Math.floor(item / size);
    let col = item % size;
    boards.value[row][col] = 9;
    directions.forEach((dir) => {
      let r = row + dir[0];
      let c = col + dir[1];
      if (r >= 0 && c >= 0 && r < size && c < size && boards.value[r][c] < 9) boards.value[r][c] += 1;
    });
  });
}

function open(row: number, col: number) {
  console.log(row, col, row * size + col);
}

function random(m: number, n: number) {
  if (n > m) throw new Error("n 不能大于 m");

  // 生成从 0 到 m-1 的数组
  const arr = Array.from({ length: m }, (_, i) => i);

  // 洗牌算法打乱数组
  for (let i = m - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  // 取前 n 个数字
  return arr.slice(0, n);
}

onMounted(() => {
  initBoard();
});
</script>

<style lang="scss" scoped>
.board {
  display: grid;
  flex-direction: column;
  justify-content: space-between;
  // grid-template-columns: repeat(12, 1fr);
  aspect-ratio: 1;
  max-height: 100%;
}
.col {
  aspect-ratio: 1;
  user-select: none;
}
.pointer {
  cursor: pointer;
}
</style>
