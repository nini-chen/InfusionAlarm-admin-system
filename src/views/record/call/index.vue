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
  import { ref, watch, provide } from 'vue';
  import ToolBar from './toolBar/index.vue';
  import List from './list/index.vue';
  import PartitionSelect from '/@/views/sys/partition/index.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();

  const listRef = ref<any>(null);

  let icuFlag = ref(false);
  provide('icuFlag', icuFlag);

  watch(
    () => userStore.getCurrentPartition,
    (val) => {
      icuFlag.value = val.is_icu === 1;
    },
    { immediate: true, deep: true },
  );

  function paramsFormat(opt) {
    console.log(opt, 'opt');

    if (!icuFlag.value) {
      listRef.value.params.start_time = opt.dateValue[0];
      listRef.value.params.end_time = opt.dateValue[1];
      listRef.value.params.type = opt.callTypeValue;
      listRef.value.params.do_value = opt.operateTypeValue;
      listRef.value.params.from_mac = opt.callFromValue;
    } else {
      listRef.value.icuparams.start_time = opt.dateValue[0];
      listRef.value.icuparams.end_time = opt.dateValue[1];
      listRef.value.icuparams.call_type = opt.callTypeValue;
      listRef.value.icuparams.handle_type = opt.operateTypeValue;
      listRef.value.icuparams.caller_name = opt.callFromValue;
    }
  }

  function search(opt) {
    paramsFormat(opt);
    listRef.value.requestList(true);
  }

  async function redo(opt) {
    paramsFormat(opt);

    listRef.value.ifredo = true;
    listRef.value.requestList(true);
    listRef.value.ifredo = false;
  }
</script>
