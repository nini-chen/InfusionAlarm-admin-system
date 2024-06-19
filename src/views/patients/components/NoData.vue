<template>
  <div class="flex flex-col justify-center items-center flex-grow">
    <img :src="noBed" />
    <p class="text-gray-400">{{ label }}</p>
  </div>
</template>
<script lang="ts" setup>
  import noBed from '/@/assets/images/no-bed.png';
  defineProps({
    label: {
      type: String,
      default: () => '暂无数据',
    },
  });
</script>
