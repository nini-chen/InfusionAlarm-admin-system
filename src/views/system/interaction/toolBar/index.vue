<template>
  <div class="p-4 bg-white h-14 flex items-center justify-between">
    <!-- tabs -->
    <a-tabs v-model:activeKey="activeKey" class="!leading-10">
      <a-tab-pane :key="item.key" :tab="item.tab" v-for="item in tabList"></a-tab-pane>
    </a-tabs>
    <!-- button -->
    <a-button type="primary" @click="openModal" v-show="activeKey != '1'">
      <div class="flex justify-around items-center">
        <Icon icon="carbon:add" size="20"></Icon>
        <span> 添加 </span>
      </div>
    </a-button>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { Icon } from '/@/components/Icon';

  /*emits*/
  const activeKey = ref('1');
  const emit = defineEmits<{
    (e: 'tabChange', tab: string): void;
    (e: 'open'): void;
  }>();
  watch(
    () => activeKey.value,
    (n) => (emit('tabChange', n), console.log(n)),
  );
  const tabList = ref([
    { key: '1', tab: '护理级别配置' },
    { key: '2', tab: '安全防范配置' },
    { key: '3', tab: '饮食类别配置' },
    { key: '4', tab: '药物反应配置' },
    { key: '5', tab: '隔离类别配置' },
    { key: '6', tab: '医保类别配置' },
  ]);

  function openModal() {
    emit('open');
  }
</script>
