<template>
  <div class="w-full">
    <div class="position">
      <div>
        <Select
          v-model:value="searchParams.device_type"
          placeholder="选择设备类型"
          class="public-select-bg"
          style="width: 240px"
          :options="options"
          @change="handleSelectChange"
          allowClear
        />
      </div>
      <div class="m-2">
        <InputSearch
          placeholder="设备名称/MAC/IP地址"
          v-model:value="searchParams.keyword"
          :maxlength="20"
          @input="(e) => (searchParams.keyword = oninputSpaceDeal(e))"
          @search="handleRefresh"
          allowClear
        />
      </div>
      <div class="m-2">
        <Button type="primary" @click="handleRefresh" class="mr-2"> 查询 </Button>
        <Button @click="resetList" class="mr-10"> 重置 </Button>
        <Button type="primary" @click="handleRefresh">
          <SyncOutlined />
          刷新
        </Button>
      </div>
    </div>
    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '绑定',
              ifShow: () => record.device_online_status != 0,
              onClick: handleBind.bind(null, record),
            },
            {
              label: '删除',
              onClick: handleDelete.bind(null, record),
              color: 'error',
              ifShow: () => record.device_online_status == 0 && record.can_delete,
            },
            {
              label: '--',
              ifShow: () => record.device_online_status == 0 && !record.can_delete,
            },
          ]"
        />
      </template>
      <template #device_online_status="{ record }">
        <span :style="{ color: record.device_online_status == 0 ? '#FF4D4F' : '#00C219' }">
          {{ record.device_online_status == 0 ? '离线' : '在线' }}
        </span>
      </template>
      <template #timestamp="{ record }">
        <span>
          {{
            record.timestamp ? moment(parseInt(record.timestamp * 1000)).format('YYYY-MM-DD') : '--'
          }}
        </span>
      </template>
    </BasicTable>
    <BindModal :width="620" @register="registerBindModal" @success="handleRefresh" />
  </div>
</template>
<script lang="ts" setup>
  import moment from 'moment';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { oninputSpaceDeal } from '/@/utils/formRender';

  import { reactive, computed, createVNode } from 'vue';
  import { Button, Select, InputSearch, Modal } from 'ant-design-vue';
  import { SyncOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import BindModal from './BindModal.vue';

  import { newListColumns, deviceClassify } from '../table.data';
  import { getDeviceList } from '/@/api/ward/equipment';
  import { deleteDeviceByIdApi } from '/@/api/ward/equipment';

  // 表格的筛选条件参数
  const searchParams = reactive({
    partition_id: 0,
    device_type: '',
    is_binding: 0,
    keyword: '',
  });
  let options = computed(() => {
    return deviceClassify.filter((v) => v.value != 'passageway');
  });

  const { createMessage } = useMessage();
  const [registerBindModal, { openModal: openBindModal }] = useModal();
  const [registerTable, { reload, scrollTo }] = useTable({
    fetchSetting: {
      pageField: 'page_index',
      sizeField: 'page_size',
      listField: 'data',
      totalField: 'data_sum',
    },
    beforeFetch(info) {
      return { ...info, ...searchParams };
    },
    api: getDeviceList,
    columns: newListColumns,
    useSearchForm: false,
    bordered: true,
    clickToRowSelect: false,
    showIndexColumn: true,
    rowKey: 'id',
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 220,
      slots: { customRender: 'action' },
    },
    onChange() {
      scrollTo('top');
    },
  });

  // 设备类型筛选
  function handleSelectChange(val) {
    searchParams.keyword = '';
    searchParams.device_type = val;
  }

  // 重置
  function resetList() {
    searchParams.keyword = '';
    searchParams.device_type = '';
    reload();
  }

  // 操作-绑定
  function handleBind(record) {
    openBindModal(true, {
      record,
    });
  }

  // 操作-删除-确定删除设备
  async function confirmDeleteDevice(deviceId) {
    const params = {
      id: deviceId,
    };
    const res = await deleteDeviceByIdApi(params);
    if (res) {
      createMessage.success('操作成功');
      handleRefresh();
    }
  }

  // 操作-删除
  function handleDelete(record) {
    Modal.confirm({
      class: 'custom-modal-confirm',
      title: '删除',
      content: `确认删除 ${record.device_name} 设备？`,
      okText: '确认',
      centered: true,
      maskClosable: true,
      closable: true,
      icon: () => createVNode(ExclamationCircleFilled, { style: 'color:#FF4F4F;' }),
      onOk() {
        confirmDeleteDevice(record.id);
      },
    });
  }

  function handleRefresh() {
    reload();
  }
</script>

<style lang="less" scoped>
  .position {
    position: absolute;
    top: 0;
    right: 25px;
    display: flex;
    align-items: center;
  }
</style>
