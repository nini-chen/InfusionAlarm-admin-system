<template>
  <div class="flex items-center px-2px py-1px pr-16px rounded-l-2xl -mr-8px" :style="bgStyle">
    <SvgIcon class="mr-2" size="24" :name="svgName" :style="iconColorStyle" />
    <span class="text-white text-sm">{{ callLabel }}</span>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { CallStatusEnum, CallLabelEnum, CallIconColorEnum, CallLabelBgEnum } from '../careEnum';
  import { SvgIcon } from '/@/components/Icon';
  import { RoomListRecord } from '/@/api/patients/model/roomModel';

  const props = defineProps({
    status: {
      type: Number,
      default: 0,
    },
    data: {
      type: Object,
      default: () => {
        return {} as RoomListRecord;
      },
    },
  });

  /**
   * 2. 目前病房只需处理2种呼叫状态：离线和卫生间紧急呼叫
   * */
  // svg图标: 0 离线 ；6卫生间呼叫
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
    /**
     * 2023/8/15 卫生间可以存在多个;
     * 当卫生间报警：如果后端返回卫生间报警文本提示则使用后端的，没有的话，用默认的提示
     */
    if (CallStatusEnum[props.status] === 'WC_WARNING' && props.data.online_text) {
      return extractTextAfterHash(`${props.data.online_text}`);
    }
    return CallLabelEnum[CallStatusEnum[props.status]];
  });

  // 截取字符串第一个#后面的内容
  function extractTextAfterHash(str) {
    const regex = /#(.*)/;
    const match = str.match(regex);
    const result = match ? match[1] : str;
    return result;
  }
</script>
