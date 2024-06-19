<template>
  <div
    class="flex items-center p-2px pr-8px rounded-l-2xl -mr-8px"
    :style="`background-color: ${bgColor};`"
    v-if="showStatus"
  >
    <SvgIcon class="mr-2" size="24" :name="svgName" />
    <span class="text-white text-sm">{{ label }}</span>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { SvgIcon } from '/@/components/Icon';
  import {
    DeviceStatusEnum,
    DeviceStatusLabelsEnum,
    DeviceStatusIconsEnum,
    DeviceStatusColorsEnum,
  } from './deviceEnum';

  const props = defineProps({
    status: {
      type: Number,
      default: 0,
    },
  });

  const showStatus = computed(() => DeviceStatusEnum[props.status ?? 0] != 'FREE');
  const svgName = computed(() => DeviceStatusIconsEnum[DeviceStatusEnum[props.status ?? 0]]);
  const bgColor = computed(() => DeviceStatusColorsEnum[DeviceStatusEnum[props.status ?? 0]]);
  const label = computed(() => DeviceStatusLabelsEnum[DeviceStatusEnum[props.status ?? 0]]);
</script>
