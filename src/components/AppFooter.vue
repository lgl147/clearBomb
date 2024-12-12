<template>
  <v-footer :app="true" height="40" class="text-success text-caption">
    <div class="d-block d-sm-none">
      切换为标记状态时, 点击数字, 如果周围8个格子存在的雷已全部标记, 则会自动打开其余格子
      <span class="text-error">(标错了会爆炸...)</span>
    </div>
    <div class="d-sm-block d-none">
      左键挖掘, 右键标记, 右键点击数字, 如果周围8个格子存在的雷已全部标记, 则会自动打开其余格子
      <span class="text-error">(标错了会爆炸...)</span>
    </div>
  </v-footer>
</template>
