<template>
  <PageWrapper>
    <!-- 选择病区 -->
    <div class="flex justify-center items-center" v-append-to-dom="`SEARCH_AREA`">
      <PartitionSelect />
    </div>
    <ToolBar @search="search" @redo="redo" />
    <List ref="listRef" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import ToolBar from './toolBar/index.vue';
  import List from './list/index.vue';
  import PartitionSelect from '/@/views/sys/partition/index.vue';
  import { PageWrapper } from '/@/components/Page';

  const listRef = ref<any>(null);

  function paramsFormat(opt) {
    listRef.value.params.start_time = opt.dateValue[0];
    listRef.value.params.end_time = opt.dateValue[1];
    listRef.value.params.agent_status = opt.statusValue;
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
</script>
