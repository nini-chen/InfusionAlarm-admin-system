<template>
  <div class="mt-4">
    <div class="flex w-full justify-between items-center mb-2">
      <div class="text-base font-medium"> {{ title }} </div>
      <div>
        <Button type="primary" @click="refresh">
          <template #icon><SyncOutlined /></template>
          刷新
        </Button>
        <Button type="primary" class="ml-4" @click="handleAddArea">
          <template #icon><PlusOutlined /></template>
          添加分区
        </Button>
      </div>
    </div>

    <BasicTable @register="registerTable">
      <template #action="{ record }">
        <TableAction
          :actions="[
            // {
            //   label: '详情',
            //   onClick: handleDetail.bind(null, record),
            // },
            {
              label: '编辑',
              onClick: handleEditArea.bind(null, record),
            },
            {
              label: '管理',
              onClick: handleManage.bind(null, record),
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

    <!-- 添加分区 / 编辑分区 -->
    <ManageAreaModal :width="620" @register="registerManageAreaModal" @success="refresh" />
    <!-- 分区管理--接收器 -->
    <ReceptorManageModal :width="620" @register="receptorManageModal" @success="refresh" />

    <!-- 病区详情 -->
    <!-- <AreaDetailModal :width="620" :canFullscreen="false" @register="detailModal" /> -->

    <!-- 删除病区 -->
    <Modal
      v-model:visible="deleteVisible"
      centered
      width="446"
      title="删除"
      okText="确认"
      @ok="confirmDelete"
    >
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
  import { ref, createVNode } from 'vue';
  import { Button, Modal } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { SyncOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listColumns } from '../data.ts';
  import { getFacilityListApi, deleteFacilityApi } from '/@/api/ward/facility.ts';
  import { useMessage } from '/@/hooks/web/useMessage';
  import ManageAreaModal from './ManageAreaModal.vue';
  import ReceptorManageModal from './ReceptorManageModal.vue';
  import { useModal } from '/@/components/Modal';
  import { useUserStore } from '/@/store/modules/user';
  // import AreaDetailModal from './AreaDetailModal.vue';

  const userStore = useUserStore();
  const { createMessage } = useMessage();

  // 当前操作的院区
  const currentRecord = ref<any>({});
  // 删除、批量删除提示框
  const deleteVisible = ref<boolean>(false);

  //  新增或编辑病区
  const [registerManageAreaModal, { openModal: openAreaManagementModal }] = useModal();
  // 分区管理--接收器
  const [receptorManageModal, { openModal: openReceptorManageModal }] = useModal();

  // const [detailModal, { openModal: openDetailModal }] = useModal();
  // 注册表格组件
  const [registerTable, { reload, scrollTo }] = useTable({
    columns: listColumns,
    useSearchForm: false,
    bordered: true,
    clickToRowSelect: false,
    showIndexColumn: false,
    rowKey: 'id',
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 220,
      slots: { customRender: 'action' },
    },
    api: getFacilityListApi,
    afterFetch(result) {
      savePartitionsToCache(result);
    },
    fetchSetting: {
      pageField: 'page_index',
      sizeField: 'page_size',
      listField: 'data',
      totalField: 'data_sum',
    },
    onChange() {
      scrollTo('top');
    },
  });

  //刷新
  function refresh() {
    reload();
  }

  // // 病区列表-操作：详情 按钮
  // function handleDetail(record) {
  //   openDetailModal(true, {
  //     record,
  //   });
  // }

  // 病区列表-操作：新增 按钮
  function handleAddArea() {
    openAreaManagementModal(true, {
      isEdit: false,
    });
  }

  // 病区列表-操作：编辑 按钮
  function handleEditArea(record) {
    openAreaManagementModal(true, {
      record,
      isEdit: true,
    });
  }

  // 分区列表-操作：管理 按钮
  function handleManage(record) {
    console.log('操作：管理--', record);
    openReceptorManageModal(true, {
      record,
      isEdit: true,
    });
    // userStore.setCurrentPartition(record);
  }

  // 确定删除
  async function confirmDelete() {
    let params = {
      id: currentRecord.value.id,
    };
    let res = await deleteFacilityApi(params);
    if (res) {
      reload();
    }
    deleteVisible.value = false;
  }

  function handleDelete(record) {
    // if (record.device_num > 0) {
    //   createMessage.destroy();
    //   createMessage.warning('病区中仍有设备绑定，请先移除所有绑定设备');
    //   return;
    // }
    // currentRecord.value = record;
    // deleteVisible.value = true;
    Modal.confirm({
      class: 'custom-modal-confirm',
      title: '删除',
      content: `确认删除 ${record.area_name} 分区？ 删除后，该分区所有设备信息将会丢失`,
      okText: '确认',
      centered: true,
      maskClosable: true,
      closable: true,
      icon: () => createVNode(ExclamationCircleFilled, { style: 'color:#FF4F4F;' }),
      onOk() {
        confirmDeleteDevice(record.id);
      },
    });
    // 操作-删除-确定删除分区
    async function confirmDeleteDevice(deviceId) {
      console.log('确定删除分区', deviceId);
      // const params = {
      //   id: deviceId,
      // };
      // const res = await deleteDeviceByIdApi(params);
      // if (res) {
      //   createMessage.success('操作成功');
      //   handleRefresh();
      // }
    }
  }

  // 将获取到的病区数据更新到缓存
  function savePartitionsToCache(list) {
    let partitions = list.map((v) => {
      return { id: v.id, partition_name: v.partition_name };
    });
    userStore.setAllPartitions(partitions);
  }
</script>
