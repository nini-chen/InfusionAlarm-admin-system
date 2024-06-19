<template>
  <!-- 病房列表 -->
  <div class="flex justify-center items-center" v-append-to-dom="`SEARCH_AREA`">
    <!-- 选择病区 -->
    <PartitionSelect />
    <!-- 搜索患者 -->
    <InputSearch
      class="!ml-4 !w-220px"
      v-model:value.trim="keyword"
      allowClear
      maxLength="5"
      placeholder="请输入患者姓名"
      @search="searchKeyword"
      @input="
        (e) => {
          keyword = oninputDeal(e);
        }
      "
    />
  </div>
  <!-- 切换病床、病房、病床使用情况统计 -->
  <Navbar :statistics="bedCounts" />
  <template v-if="showRoomList">
    <template v-if="rooms.length > 0">
      <!-- 图标说明 -->
      <ul class="flex pt-4 mb-0">
        <li
          class="flex items-center mr-11"
          v-for="desc of descOptions"
          :key="desc.label"
          :data="desc"
        >
          <img
            alt="icon"
            :src="desc.value"
            :style="`background-color: ${desc.background};padding: 2px;border-radius: 4px;`"
          />
          <span class="text-black text-sm ml-1">{{ desc.label }}</span>
        </li>
      </ul>
      <!-- 床位卡片列表 -->
      <div class="bed-list flex flex-wrap gap-4 mt-4">
        <RoomItem
          v-for="item of rooms"
          :key="item.id"
          :data="item"
          @click="handleShowBedList"
          @scheduling="handleScheduling"
        />
      </div>
    </template>
    <div class="flex items-center h-full" v-else>
      <NoData />
    </div>
  </template>
  <!-- 某个病床的病床列表： 点击一个病房卡片进入 -->
  <template v-else>
    <Beds :currentRoom="currentRoom">
      <template #backButtonSlot>
        <Button type="primary" @click="handleBackToRoomList">返回【病房一览】</Button>
      </template>
    </Beds>
  </template>
