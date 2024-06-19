<template>
  <span class="icon" :style="`background-color: ${color};border:2px solid ${color};`">
    {{ label }}
  </span>
</template>
<script lang="ts" setup>
  defineProps({
    color: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
  });
</script>
<style lang="less" scoped>
  .icon {
    display: inline-block;
    width: 20px;
    height: 20px;
    line-height: 20px;
    line-height: normal;
    text-align: center;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
    position: relative;
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      content: '';
      display: inline-block;
      height: 16px;
      width: 16px;
      border-radius: 2px;
      background-color: rgba(255, 255, 255, 0.3);
    }
  }
</style>
