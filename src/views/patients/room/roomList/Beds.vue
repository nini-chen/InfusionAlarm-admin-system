<template>
  <div class="select-bar w-full flex justify-between mt-2 mb-4">
    <!-- 护理级别统计 -->
    <Nursing :statistics="statistics" />
    <!-- 返回【病房一览】按钮插槽 -->
    <slot name="backButtonSlot"></slot>
  </div>

  <template v-if="list.length > 0">
    <!-- 床位卡片列表 -->
    <div class="bed-list flex flex-wrap gap-4 mt-4">
      <BedItem
        v-for="item of list"
        :key="item.bed_id"
        :statistics="statistics"
        :configOptions="configOptions"
        :data="item"
        @success="refreshData"
      />
    </div>
  </template>
  <template v-else>
    <NoData />
  </template>
</template>
<script lang="ts" setup>
  import { ref, onMounted, reactive, watch } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { oninputDeal } from '/@/utils/formRender';
  import { InputSearch } from 'ant-design-vue';
  import PartitionSelect from '/@/views/sys/partition/index.vue';

  import NoData from '/@/views/patients/components/NoData.vue';

  import BedItem from '/@/views/patients/bed/bedList/BedItem/index.vue';
  import Nursing from '/@/views/patients/bed/bedList/Nursing.vue';

  import { useUserStore } from '/@/store/modules/user';
  import { useMqttStore } from '/@/store/modules/mqtt';
  import { BedListRecord, CareRecord } from '/@/api/patients/model/bedModel';
  import {
    getCareListApi,
    getBedListApi,
    infoConfigSelectApi,
    getBedCountsApi,
  } from '/@/api/patients/bed';
  import { getPersonListApi } from '/@/api/doctors/personnel';
  import { RoomListRecord } from '/@/api/patients/model/roomModel';

  const props = defineProps({
    currentRoom: {
      type: Object,
      default: () => {
        return {} as RoomListRecord
      },
    },
  });

  const userStore = useUserStore();
  const userMqtt = useMqttStore();
  const { createMessage } = useMessage();

  const page = reactive({
    index: 1,
    size: 10,
    total: 0,
  });
  const list = ref<BedListRecord[]>([]);
  const statistics = ref<CareRecord[]>([]);
  const bedStatus = ref<number>(0);
  const keyword = ref('');
  const configOptions = reactive({
    config5: [],
    config3: [],
    config4: [],
    config2: [],
    doctor: [],
    nurse: [],
  });

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

  /**
   * @description: 请求一页数据
   */
  async function getBeds() {
    const { data, data_sum, page_index, page_size } = await getBedListApi({
      partition_id: userStore.getCurrentPartition?.id,
      keyword: keyword.value,
      is_use: bedStatus.value,
      room_id: props.currentRoom.id,
      // page_index: page.index,
      // page_size: page.size,
    });
    list.value = data;
    page.index = page_index;
    page.size = page_size;
    page.total = data_sum;
  }

  // 刷新列表和床位统计
  function refreshData() {
    getBeds();
    getBedCounts();
    getCareLevels();
  }

  // 获取护理级别数据
  async function getCareLevels() {
    const res = await getCareListApi({
      partition_id: userStore.getCurrentPartition?.id,
      keyword: keyword.value,
    });
    if (!res) return;
    statistics.value = res?.map((x) => {
      const { id, name: label } = x;
      return {
        ...x,
        value: String(id),
        label,
      };
    });
  }

  /**
   * @description: 获取配置
   * @param {Object} params
   */
  async function getConfigOptions(params: { type: number; page: number }) {
    const res = await infoConfigSelectApi(params);
    if (!res) return [];
    return res?.map((x) => {
      const { id, name: label } = x;
      return {
        ...x,
        value: String(id),
        label,
      };
    });
  }

  /**
   * @description: 获取医生和护士
   * @param {Object} params
   */
  async function getCarePersonOptions(params: { staff_type: number; partition_id: number }) {
    const res = await getPersonListApi(params);
    if (!res) return [];
    return res?.data.map((x) => {
      const { id, staff_name: label } = x;
      return {
        ...x,
        value: String(id),
        label,
      };
    });
  }

  async function getConfigs() {
    // 隔离类别
    configOptions.config5 = await getConfigOptions({
      type: 5,
      page: 0,
    });
    // 饮食类别
    configOptions.config3 = await getConfigOptions({
      type: 3,
      page: 0,
    });
    // 药物反应
    configOptions.config4 = await getConfigOptions({
      type: 4,
      page: 0,
    });
    // 安全防范公共操作
    configOptions.config2 = await getConfigOptions({
      type: 2,
      page: 0,
    });
    // 医生
    configOptions.doctor = await getCarePersonOptions({
      staff_type: 1,
      partition_id: userStore.getCurrentPartition?.id,
    });
    // 护士
    configOptions.nurse = await getCarePersonOptions({
      staff_type: 2,
      partition_id: userStore.getCurrentPartition?.id,
    });
  }

  /**
   * @description: 选择病床状态进行筛选
   * @param {number} status 0：全部   1:使用中    2:空闲
   */
  function handleFilterBeds(status: number) {
    bedStatus.value = status;
    getBeds();
  }

  /**
   *  改变页面中床位数据的的状态
   *  @description: 呼叫状态: http请求 api/partition/bedPreviewList 接口获取online_status字段; mqtt的get/button/change和get/status/change返回status字段;
   * */

  // 1. 【订阅】业务状态事件通知 - 返回床位各种呼叫状态的一种
  function changeBedCallStatus(data: MqCallResRecord) {
    list.value.forEach((bed) => {
      if (data.type === 'bed' && bed.bed_id == data.info_id) {
        bed.online_status = data.status;
      }
    });
  }

  // 2.【订阅】设备状态变化通知（病床分机）- 仅返回床位的上线下线的一种
  function changeBedOnlineStatus(data: MqOnlineResRecord[]) {
    console.log('上下线', data);
    list.value.forEach((bed) => {
      data.forEach((resRecord) => {
        if (bed.bed_id == resRecord.bed_id) {
          //  注意: 呼叫状态由离线状态恢复到线状态, 页面要显示离线前的那个在线状态; 此处加个historyStatus字段用于暂时记录
          if (resRecord.status == 0) {
            bed.historyStatus = bed.online_status;
            bed.online_status = 0;
          } else {
            bed.online_status = bed.historyStatus || 1;
          }
        }
      });
    });
  }

  // 对mqtt返回值进行分类处理
  function dealBedStatus(msg) {
    const { topic, data } = msg;
    switch (topic) {
      // 1. 呼叫状态改变
      case '/device/web/get/button/change':
        changeBedCallStatus(data);
        break;
      // 2. 上线下线状态改变
      case '/device/web/get/status/change':
        changeBedOnlineStatus(data);
        break;
      default:
        break;
    }
  }

  function init() {
    getBedCounts();
    getCareLevels();
    getConfigs();
    getBeds();
  }

  // 监听select病区的值是否改变；切换了病区，床位列表要重新请求
  watch(
    () => userStore?.getCurrentPartition,
    (newVal) => {
      if (!newVal) return;
      init();
    },
    {
      deep: true,
    },
  );

  // 监听床位mqtt返回值, 进行数据处理
  watch(
    () => userMqtt?.msg,
    (data) => {
      data && dealBedStatus(data);
    },
    {
      deep: true,
    },
  );

  // 搜索病人名称
  function searchKeyword(searchValue: string) {
    keyword.value = searchValue;
    getBeds();
  }

  // 病房页-搜索病人名称输入框-点击搜索，跳到当前病床页面进行搜索
  function checkComeFromRoomPage() {
    const patientName = sessionStorage.getItem('patientName');
    if (patientName) {
      keyword.value = patientName;
      sessionStorage.removeItem('patientName');
    }
  }

  onMounted(() => {
    checkComeFromRoomPage();
    init();
  });
</script>