</template>
<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { oninputDeal } from '/@/utils/formRender';
  import { InputSearch, Button } from 'ant-design-vue';
  import PartitionSelect from '/@/views/sys/partition/index.vue';

  import Beds from './Beds.vue';
  import RoomItem from './RoomItem/index.vue';
  import Navbar from '/@/views/patients/components/Navbar.vue';
  import NoData from '/@/views/patients/components/NoData.vue';

  import otherIcon from '/@/assets/images/male0.png';
  import manIcon from '/@/assets/images/male1.png';
  import womanIcon from '/@/assets/images/male2.png';
  import noBody from '/@/assets/images/no-body.png';

  import { RoomListRecord } from '/@/api/patients/model/roomModel';
  import { getRoomListApi } from '/@/api/patients/room';
  import { getBedCountsApi } from '/@/api/patients/bed';

  import { useUserStore } from '/@/store/modules/user';
  import { MqCallResRecord, MqOnlineResRecord, useMqttStore } from '/@/store/modules/mqtt';

  const userStore = useUserStore();
  const userMqtt = useMqttStore();
  const go = useGo();

  const descOptions = [
    {
      value: womanIcon,
      label: '女性患者',
      background: '#FFEAF2',
    },
    {
      value: manIcon,
      label: '男性患者',
      background: '#D2E0FC',
    },
    {
      value: noBody,
      label: '空闲',
      background: '#E7FFFD',
    },
    {
      value: otherIcon,
      label: '离线',
      background: '#E3E1E1',
    },
  ];

  const showRoomList = ref(true);
  const currentRoom = ref({} as RoomListRecord);
  const bedCounts = reactive({
    used: {
      label: '全部床位',
      count: 0,
    },
    all: {
      label: '已使用',
      count: 0,
    },
    empty: {
      label: '空闲中',
      count: 0,
    },
  });

  async function getBedCounts() {
    const partition_id = userStore.getCurrentPartition.id;
    const { allnum, usednum, freenum } = await getBedCountsApi({
      partition_id,
    });
    bedCounts.used.count = allnum || 0;
    bedCounts.all.count = usednum || 0;
    bedCounts.empty.count = freenum || 0;
  }

  const keyword = ref('');
  const rooms = ref<RoomListRecord[]>([]);

  // 点击病房卡片，进入查看当前病房下属的所有病床
  function handleShowBedList(record) {
    currentRoom.value = record;
    showRoomList.value = false;
  }

  function handleBackToRoomList() {
    showRoomList.value = true;
  }

  // 点击一个房间卡片铅笔小图标，跳去医护排版页面
  function handleScheduling() {
    go('/doctors/nurse');
  }
  /**
   * @description: 获取病房
   */
  async function getRooms() {
    const partition_id = userStore.getCurrentPartition.id;
    const { data } = await getRoomListApi({
      partition_id,
      keyword: keyword.value,
    });
    rooms.value = data;
  }

  /**
   *  设置页面中房间和床位数据的的状态（仅有2种特殊状态：卫生间报警、某个床位离线）
   **/
  // 1. 【订阅】业务状态事件通知 - 判断status是否等于6（即房间卫生间报警）
  function changeDeviceCallStatus(data: MqCallResRecord) {
    rooms.value.forEach((room) => {
      // console.log('_________++++++____', data.type === 'room', data.status == 1);
      // console.log('====', data.type === 'room', room.id == data.info_id);
      // 当病房事件
      if (data.type === 'room' && room.id == data.info_id && data.status > 1) {
        room.online_status = data.status;
        room.online_text = data.text;
      } else {
        // 同时多个卫生间报警的时候，取消掉一个报警，就跑这里，需要手动刷新页面
        getRooms();
      }
    });
  }

  // 2.【订阅】设备状态变化通知（病床分机）- 仅返回床位的上线下线的一种
  async function changeDeviceOnlineStatus(data: MqOnlineResRecord[]) {
    rooms.value.forEach((room) => {
      data.forEach((resRecord) => {
        // 判断mqtt这个病床状态是否属于当前病房里面的病床, 如果是, 则添加状态:
        const bedInx = room.bed.findIndex((bed) => bed.id == resRecord.bed_id);
        if (bedInx > -1) {
          //1. 病床状态
          room.bed[bedInx].sickbed_online_status = resRecord.status;
          /**
           * 2.设置病房状态
           * 既然此病房有设备上下线, 那病房呼叫状态也要改变, 页面中卡片的背景和提示语要变;
           * 病房设备由离线到上线, 呼叫状态要恢复设备离线前的那个历史设备呼叫状态
           **/
          if (resRecord.status == 0) {
            room.historyStatus = room.online_status;
            room.online_status = 0;
          } else {
            room.online_status = room.historyStatus || 1;
          }
        }
      });
    });
  }

  // 对mqtt返回值进行分类处理
  function dealRoomStatus(msg) {
    const { topic, data } = msg;
    switch (topic) {
      // 1. 呼叫状态改变
      case '/device/web/get/button/change':
        changeDeviceCallStatus(data);
        break;
      // 2. 上线下线状态改变
      case '/device/web/get/status/change':
        changeDeviceOnlineStatus(data);
        break;
      default:
        break;
    }
  }

  function searchKeyword(searchValue: string) {
    keyword.value = searchValue;
    sessionStorage.setItem('patientName', searchValue);
    go(`/patients/bed`);
  }

  // 监听select病区的值是否改变；切换了病区，床位列表要重新请求
  watch(
    () => userStore?.getCurrentPartition,
    (newVal) => {
      if (!newVal) return;
      getRooms();
      getBedCounts();
    },
    {
      deep: true,
    },
  );

  // 监听房间和房间床位的mqtt返回值, 进行数据处理
  watch(
    () => userMqtt?.msg,
    (data) => {
      data && dealRoomStatus(data);
    },
    {
      deep: true,
    },
  );

  onMounted(() => {
    getRooms();
    getBedCounts();
  });
</script>
