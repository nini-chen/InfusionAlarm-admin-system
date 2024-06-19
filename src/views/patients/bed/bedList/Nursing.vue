<template>
  <div class="statistics flex">
    <!-- 护理级别的统计 -->
    <div class="flex items-center mr-6" v-for="(item, key) in statistics" :key="key">
      <CareIcon :color="setCareLevelColor(item.color)" :label="item.name.slice(0, 1)" />
      <span class="text-black font-bold text-sm ml-1">{{ item.name }}</span>
      <span class="text-center text-sm" :style="`color: ${setCareLevelColor(item.color)};`"
        >({{ item.nums }})</span
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { setCareLevelColor } from './BedItem/careEnum';
  import CareIcon from './BedItem/CareIcon.vue';
  import { CareRecord } from '/@/api/patients/model/bedModel';
  defineProps({
    statistics: {
      type: Array as PropType<CareRecord[]>,
      default: () => [],
    },
  });
</script>
