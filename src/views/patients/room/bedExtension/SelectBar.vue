<template>
  <div class="select-bar w-full flex justify-between mt-2 mb-4">
    <div class="statistics flex">
      <div class="flex items-center mr-6" v-for="(item, key) in statistics" :key="key">
        <CareIcon :color="setCareLevelColor(item.color)" :label="item.name.slice(0, 1)" />
        <span class="text-black font-bold text-sm ml-1">{{ item.name }}</span>
        <span class="text-center text-sm" :style="`color: ${setCareLevelColor(item.color)};`"
          >({{ item.nums }})</span
        >
      </div>
    </div>
    <div>
      <Select
        class="w-160px select-bed public-select-bg"
        v-model:value="bedVal"
        @change="handleChange"
        :options="options"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Select } from 'ant-design-vue';
  import { setCareLevelColor } from './careEnum';
  import CareIcon from './BedItem/CareIcon.vue';
  import { CareRecord } from '/@/api/patients/model/bedModel';
  defineProps({
    statistics: {
      type: Array as PropType<CareRecord[]>,
      default: () => [],
    },
  });
  const emit = defineEmits(['change']);
  const options = ref([
    {
      value: 0,
      label: '全部病床',
    },
    {
      value: 1,
      label: '使用中病床',
    },
    {
      value: 2,
      label: '空闲中病床',
    },
  ]);

  const bedVal = ref<number>(0);
  function handleChange(value: string) {
    emit('change', value);
  }
</script>
