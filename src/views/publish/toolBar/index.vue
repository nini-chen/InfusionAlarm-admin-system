<template>
  <div class="p-4 bg-white h-14 flex items-center justify-between">
    <!-- search -->
    <div>
      <a-input-search
        class="!w-55 !mr-8"
        v-model:value="searchValue"
        placeholder="请输入设备名称/ 呼叫码"
        allow-clear
        :maxlength="20"
      />
      <a-select
        class="!mr-4 w-50 public-select-bg"
        v-model:value="type"
        placeholder="请选择接收器IP"
        :options="deviceTypeSelect"
        allow-clear
      />
      <a-select
        class="!mr-4 w-50 public-select-bg"
        v-model:value="isNumber"
        placeholder="请选择是否编号"
        :options="serialNumberSelect"
        allow-clear
      />
      <a-button class="mr-4" type="primary" @click="onSearch">查询</a-button>
      <a-button type="primary" @click="redo">重置</a-button>
    </div>
    <!-- button -->
    <div>
      <a-button class="mr-4" type="primary" @click="openHostModal">
        <span>快速匹配模式 </span>
      </a-button>
      <a-button type="success" @click="openModal">
        <span> 状态展示页面链接 </span>
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { deviceTypeSelect, serialNumberSelect } from '../data';
  import { getAppStatus } from '/@/api/deploy/area';
  import { isNumber } from '/@/utils/is';

  /*emits*/
  const emit = defineEmits<{
    (e: 'openUploadModal'): void;
    (e: 'openHostModal', value: number): void;
    (e: 'search', searchValue: any): void;
  }>();

  /*props*/
  interface Props {
    refresh: number;
  }
  const props = withDefaults(defineProps<Props>(), {
    refresh: 0,
  });

  watch(
    () => props.refresh,
    () => {
      getAppStatusApi();
    },
  );

  const searchValue = ref('');
  const isNumber = ref('');
  const type = ref('');
  function onSearch() {
    emit('search', { keywords: searchValue.value, type: type.value });
  }

  function redo() {
    searchValue.value = '';
    type.value = '';
    emit('search', { keywords: '', type: '' });
  }

  function openModal() {
    emit('openUploadModal');
  }
  function openHostModal() {
    emit('openHostModal', call_status.value);
  }

  let call_status = ref(0);
  async function getAppStatusApi() {
    const data = await getAppStatus();
    call_status.value = data.call_status;
    console.log(data.call_status, 'xxxxx');
  }
  getAppStatusApi();

  defineExpose({
    searchValue,
    type,
    getAppStatusApi,
  });
</script>

<style scoped></style>
