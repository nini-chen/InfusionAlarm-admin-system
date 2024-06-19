<template>
  <div>
    <div class="w-full mt-4">
      <div class="addButton">
        <Button type="primary" @click="addGroup">
          <template #icon><PlusOutlined /></template>
          添加
        </Button>
      </div>
      <BasicTable :pagination="pagination" @register="registerTable">
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                label: '详情',
                onClick: handleDetails.bind(null, record),
              },
              {
                label: '编辑',
                onClick: handleManage.bind(null, record),
              },
              {
                label: '删除',
                onClick: handleDelete.bind(null, record),
              },
            ]"
          />
        </template>
      </BasicTable>
    </div>

    <groupModal :width="800" @register="registerAuthModal" @success="handleSuccess" />
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { Button } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction, BasicColumn } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { getDeviceGroupList } from '/@/api/ward/patient';
  import groupModal from './groupModal.vue';

  const pagination = ref<any>(false);
  const lists = ref([]);
  const loaddingShow = ref(false);

  const props = defineProps({
    partitionID: { type: Number, default: null },
  });

  const totle = ref({
    page_index: 1,
    page_size: 10,
    partition_id: props.partitionID,
  });

  const groupListColumns: BasicColumn[] = [
    {
      title: '分组名称',
      dataIndex: 'group_name',
    },

    {
      title: '控制范围',
      dataIndex: 'device_list_name',
      customRender: ({ record }) => {
        return record.device_list_name ? record.device_list_name : '--';
      },
    },

    {
      title: '备注',
      dataIndex: 'remarks',
    },
  ];

  const [registerAuthModal, { openModal: openCpModal }] = useModal();
  const [registerTable, { setLoading }] = useTable({
    dataSource: lists,
    columns: groupListColumns,
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
    onChange(pagination) {
      totle.value.page_index = pagination.current;
      getList();
    },
  });

  onMounted(() => {
    getList();
  });

  async function getList() {
    let params = {
      page_index: totle.value.page_index,
      page_size: totle.value.page_size,
      partition_id: totle.value.partition_id,
    };

    setLoading(true);
    let res = await getDeviceGroupList(params);

    const { data, data_sum, page_index, page_size } = res;
    lists.value = data;

    pagination.value = {
      showSizeChanger: false,
      showQuickJumper: false,
      current: totle.value.page_index,
      total: data_sum,
      pageSize: page_size,
    };
    setLoading(false);
  }

  function handleDetails() {}
  function handleManage() {}
  function handleDelete() {}
  function handleSuccess() {
    getList();
  }
  function addGroup() {
    loaddingShow.value = true;
    openCpModal(true, {});
  }
</script>

<style lang="less" scoped>
  .addButton {
    position: absolute;
    top: 25px;
    right: 25px;
  }

  .border-bottom {
    border-bottom: 1px solid #e9e9e9;
  }

  .font-color {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }
</style>
