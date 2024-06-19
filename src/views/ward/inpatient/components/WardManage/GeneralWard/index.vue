<template>
  <div class="ward-manage-page overflow-hidden">
    <!-- 医院管理-普通病区-病房管理页面 -->
    <div class="flex w-full bg-white justify-between items-center py-2 px-4">
      <div class="text-base"> 病区名称：{{ partitionName }} </div>
      <div class="flex w-2/5 items-center">
        <div class="min-w-90px w-1/4 flex justify-items-center flex-col items-center">
          <div class="text-sm">病房数量</div>
          <div class="text-base text-blue-600">{{ info.ward }}</div>
        </div>
        <div class="min-w-90px w-1/4 flex justify-items-center flex-col items-center">
          <div class="text-sm">病床数量</div>
          <div class="text-base text-blue-600">{{ info.bed }}</div>
        </div>
        <div class="min-w-90px w-1/4 flex justify-items-center flex-col items-center">
          <div class="text-sm">医护主机数量</div>
          <div class="text-base text-blue-600">{{ info.host }}</div>
        </div>
        <div class="min-w-90px w-1/4 flex justify-items-center flex-col items-center">
          <div class="text-sm">终端数量</div>
          <div class="text-base text-blue-600">{{ info.device }}</div>
        </div>
      </div>
      <div>
        <Button type="primary" @click="refresh">
          <template #icon>
            <SyncOutlined />
          </template>
          刷新
        </Button>
        <Button type="primary" class="ml-4" @click="addWard">
          <template #icon><PlusOutlined /> </template>
          添加
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

    <!-- 弹窗：普通病区-添加病房 -->
    <AddRoomModal
      :width="600"
      @register="registerAddRoomModal"
      @success="handleSuccess"
      v-model:selected="selected"
    />

    <!-- 弹窗：编辑门口机 -->
    <EditDoorwayModal :width="600" @register="registerAuthModal2" @success="refresh" />

    <!-- 弹窗：编辑 -->
    <EditModal :width="600" @register="registerAuthModal3" @success="refresh" />

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
  import { ref, computed, watch, onMounted, reactive, createVNode } from 'vue';
  import { Button, Modal } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { SyncOutlined, PlusOutlined, ExclamationCircleFilled } from '@ant-design/icons-vue';
  import { useUserStore } from '/@/store/modules/user';

  import { getPartitionOne, getRoomTree, deleteRoom } from '/@/api/ward/patient';
  import { unbindDevice } from '/@/api/ward/equipment';

  import { useModal } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useGo } from '/@/hooks/web/usePage';
  import { getDeviceClassifyName } from '/@/views/ward/device/components/table.data';

  import AddRoomModal from './AddRoomModal.vue';

  import EditDoorwayModal from './EditDoorwayModal.vue';
  import EditModal from './EditModal.vue';
  import DetailModal from './DetailModal.vue';
  import TreeTable from './TreeTable/index.vue';

  const userStore = useUserStore();
  // 当前用户所处的病区的id
  const partitionId = computed(() => userStore.getCurrentPartition?.id);
  const partitionOptions = computed(() => userStore.getAllPartitions);

  // 单个操作-当前操作的账号
  const currentAccount = ref<any>({});
  // 删除、批量删除提示框
  const deleteVisible = ref<boolean>(false);
  // 批量操作-判断
  const isBatchOperate = ref<boolean>(false);

  const [registerAddRoomModal, { openModal: openAddRoomModal }] = useModal();
  const [registerAuthModal2, { openModal: openCpModal2 }] = useModal();
  const [registerAuthModal3, { openModal: openCpModal3 }] = useModal();
  const [detailModal, { openModal: openDetailModal }] = useModal();
  const { createMessage } = useMessage();
  const go = useGo();

  let partitionName = ref('');
  let treeData = ref([]);
  let spinning = ref(false);

  //已选的房间号
  const selected: any = ref([]);

  const info = reactive({
    ward: 0,
    bed: 0,
    device: 0,
    host: 0,
  });

  onMounted(() => {
    getTreeList();
    getWardNumber();
  });

  watch(
    partitionId,
    (val) => {
      if (!val) return;
      partitionName.value = partitionOptions.value.filter(
        (v) => v.id == partitionId.value,
      )[0].partition_name;
    },
    {
      deep: true,
      immediate: true,
    },
  );

  defineProps({
    partitionID: { type: Number, default: null },
  });

  // 确定删除、批量删除操作
  async function confirmDelete() {
    const type = isBatchOperate.value ? 'unbind' : 'delete';
    if (type == 'unbind') {
      let params = {
        id: currentAccount.value.id,
      };
      let res = await unbindDevice(params, false);
      if (res) {
        refresh();
      }
    } else {
      let params = {
        room_id: currentAccount.value.id,
      };
      let res = await deleteRoom(params);
      if (res) {
        refresh();
      }
    }
    deleteVisible.value = false;
    isBatchOperate.value = false;
  }

  // 弹窗操作成功后，初始化页面数据
  function refresh() {
    getWardNumber();
    getTreeList();
  }

  async function getWardNumber() {
    let params = {
      id: partitionId.value,
    };
    let res = await getPartitionOne(params);
    console.log(res);
    if (res) {
      let { hospital_room_num, device_num, medical_bed_num, medical_host_num } = res;
      info.ward = hospital_room_num;
      info.bed = medical_bed_num;
      info.device = device_num;
      info.host = medical_host_num;
    }
  }

  function handleSuccess() {
    getWardNumber();
    getTreeList();
  }

  async function getTreeList() {
    if (!partitionId.value) return;
    spinning.value = true;
    treeData.value = [];
    let params = {
      partition_id: partitionId.value,
    };
    let res = await getRoomTree(params);
    let list = flatten(res);
    selected.value = list.filter((v) => v.datatype == 'room').map((s) => s.order_num);

    let listData = treeDataTranslate(list);

    treeData.value = listData;
    spinning.value = false;
  }

  function flatten(array) {
    let deviceList = ['guard', 'doorway', 'sos'];
    let arr = JSON.parse(JSON.stringify(array));
    let result = [];
    for (let item of arr) {
      var res = JSON.parse(JSON.stringify(item)); // 先克隆一份数据作为第一层级的填充

      //层级关系 固定三种层级，房 >=room 床 || 'guard', 'doorway', 'sos' 床 >= bed 另外的设备  设备>=devive

      res.child_len = (res.children && res.children.length) || 0;
      delete res['children'];
      //床
      if (res?.datatype == 'bed') {
        res['hospital_room_name'] = res.hospital_bed_name;
        res['new_id'] = 'bed' + res.id;
        res['pid'] = 'room' + res.hospital_room_id;
      }
      //绑定床的设备
      if (res?.datatype == 'device' && !deviceList.includes(res.device_type)) {
        res['hospital_room_name'] = getDeviceClassifyName(res.device_type);
        res['new_id'] = 'device' + res.id;
        res['pid'] = 'bed' + res.bed_id;
      }
      //绑定房的三个设备
      if (res?.datatype == 'device' && deviceList.includes(res.device_type)) {
        res['hospital_room_name'] = getDeviceClassifyName(res.device_type);
        res['new_id'] = 'bed' + res.id;
        res['pid'] = 'room' + res.room_id;
      }
      //房
      if (res?.datatype == 'room') {
        res['pid'] = 'room' + 0;
        res['new_id'] = 'room' + res.id;
      }

      result.push(res);
      if (item.children instanceof Array && item.children.length > 0) {
        // 如果当前children为数组并且长度大于0，才可进入flatArr()方法
        result = result.concat(flatten(item.children));
      }
    }
    return result;
  }

  //反转数组
  function treeDataTranslate(array) {
    let data = JSON.parse(JSON.stringify(array));
    let result = [];
    if (!Array.isArray(data)) {
      return result;
    }
    data.forEach((item) => {
      delete item.children;
    });
    let map = {};
    data.forEach((item) => {
      map[item.new_id] = item;
    });
    data.forEach((item) => {
      let parent = map[item.pid];
      if (parent) {
        (parent.children || (parent.children = [])).push(item);
      } else {
        result.push(item);
      }
    });

    return result;
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
    //病房门口机 、走廊屏、安卓版本病床分机
    if (['device', 'doorway', 'apk_sickbed'].includes(record?.device_type)) {
      openCpModal2(true, { data: record });
      return;
    }

    //病房
    if (record.datatype == 'room') {
      let data = Object.assign(record, { checkType: 'edit' });
      openCpModal3(true, { data });
      return;
    }

    // 普通病床分机
    if (record.datatype == 'device' && ['sickbed'].includes(record?.device_type)) {
      go('/ward/device');
      sessionStorage.setItem(
        'fromInpatientEdit',
        JSON.stringify({
          tabActive: 2,
          deviceId: record.id,
        }),
      );
      return;
    }

    //洗手间报警按钮
    if (record.datatype == 'device' && record?.device_type == 'sos') {
      //tabActive 设备管理   active 音频管理器的病床sos
      go('/ward/device');
      sessionStorage.setItem(
        'fromInpatientEdit',
        JSON.stringify({
          tabActive: 2,
          deviceId: record.id,
          active: 2,
        }),
      );
      return;
    }
  }

  // table操作-删除
  function handleDelete(record) {
    if (flatten([record]).some((v) => v.datatype == 'device')) {
      createMessage.warning('病房中仍有设备绑定，请先移除所有绑定设备');
      return false;
    }
    currentAccount.value = record;
    deleteVisible.value = true;
  }

  // table操作-解绑
  function handleUnbind(record) {
    // 1. 设备类型：洗手间报警按钮、病床分机(不是安卓版病床分机)，不给解绑
    const isCannotBind = ['sos', 'sickbed'].includes(record.device_type);
    if (isCannotBind) {
      Modal.confirm({
        class: 'custom-modal-confirm',
        title: '提示',
        content:
          '如需解绑该设备，请点击【编辑】按钮跳转该设备绑定的音频转发器管理页面进行【设备位置】删除该设备信息并确认保存',
        centered: true,
        maskClosable: true,
        closable: true,
        okButtonProps: {},
        cancelButtonProps: {},
        // okText: '确认',
        okCancel: false,
        icon: () => createVNode(ExclamationCircleFilled, { style: 'color:#FF4F4F;' }),
      });
      return;
    }
    // 2. 其他的，给它解绑
    currentAccount.value = record;
    isBatchOperate.value = true;
    deleteVisible.value = true;
  }

  // 普通病区-添加病房
  function addWard() {
    openAddRoomModal(true, {});
  }
</script>
