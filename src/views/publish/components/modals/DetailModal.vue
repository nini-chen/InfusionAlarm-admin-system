<template>
  <BasicModal v-bind="$attrs" @register="registerModal" @ok="close" @cancel="close">
    <a-form
      ref="formRef"
      :model="formState"
      name="basic"
      :label-col="{ span: 2 }"
      autocomplete="off"
    >
      <a-form-item label="名称" name="version">
        <span style="font-szie: 1rem; font-weight: 600">{{ formState.name }}</span>
      </a-form-item>
      <a-form-item label="类型" name="device_type">
        <span style="font-szie: 1rem; font-weight: 600">{{
          deviceType[formState.device_type] || '其它类型'
        }}</span>
      </a-form-item>
      <a-form-item label="详情">
        <BasicTable
          :maxHeight="240"
          sticky
          :dataSource="dataSource"
          :columns="detailColumns"
          :pagination="false"
        >
          <template #update="{ record }">
            <span :class="updateStatus(record).value">{{ updateStatus(record).label }}</span>
          </template>
          <template #op="{ record }">
            <a-button danger type="text" v-if="record.upgrade_status >= 4" @click="redo(record)"
              >重试</a-button
            >
          </template>
        </BasicTable>
      </a-form-item>
    </a-form>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, onBeforeUnmount } from 'vue';
  import { BasicTable } from '/@/components/Table';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { deviceType, columns as detailColumns } from './data';
  import { getDeviceOne, reUpgrade } from '/@/api/deploy/area';

  const formState = ref<any>({});
  const dataSource = ref<any>([]);

  let timer: any = null;
  onBeforeUnmount(() => {
    clearInterval(timer);
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    let { record } = data;
    formState.value.name = record.name;
    formState.value.device_type = record.device_type;
    formState.value.version_id = record.id;

    getDeviceOneApi(record);
    timer = setInterval(() => getDeviceOneApi(record), 10000);

    setModalProps({
      title: '升级任务详情',
    });
  });

  async function getDeviceOneApi(record) {
    let params = {
      with_status: 1,
      id: record.id,
    };
    let res = await getDeviceOne(params);
    dataSource.value = res.range;
  }

  /*升级状态*/
  function updateStatus(record) {
    let status = record.upgrade_status;
    if (status == 1) return { label: '待升级', value: 'wait' };
    else if (status == 2) return { label: '升级中', value: 'updating' };
    else if (status == 3) return { label: '升级成功', value: 'success' };
    else if (status == 4) return { label: '升级失败', value: 'fail' };
    else return { label: '升级失败(设备离线)', value: 'outline' }; //5
  }

  /*重新升级*/
  async function redo(record) {
    let params = {
      id: formState.value.version_id,
      device_id: record.device_id,
    };
    let res = await reUpgrade(params);
    if (res) {
      record.upgrade_status = 1; //置为待升级状态
      updateStatus(record);
    }
  }

  function close() {
    clearInterval(timer);
    closeModal();
  }
</script>

<style scoped>
  .wait {
    color: #333;
  }
  .updating {
    color: #387af6;
  }
  .fail {
    color: #ed6f6f;
  }
  .success {
    color: #59a059;
  }
  .outline {
    color: gray;
  }
</style>
