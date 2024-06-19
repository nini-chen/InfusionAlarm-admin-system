<template>
  <div class="ward-manage-page overflow-hidden">
    <!-- 医院管理-ICU病区-病房管理页面 -->
    <div class="flex w-full bg-white justify-between items-center py-2 px-4">
      <div class="text-base"> 病区名称：{{ partitionDetail?.partition_name || '--' }} </div>
      <div class="flex w-2/5 items-center">
        <div class="min-w-90px w-1/4 flex justify-items-center flex-col items-center">
          <div class="text-sm">病房数量</div>
          <div class="text-base text-blue-600">{{ partitionDetail?.hospital_room_num || 0 }}</div>
        </div>
        <div class="min-w-90px w-1/4 flex justify-items-center flex-col items-center">
          <div class="text-sm">探视病床分机数量</div>
          <div class="text-base text-blue-600">{{
            partitionDetail?.medical_icu_sickbed_num || 0
          }}</div>
        </div>
        <div class="min-w-90px w-1/4 flex justify-items-center flex-col items-center">
          <div class="text-sm">探视医护主机数量</div>
          <div class="text-base text-blue-600">{{
            partitionDetail?.medical_icu_host_num || 0
          }}</div>
        </div>
        <div class="min-w-90px w-1/4 flex justify-items-center flex-col items-center">
          <div class="text-sm">探视家属分机数量</div>
          <div class="text-base text-blue-600">{{
            partitionDetail?.medical_icu_family_num || 0
          }}</div>
        </div>
      </div>
      <div>
        <Button type="primary" @click="refresh">
          <template #icon>
            <SyncOutlined />
          </template>
          刷新
        </Button>
        <!-- ICU病区-添加普通病房（即病床分机绑定的那种病房）-->
        <Button type="primary" class="ml-4" @click="handleAddRoom">
          <template #icon><PlusOutlined /></template>
          病房
        </Button>
        <!-- ICU病区-添加探视房（即家属分机绑定的那种病房）-->
        <Button type="primary" class="ml-4" :disabled="hasFamilyRoom" @click="handleAddFamilyRoom">
          <template #icon><PlusOutlined /></template>
          探视房
        </Button>
      </div>
    </div>

    <!-- 树形表格 -->
    <TreeTable
      :dataSource="treeData"
      @handleDetail="handleDetail"
      @handleEdit="handleEdit"
      @handleDelete="handleDelete"
      @handleUnbind="handleUnbind"
    />

    <!-- 弹窗：ICU病区-添加/编辑 普通病房 -->
    <DealRoomModal :width="600" @register="registerDealRoomModal" @success="refresh" />

    <!-- 设备编辑 弹窗：调用医院管理模块-设备管理-终端设备编辑的弹窗 -->
    <EditDeviceModal :width="620" @register="registerDeviceEditModal" @success="refresh" />

    <!-- 弹窗：ICU病区-添加/编辑 探视病房 -->
    <DealFamilyRoomModal :width="600" @register="registerDealFamilyRoomModal" @success="refresh" />

    <!-- 弹窗：详情 -->
    <DetailModal :width="620" :canFullscreen="false" @register="detailModal" />

    <!-- 弹窗：解绑、删除 -->
    <Modal
      v-model:visible="deleteVisible"
      width="446"
      centered
      :title="deleteVisible && isBatchOperate ? '解绑' : '删除'"
      okText="确认"
      @ok="confirmDelete"
      @cancel="isBatchOperate = false"
    >
      <div class="px-24px py-30px">
        <div class="flex justify-center items-center">
          <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
          <span class="flex-1 rounded-sm ml-2 p-8px text-base leading-initial">
            {{
              isBatchOperate
                ? `确认解绑 ${currentAccount.device_name} 设备？`
                : `确认删除内容及其数据？`
            }}
          </span>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { Button, Modal } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { SyncOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { useUserStore } from '/@/store/modules/user';

  import { getPartitionOne, getICUWardTreeApi, deleteRoom } from '/@/api/ward/patient';
  import { PartitionDetail } from '/@/api/ward/model/patientModel';
  import { unbindDevice } from '/@/api/ward/equipment';
  import { getDeviceClassifyName } from '/@/views/ward/device/components/table.data';

  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { eachTree } from '/@/utils/helper/treeHelper';

  import DealRoomModal from './DealRoomModal.vue';
  import DealFamilyRoomModal from './DealFamilyRoomModal.vue';
  import DetailModal from './DetailModal.vue';
  import TreeTable from './TreeTable/index.vue';
  import EditDeviceModal from '/@/views/ward/device/components/TerminalDevice/EditModal.vue';

  const userStore = useUserStore();
  // 当前用户所处的病区的id
  const partition = computed(() => userStore.getCurrentPartition);
  // const partitionOptions = computed(() => userStore.getAllPartitions);

  // 单个操作-当前操作的账号
  const currentAccount = ref<any>({});
  // 删除、批量删除提示框
  const deleteVisible = ref<boolean>(false);
  // 批量操作-判断
  const isBatchOperate = ref<boolean>(false);

  const [registerDealRoomModal, { openModal: openDealRoomModal }] = useModal();
  const [registerDealFamilyRoomModal, { openModal: openDealFamilyRoomModal }] = useModal();
  const [registerDeviceEditModal, { openModal: openEditDeviceModal }] = useModal();
  const [detailModal, { openModal: openDetailModal }] = useModal();
  const { createMessage } = useMessage();

  const spinning = ref(false);
  const treeData = ref([]);
  const partitionDetail = ref<Nullable<PartitionDetail>>(null);

  // 已创建的普通房间号
  const createdGeneralRoomNumber = ref<number[]>([]);
  // 存在探视房间号（注意：每个探视病区仅能添加一个探视病房）
  const hasFamilyRoom = ref<boolean>(false);

  // 获取当前ICU病区的详情信息
  async function getICUWardDetail() {
    const res = await getPartitionOne({
      id: partition.value?.id,
    });
    res && (partitionDetail.value = res);
  }

  // 弹窗操作成功后，初始化页面数据
  function refresh() {
    getICUWardDetail();
    getTreeList();
  }

  async function getTreeList() {
    if (!partition.value?.id) return;
    spinning.value = true;
    treeData.value = [];
    let res = await getICUWardTreeApi({
      partition_id: partition.value?.id,
    });

    hasFamilyRoom.value = false;
    // ant-design tree 要求每个节点都需要要唯一id；
    eachTree(res, (node) => {
      if (node.children?.length === 0) {
        delete node.children;
      }
      switch (node?.datatype) {
        case 'room':
          node.pid = 'room0';
          node.new_id = `room${node.id}`;
          if (node.is_kin == 1) {
            // 存在探视病房，留个标记，用于禁用新增探视病房按钮
            hasFamilyRoom.value = true;
          } else if (node.is_kin == 0) {
            // 存下已创建的普通病房号，用于新建病房弹窗里面筛选掉已创建的病房
            createdGeneralRoomNumber.value.push(node.order_num);
          }
          break;
        case 'bed':
          node.hospital_room_name = node.hospital_bed_name;
          node.new_id = `bed${node.id}`;
          node.pid = `room${node.hospital_room_id}`;
          break;
        case 'device':
          node.hospital_room_name = getDeviceClassifyName(node.device_type);
          node.new_id = `bed${node.id}`;
          node.pid = `room${node.room_id}`;
          break;
        default:
          break;
      }
    });

    treeData.value = res;
    spinning.value = false;
  }

  // 新增普通病房
  function handleAddRoom() {
    openDealRoomModal(true, {
      isEdit: false,
      partition: partition.value,
      createdGeneralRoomNumber, // 已经使用掉的病房号
    });
  }

  // 新增探视病房
  function handleAddFamilyRoom() {
    if (hasFamilyRoom.value) {
      createMessage.warning(
        '每个探视病区，仅能添加一个探视病房！本病区已有探视病房，不能继续添加！',
      );
      return;
    }
    openDealFamilyRoomModal(true, {
      isEdit: false,
    });
  }

  // 确定删除、批量删除操作
  async function confirmDelete() {
    const type = isBatchOperate.value ? 'unbind' : 'delete';
    if (type == 'unbind') {
      let params = {
        id: currentAccount.value.id,
      };
      let res = await unbindDevice(params, true);
      if (res) {
        refresh();
        createMessage.warning('解绑成功');
      }
    } else {
      let params = {
        room_id: currentAccount.value.id,
      };
      let res = await deleteRoom(params);
      if (res) {
        refresh();
        createMessage.warning('删除成功');
      }
    }
    deleteVisible.value = false;
    isBatchOperate.value = false;
  }

  // table操作-查看详情
  function handleDetail(record) {
    openDetailModal(true, {
      record,
      isUpdate: true,
    });
  }

  // table操作-编辑
  function handleEdit(record) {
    if (record.is_kin == 1) {
      // 编辑 探视病房
      openDealFamilyRoomModal(true, {
        isEdit: true,
        record,
        partition: partition.value,
      });
      return;
    } else if (record.is_kin == 0){
      // 编辑 普通病房
      openDealRoomModal(true, {
        isEdit: true,
        record,
        partition: partition.value,
        createdGeneralRoomNumber, // 已经使用掉的病房号
      });
      return;
    }

    // 编辑 设备
    openEditDeviceModal(true, { record: {
      partition_name: partition.value.partition_name,
      ...record
    } });
  }

  // 查看tree节点是否储存设备
  function hasDevice(tree, keyName: string, KeyValue: any) {
    if (tree.children) {
      for (let i = 0; i < tree.children.length; i++) {
        if (tree.children[i][keyName] === KeyValue) {
          return true;
        } else if (hasDevice(tree.children[i], keyName, KeyValue)) {
          return true;
        }
      }
    }
    return false;
  }

  // table操作-删除
  function handleDelete(record) {
    console.log(record);
    if (hasDevice(record, 'datatype', 'device')) {
      createMessage.warning('病房中仍有设备绑定，请先移除所有绑定设备');
      return;
    }
    currentAccount.value = record;
    deleteVisible.value = true;
  }

  // table操作-解绑
  function handleUnbind(record) {
    currentAccount.value = record;
    isBatchOperate.value = true;
    deleteVisible.value = true;
  }

  onMounted(() => {
    getTreeList();
    getICUWardDetail();
  });
</script>
