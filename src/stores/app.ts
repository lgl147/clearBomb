// Utilities
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    size: BOARD_SIZES[1],
    diff: GAME_DIFFICULT[1], // 平均值, 每9个方块中有"1"个炸弹
    gaming: false,
    first: true,
    boards: null as any,
    ground: null as any,
    bombsList: null as any,
    isWin: false,
  }),
  actions: {
    initBoard() {
      this.isWin = false;
      this.first = true;
      this.gaming = true;
      let size = this.size;
      this.ground = Array.from({ length: size }, () => Array(size).fill(0));
      this.boards = Array.from({ length: size }, () => Array(size).fill(0));
      let bombs = ((size * size) / 3 / 3) * this.diff;
      this.bombsList = random(size * size, bombs);
      this.computeBomb();
    },
    computeBomb() {
      this.boards = Array.from({ length: this.size }, () => Array(this.size).fill(0));
      this.bombsList.forEach((item: number) => {
        let row = Math.floor(item / this.size);
        let col = item % this.size;
        this.boards[row][col] = 9;
        DIRECTIONS.forEach((dir) => {
          let r = row + dir[0];
          let c = col + dir[1];
          if (r >= 0 && c >= 0 && r < this.size && c < this.size && this.boards[r][c] < 9) this.boards[r][c] += 1;
        });
      });
    },
    open(row: number, col: number) {
      if (this.first) {
        this.first = false;
        // 第一步就挂
        if (this.boards[row][col] == 9) {
          let index = this.bombsList.findIndex((item: number) => item == row * this.size + col);
          this.bombsList.splice(index, 1);
          this.computeBomb();
        }
      }
      if (!this.gaming) return;

      if (this.ground[row][col] == 1 || this.ground[row][col] == 2) return;

      this.ground[row][col] = 2;

      if (this.boards[row][col] == 9) {
        this.gaming = false;
        return;
      }

      if (this.boards[row][col] == 0) {
        this.openAround(row, col);
      }
    },
    openAround(row: any, col: any, bombs?: any) {
      DIRECTIONS.forEach((dir) => {
        let r = row + dir[0];
        let c = col + dir[1];
        if (r >= 0 && c >= 0 && r < this.size && c < this.size) {
          this.open(r, c);
        }
      });
    },
    mark(row: any, col: any) {
      if (!this.gaming) return;
      if (this.ground[row][col] == 2) {
        let flagCount = 0;
        DIRECTIONS.forEach((dir) => {
          let r = row + dir[0];
          let c = col + dir[1];
          if (r >= 0 && c >= 0 && r < this.size && c < this.size) {
            if (this.ground[r][c] == 1) flagCount += 1;
          }
        });
        if (flagCount != this.boards[row][col]) return;
        this.openAround(row, col);
        return;
      }
      if (this.ground[row][col] == 1) {
        this.ground[row][col] = 0;
      } else {
        this.ground[row][col] = 1;
      }
      this.checkWin();
    },
    checkWin() {
      let bombsLen = this.bombsList.length;
      let flagLen = this.ground.flat().filter((item: any) => item == 1)?.length;
      console.log(bombsLen, flagLen);
      if (bombsLen != flagLen) return;
      let flags: any = [];
      this.ground.flat().forEach((item: any, index: any) => {
        if (item == 1) flags.push(index);
      });
      console.log(JSON.stringify(flags), JSON.stringify(this.bombsList));
      if (JSON.stringify(flags) == JSON.stringify(this.bombsList)) {
        // 胜利
        this.isWin = true;
      } else {
        // 失败
        this.isWin = false;
      }
      this.gaming = false;
    },
  },
  persist: true,
});

export const BOARD_SIZES = [9, 12, 15];

export const GAME_DIFFICULT = [1, 2, 3];

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

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
  return arr.slice(0, n).sort((a: any, b: any) => a - b);
}
