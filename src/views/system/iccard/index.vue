<template>
  <PageWrapper>
    <!-- 选择病区 -->
    <div class="flex justify-center items-center" v-append-to-dom="`SEARCH_AREA`">
      <!-- <PartitionSelect /> -->
    </div>
    <ToolBar ref="toolRef" @search="search" @redo="redo" @change="changeStatus" />
    <List ref="listRef" @disable-emit="disableEmit" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import ToolBar from './toolBar/index.vue';
  import List from './list/index.vue';
  import { PageWrapper } from '/@/components/Page';

  const listRef = ref<any>(null);
  const toolRef = ref<any>(null);

  function paramsFormat(opt) {
    listRef.value.params.keyword = opt.keyword;
  }

  function search(opt) {
    paramsFormat(opt);

    listRef.value.getList(true);
  }

  async function redo(opt) {
    paramsFormat(opt);

    listRef.value.ifredo = true;
    await listRef.value.getList(true);
    listRef.value.ifredo = false;
  }

  function changeStatus(status: number) {
    listRef.value.duetoCard({ status, mul: true });
  }

  function disableEmit(n) {
    toolRef.value.disabled = n === 0;
  }
</script>
