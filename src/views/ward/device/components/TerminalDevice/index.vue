<template>
  <div class="w-full">
    <div class="absolute top-0 right-25px">
      <div class="flex justify-center items-center">
        <div>
          <Select
            v-model:value="searchInfo.device_type"
            placeholder="选择设备类型"
            class="public-select-bg"
            style="width: 240px"
            :options="deviceClassify"
            @change="changeDeviceType"
            allowClear
          />
        </div>
        <div class="m-2">
          <InputSearch
            placeholder="设备名称/MAC/IP地址"
            v-model:value="searchInfo.keyword"
            :maxlength="20"
            @input="(e) => (searchInfo.keyword = oninputSpaceDeal(e))"
            @search="handleSearch"
            allowClear
          />
        </div>
        <div class="m-2">
          <Button type="primary" @click="handleSearch" class="mr-2"> 查询 </Button>
          <Button @click="handleReset" class="mr-10"> 重置 </Button>
          <Button type="primary" @click="handleSearch">
            <SyncOutlined />
            刷新
          </Button>
        </div>
      </div>
    </div>
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
      <template #device_online_status="{ record }">
        <span :style="{ color: record.device_online_status == 0 ? '#FF4D4F' : '#00C219' }">
          {{ record.device_online_status == 0 ? '离线' : '在线' }}
        </span>
      </template>
      <template #bindtime="{ record }">
        <span>
          {{
            record.bindtime ? moment(parseInt(record.bindtime * 1000)).format('YYYY-MM-DD') : '--'
          }}
        </span>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '详情',
              onClick: handleDetails.bind(null, record),
            },
            {
              label: '管理',
              onClick: handleUpgrade.bind(null, record),
              ifShow: record.device_online_status != 0 && ['switch'].includes(record.device_type), // 'icu_guard' 智能门禁目前不做管理功能
            },
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
              ifShow: record.device_online_status != 0 && record.device_type != 'passageway',
            },
            {
              label: '解绑',
              onClick: handleUnbind.bind(null, record),
              color: 'error',
              ifShow: record.device_type != 'passageway',
            },
            {
              label: '删除',
              onClick: handleDelete.bind(null, record),
              color: 'error',
              ifShow: record.can_delete == true,
            },
          ]"
        />
      </template>
    </BasicTable>

    <!-- 弹窗：详情 -->
    <DetailModal :width="600" :canFullscreen="false" @register="registerDetailModal" />

    <!-- 弹窗：编辑 -->
    <EditModal :width="620" @register="registerEditModal" @success="handleReset" />

    <!-- 弹窗：音频转发器管理 -->
    <ManageModal
      :width="1000"
      @register="registerManageModal"
      @success="handleReset"
      :active="activeIndex"
    />

    <Modal
      v-model:visible="confirmModalVisible"
      width="446"
      centered
      :title="confirmModalVisible && isUnbind ? '解绑' : '删除'"
      okText="确认"
      @ok="handleConfirm"
      @cancel="isUnbind = false"
    >
      <div class="px-24px py-30px">
        <div class="flex justify-center items-center">
          <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
          <span class="flex-1 rounded-sm ml-2 p-8px text-base leading-initial">
            {{
              currentDevice.device_type == 'switch'
                ? '音频转发器解绑后，该设备下的病床分机和洗手间报警按钮将会被一并移除，请谨慎操作'
                : isUnbind
                ? `确认解绑 ${currentDevice.device_name} 设备？`
                : `确认删除 ${currentDevice.device_name} 设备？`
            }}
          </span>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, unref, onMounted, nextTick, computed } from 'vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { listColumns, deviceClassify } from '../table.data';
  import { Icon } from '/@/components/Icon';
  import {
    getDeviceList,
    unbindDevice,
    deleteDeviceByIdApi,
    getSwitch,
  } from '/@/api/ward/equipment';
  import { SyncOutlined } from '@ant-design/icons-vue';
  import { Button, Select, InputSearch, Modal } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import moment from 'moment';

  import ManageModal from './ManageModal.vue';
  import EditModal from './EditModal.vue';
  import DetailModal from './DetailModal.vue';

  import { oninputSpaceDeal } from '/@/utils/formRender';

  const userStore = useUserStore();
  const activeIndex = ref('1');
  let selectPartition: any = ref(userStore.getAllPartitions);

  const props = defineProps({
    inpatientQuery: Object,
  });

  // 当前正在操作的设备
  const currentDevice = ref<any>({});
  // 删除、解绑操作的确认框 显示/隐藏
  const confirmModalVisible = ref<boolean>(false);
  // 当前是解绑操作
  const isUnbind = ref<boolean>(false);

  // 超级管理员可看所有病区的人员，此值为空即可筛选全部数据；普通人员只能看所在病区的人员， 此值设置当前病区的id值；
  const partition = computed(() => userStore?.getCurrentPartition);
  // table-搜索参数
  const searchInfo = reactive({
    device_type: '',
    keyword: '',
    is_binding: 1,
    partition_id: partition.value.id,
  });

  const [registerEditModal, { openModal: openEditModal }] = useModal();
  const [registerManageModal, { openModal: openManageModal }] = useModal();
  // const [registerSmartGuardManageModal, { openModal: openSmartGuardManageModal }] = useModal();
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  const { createMessage } = useMessage();

  const [registerTable, { reload, scrollTo }] = useTable({
    fetchSetting: {
      pageField: 'page_index',
      sizeField: 'page_size',
      listField: 'data',
      totalField: 'data_sum',
    },
    api: getDeviceList,
    beforeFetch(info) {
      return {
        ...info,
        ...searchInfo,
      };
    },
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
    onChange() {
      scrollTo('top');
    },
  });

  // 搜索栏-重置
  function handleReset() {
    searchInfo.keyword = '';
    searchInfo.device_type = '';
    reload();
  }

  // 搜索栏-选择设备类型
  function changeDeviceType(val) {
    searchInfo.device_type = val;
  }

  // 搜索栏-点击搜索按钮
  function handleSearch() {
    reload();
  }

  // 操作-详情
  function handleDetails(record) {
    openDetailModal(true, {
      record,
      isUpdate: true,
    });
  }

  // 操作-编辑
  function handleEdit(record) {
    if (record.device_type != 'passageway') {
      openEditModal(true, { record });
    }
  }

  // 操作-管理
  function handleUpgrade(record) {
    // if (record.device_type === 'icu_guard') {
    //   openSmartGuardManageModal(true, { record });
    //   return;
    // }
    openManageModal(true, { data: record });
  }

  // 操作-确定删除、确定解绑操作
  async function handleConfirm() {
    if (isUnbind.value) {
      await confirmUnbind();
    } else {
      await confirmDeleteDevice();
    }
    confirmModalVisible.value = false;
    isUnbind.value = false;
  }

  // 确定解绑
  async function confirmUnbind() {
    const params = {
      id: currentDevice.value.id,
    };
    const isICUDevice = partition.value.is_icu == 1;
    const res = await unbindDevice(params, isICUDevice);
    if (res) {
      createMessage.success('操作成功');
      handleReset();
    }
  }

  // 确定删除设备
  async function confirmDeleteDevice() {
    const params = {
      id: currentDevice.value.id,
    };
    const res = await deleteDeviceByIdApi(params);
    if (res) {
      createMessage.success('操作成功');
      handleReset();
    }
  }

  // 操作-删除事件
  function handleDelete(record) {
    currentDevice.value = record;
    isUnbind.value = false;
    confirmModalVisible.value = true;
  }

  // 操作-解绑事件
  function handleUnbind(record) {
    currentDevice.value = record;
    isUnbind.value = true;
    confirmModalVisible.value = true;
  }

  onMounted(async () => {
    if (selectPartition.value.some((v) => v.id === 0)) {
      return false;
    }
    let list = [{ id: 0, partition_name: '全部' }, ...userStore.getAllPartitions];
    selectPartition.value = list.map((v) => {
      let obj = {
        label: v.partition_name,
        value: v.id,
      };
      return obj;
    });

    const { deviceId, active } = unref(props.inpatientQuery);

    console.log(deviceId, deviceId);
    if (deviceId) {
      let params = {
        id: deviceId,
      };
      let record = await getSwitch(params);
      console.log(record);
      nextTick(() => {
        let data = record;
        if (active) {
          activeIndex.value = String(active);
        }
        openManageModal(true, { data });
      });
    }
  });
</script>
