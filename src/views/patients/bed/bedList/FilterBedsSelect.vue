<template>
    <div>
      <Select
        class="w-160px select-bed public-select-bg"
        v-model:value="bedVal"
        @change="handleChange"
        :options="options"
      />
    </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Select } from 'ant-design-vue';
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
