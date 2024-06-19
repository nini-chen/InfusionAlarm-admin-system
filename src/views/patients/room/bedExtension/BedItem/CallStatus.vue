<template>
  <!-- 1. 对讲中 -->
  <div v-if="status == 2" class="flex items-center justify-center caring-status -mr-8px">
    <HeartFilled style="color: #eb4988" class="mr-2" />
    <span class="label">对讲中</span>
  </div>
  <!-- 2. 其他状态 -->
  <div v-else class="flex items-center p-2px pr-8px rounded-l-2xl -mr-8px" :style="bgStyle">
    <SvgIcon class="mr-2" size="24" :name="svgName" :style="iconColorStyle" />
    <span class="text-white text-sm">{{ callLabel }}</span>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { CallStatusEnum, CallLabelEnum, CallIconColorEnum, CallLabelBgEnum } from '../careEnum';
  import { SvgIcon } from '/@/components/Icon';
  import { HeartFilled } from '@ant-design/icons-vue';

  const props = defineProps({
    status: {
      type: Number,
      default: 0,
    },
  });

  /**
   * 2. 下面是非对讲中的状态颜色（因为对讲中的颜色和图标非常不一样， 另外单独处理）
   * */
  // svg图标: 0 离线 ；2普通呼叫中
  const svgName = computed(() => {
    return props.status != 0 ? 'calling' : 'device-off';
  });
  // 呼叫图标背景颜色
  const iconColorStyle = computed(() => {
    return `color: ${CallIconColorEnum[CallStatusEnum[props.status]]};`;
  });
  // 呼叫状态背景颜色
  const bgStyle = computed(() => {
    return `background-color: ${CallLabelBgEnum[CallStatusEnum[props.status]]};`;
  });

  // 3. 呼叫状态名称
  const callLabel = computed(() => {
    return CallLabelEnum[CallStatusEnum[props.status]];
  });
</script>
<style lang="less" scoped>
  // 1. 对讲中的状态样式
  .caring-status {
    width: 70px;
    height: 24px;
    background: linear-gradient(133deg, #fb8fb9 0%, rgba(255, 255, 255, 0.6) 100%);
    border-radius: 0px 6px 0px 6px;

    .label {
      width: 36px;
      height: 17px;
      font-size: 12px;
      font-weight: 500;
      color: #e6226e;
      line-height: 17px;
    }
  }
</style>
