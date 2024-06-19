<template>
  <PageWrapper>
    <ToolBar
      @webParamsChange="webParamsChange"
      @terParamsChange="terParamsChange"
      @search="opSearch"
      @terSearch="terSearch"
      @keyChange="keyChange"
      @exportExcel="exportExcel"
      :disableTer="terminalExport"
      :disableWeb="webExport"
    />
    <Web
      ref="webRef"
      @disableExport="disableExportWeb"
      :exportRefresh="exportWebLogRefresh"
      v-if="key == '1'"
    />
    <Terminal
      ref="terRef"
      :exportRefresh="exportTerLogRefresh"
      @disableExport="disableExportTer"
      v-else
    />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, computed, provide, watch } from 'vue';
  import ToolBar from './toolBar/index.vue';
  import Web from './list/web.vue';
  import Terminal from './list/terminal.vue';
  import { PageWrapper } from '/@/components/Page';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  const icuFlag = ref(false);
  provide('icuFlag', icuFlag);

  watch(
    () => currentPartition.value,
    (n) => {
      icuFlag.value = n.is_icu === 1;
    },
    { immediate: true, deep: true },
  );

  const webRef = ref<any>(null);
  function opSearch(payload) {
    webRef.value.params.start_time = payload.dateValue[0];
    webRef.value.params.end_time = payload.dateValue[1];
    webRef.value.params.type = payload.operateTypeValue;

    webRef.value.getweblogListApi(true);
  }
  function webParamsChange(options) {
    console.log(options);
    webRef.value.params.type = options.operateTypeValue;
  }

  const terRef = ref<any>(null);
  function terSearch(payload) {
    terRef.value.params.start_time = payload.dateValue[0];
    terRef.value.params.end_time = payload.dateValue[1];
    terRef.value.params.type = payload.terminalTypeValue;
    terRef.value.params.device_type = payload.terLogTypeValue;

    terRef.value.getlogListApi(true);
  }
  function terParamsChange(options) {
    console.log(options);
    terRef.value.params.type = options.terLogTypeValue;
  }

  const key = ref('1');
  function keyChange(payload) {
    key.value = payload;
  }

  let exportWebLogRefresh = ref(0);
  let exportTerLogRefresh = ref(0);
  function exportExcel(payload) {
    if (payload == '1') exportWebLogRefresh.value = Math.random();
    if (payload == '2') exportTerLogRefresh.value = Math.random();
  }

  let terminalExport = ref(false);
  function disableExportTer(bool) {
    terminalExport.value = bool;
  }
  let webExport = ref(false);
  function disableExportWeb(bool) {
    webExport.value = bool;
  }
</script>
