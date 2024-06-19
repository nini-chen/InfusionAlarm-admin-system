<template>
  <div>
    <div class="flex w-full justify-between items-center">
      <div class="text-base font-medium"> 病区信息管理 </div>
      <div>
        <Button type="primary" @click="handleEditPatient">
          <template #icon><EditOutlined /></template>
          编辑
        </Button>
      </div>
    </div>

    <div class="content w-full bg-white mt-4">
      <div class="top p-4">
        <div class="flex w-full font-color">
          <div class="w-1/3 py-8px">
            <span>病区名称：</span>
            <span class="text-black">{{ partitionInfo.partition_name || '--' }}</span>
          </div>
          <div class="w-1/3 py-8px">
            <span>病区编号：</span>
            <span class="text-black">{{ partitionInfo.partition_code || '--' }}</span>
          </div>
        </div>
        <div class="flex w-full font-color">
          <div class="w-1/3 py-8px">
            <span>病区唯一编码：</span>
            <span class="text-black">{{ partitionInfo.area_code || '--' }}</span>
          </div>
          <div class="w-1/3 py-8px">
            <span>病床号排序方式：</span>
            <span class="text-black">{{
              partitionInfo.partition_order == 1 ? '房内顺序' : '区内顺序'
            }}</span>
          </div>
        </div>
        <div class="flex w-full font-color pb-4">
          <div class="w-full py-8px">
            <span>病区简介：</span>
            <span class="text-black">{{ partitionInfo.remarks || '--' }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="flex w-full justify-between items-center mt-4">
      <div class="text-base font-medium"> 病区联系信息管理 </div>
      <div>
        <Button type="primary" @click="addContactInfo">
          <template #icon><PlusOutlined /></template>
          添加
        </Button>
      </div>
    </div>

    <div class="w-full mt-4">
      <BasicTable @register="registerTable">
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                label: '编辑',
                onClick: handleDetails.bind(null, record),
              },
              {
                label: '删除',
                onClick: handleDelete.bind(null, record),
                color: 'error',
              },
            ]"
          />
        </template>
      </BasicTable>
    </div>

    <!--  弹窗：编辑病区(调用的是公用弹窗：医院管理-院区管理的新增、编辑弹窗) -->
    <ManageAreaModal :width="600" @register="registerManageAreaModal" @success="handleSuccess" />

    <!-- 弹窗：新增/编辑 病区联系信息 -->
    <DealContactInfoModal :width="600" @register="registerContactInfoModal" @success="refresh" />

    <Modal v-model:visible="deleteVisible" centered width="446" title="删除" okText="确认" @ok="confirmDelete">
      <div class="px-24px py-30px">
        <div class="flex justify-center items-center">
          <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
          <span class="flex-1 rounded-sm ml-2 p-8px text-base leading-initial">
            确认删除内容及其数据？
          </span>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { Button, Modal } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { EditOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listColumns } from './table.data';
  import { useModal } from '/@/components/Modal';
  import ManageAreaModal from '/@/views/ward/hospital/components/ManageAreaModal.vue';
  import DealContactInfoModal from './DealContactInfoModal.vue';
  import { getPartitionOne, getPartitionInfoList, delPartitionInfo } from '/@/api/ward/patient';
  import { PartitionDetail } from '/@/api/ward/model/patientModel';

  const props = defineProps({
    partitionID: { type: Number, default: null },
  });

  // 单个操作-当前操作的账号
  const currentAccount = ref({} as PartitionDetail);

  const deleteVisible = ref<boolean>(false);

  const partitionInfo = ref({} as PartitionDetail);

  onMounted(() => {
    getPartitionInfo();
  });

  const [registerManageAreaModal, { openModal: openAreaManagementModal }] = useModal();
  const [registerContactInfoModal, { openModal: openContactModal }] = useModal();
  const [registerTable, { reload, redoHeight, scrollTo }] = useTable({
    columns: listColumns,
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
    api: getPartitionInfoList,
    searchInfo: {
      partition_id: props.partitionID,
    },
    fetchSetting: {
      pageField: 'page_index',
      sizeField: 'page_size',
      listField: 'data',
      totalField: 'data_sum',
    },
    afterFetch() {
      redoHeight();
    },
    onChange() {
      scrollTo('top');
    },
  });

  // 获取 病区信息管理数据
  async function getPartitionInfo() {
    try {
      const res = await getPartitionOne({
        id: props.partitionID,
      });
      partitionInfo.value = res || {};
    } catch (error) {
      console.error(error);
    }
  }

  // 刷新病区联系信息管理table
  function refresh() {
    reload();
  }

  // 编辑病区联系信息
  function handleEditPatient() {
    openAreaManagementModal(true, {
      record: partitionInfo.value,
      isEdit: true,
    });
  }

  // 新增病区联系信息
  function addContactInfo() {
    openContactModal(true, {});
  }

  function handleDetails(record) {
    let data = record;
    openContactModal(true, { data });
  }

  // 确定删除、批量删除操作
  async function confirmDelete() {
    let params = {
      id: currentAccount.value.id,
    };
    let res = await delPartitionInfo(params);
    if (res) {
      refresh();
    }
    deleteVisible.value = false;
  }

  function handleDelete(record) {
    currentAccount.value = record;
    deleteVisible.value = true;
  }

  function handleSuccess() {
    getPartitionInfo();
  }
</script>

<style lang="less" scoped>
  .border-bottom {
    border-bottom: 1px solid #e9e9e9;
  }

  .font-color {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.45);
  }
</style>
