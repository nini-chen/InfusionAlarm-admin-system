<template>
  <div class="IP-input-wrap flex items-center h-30px" @keydown="onKeyDown">
    <template v-for="(segment, index) in ipSegments" :key="index">
      <InputNumber
        :min="0"
        :max="255"
        :value="segment"
        :controls="false"
        :readonly="readonly"
        class="text-gray-500 inline-block !mr-0"
        :class="{ '!border-none !shadow-none !bg-transparent pointer-events-none': readonly }"
        :ref="`segment${index}`"
        :id="`segment${index}`"
        @change="onSegmentChange(index, $event)"
      />
      <span v-if="index < 3" class="separator font-bold mx-12px self-end">.</span>
    </template>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue';
  import { MODE } from './../typing';
  import { InputNumber } from 'ant-design-vue';

  const emit = defineEmits(['change', 'update:value']);

  const props = defineProps({
    mode: {
      type: String as PropType<MODE>,
      default: MODE.IP,
      validator(value: any) {
        return Object.values(MODE).includes(value);
      },
    },
    value: { type: String, default: '' },
    readonly: { type: Boolean, default: false },
  });

  const ipSegments = ref(['', '', '', '']);

  const onSegmentChange = (index: number, event: number | string) => {
    ipSegments.value.splice(index, 1, event.toString());
    if (event.toString().length === 3 && index < 3) {
      const nextSegment = document.querySelector(
        `input[id=segment${index + 1}]`,
      ) as HTMLInputElement;
      nextSegment.focus();
    }
    updateTheValue();
  };

  const onKeyDown = (event: KeyboardEvent) => {
    const key = event.key;
    const target = event.target as HTMLInputElement;
    const index = ipSegments.value.indexOf(target.value);
    if (key === 'ArrowLeft' && target.selectionStart === 0 && index > 0) {
      // Move focus to previous segment when left arrow key is pressed at the beginning of a segment
      const prevSegment = document.querySelector(
        `input[id=segment${index - 1}]`,
      ) as HTMLInputElement;
      prevSegment.focus();
    } else if (key === 'ArrowRight' && target.selectionEnd === target.value.length && index < 3) {
      // Move focus to next segment when right arrow key is pressed at the end of a segment
      const nextSegment = document.querySelector(
        `input[id=segment${index + 1}]`,
      ) as HTMLInputElement;
      nextSegment.focus();
    } else if (key === 'Backspace' && target.selectionStart === 0 && index > 0) {
      // Move focus to previous segment and delete last character when backspace key is pressed at the beginning of a segment
      const prevSegment = document.querySelector(
        `input[id=segment${index - 1}]`,
      ) as HTMLInputElement;
      prevSegment.focus();
      ipSegments.value.splice(index - 1, 1, ipSegments.value[index - 1].slice(0, -1));
    } else if (key === 'Delete' && target.selectionEnd === target.value.length && index < 3) {
      // Move focus to next segment and delete first character when delete key is pressed at the end of a segment
      const nextSegment = document.querySelector(
        `input[id=segment${index + 1}]`,
      ) as HTMLInputElement;
      nextSegment.focus();
      ipSegments.value.splice(index + 1, 1, ipSegments.value[index + 1].slice(1));
    } else if (key === 'Tab') {
      // Move focus to next segment when Tab key is pressed
      event.preventDefault();
      if (event.shiftKey) {
        // Move focus to previous segment when Shift + Tab keys are pressed
        if (index > 0) {
          const prevSegment = document.querySelector(
            `input[id=segment${index - 1}]`,
          ) as HTMLInputElement;
          prevSegment.focus();
        }
      } else {
        // Move focus to next segment when Tab key is pressed
        if (index < 3) {
          const nextSegment = document.querySelector(
            `input[id=segment${index + 1}]`,
          ) as HTMLInputElement;
          nextSegment.focus();
        }
      }
    } else if (key === 'Enter') {
      // Submit IP address and close dialog when Enter key is pressed
      event.preventDefault();
      updateTheValue();
    }
  };

  function updateTheValue() {
    const ipAddress = ipSegments.value.join('.');
    emit('change', ipAddress);
    emit('update:value', ipAddress);
  }

  watch(
    () => props.value,
    async (value) => {
      await nextTick();
      if (value) {
        ipSegments.value = value.split('.');
      }
    },
    {
      immediate: true,
    },
  );

  onMounted(() => {
    nextTick(() => {
      // ipSegments.value = props.value.split('.');
      if (!props.readonly) {
        // 非只读的时候，默认第一个输入框获取焦点
        const firstSegment = document.querySelector(`input[id=segment0]`) as HTMLInputElement;
        firstSegment.focus();
      }
    });
  });

  onUnmounted(() => {
    ipSegments.value = ['', '', '', ''];
  });
</script>
<style lang="less" scoped>
  .IP-input-wrap {
    width: 78px;
    :deep(.ant-input-number) {
      width: 78px;
      min-width: 78px;
      .ant-input-number-handler-wrap {
        display: none;
      }
    }
  }
</style>
