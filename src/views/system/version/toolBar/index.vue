<template>
  <div class="p-4 bg-white h-14 flex items-center justify-between">
    <!-- search -->
    <div>
      <a-select
        class="!mr-4 w-50 public-select-bg"
        v-model:value="type"
        placeholder="请选择设备类型"
        :options="deviceTypeSelect"
        allow-clear
      />
      <a-input-search
        class="!w-55 !mr-8"
        v-model:value="searchValue"
        placeholder="文件名称/上传人/备注"
        allow-clear
        :maxlength="20"
      />
      <a-button class="mr-4" type="primary" @click="onSearch">查询</a-button>
      <a-button type="primary" @click="redo">重置</a-button>
    </div>
    <!-- button -->
    <div>
      <a-button class="mr-4" type="primary" @click="openHostModal">
        <span>{{ call_status == 0 ? '开启主机挂断' : '屏蔽主机挂断' }} </span>
      </a-button>
      <a-button type="primary" @click="openModal">
        <span> 上传升级文件 </span>
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { deviceTypeSelect } from '../data';
  import { getAppStatus } from '/@/api/system/version';

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
