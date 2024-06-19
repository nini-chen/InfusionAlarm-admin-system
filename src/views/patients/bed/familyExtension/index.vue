<template>
  <!-- 家属分机页面 -->
  <div class="flex justify-center items-center" v-append-to-dom="`SEARCH_AREA`">
    <!-- 选择病区 -->
    <PartitionSelect />
  </div>
  <!-- 导航栏 + 状态统计 -->
  <Navbar :statistics="statistics" />
  <!--  家属分机卡片列表 -->
  <template v-if="list.length > 0">
    <div class="bed-list flex flex-wrap gap-4 mt-4">
      <ExtensionItem
        v-for="item of list"
        :key="item.id"
        :data="item"
        :partition="userStore.getCurrentPartition"
        @refresh="handleRefresh"
      />
    </div>
  </template>
  <template v-else>
    <NoData />
  </template>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, watch } from 'vue';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import PartitionSelect from '/@/views/sys/partition/index.vue';
  import Navbar from '/@/views/patients/components/Navbar.vue';
  import NoData from '/@/views/patients/components/NoData.vue';
  import ExtensionItem from './ExtensionItem/index.vue';

  import { ICUFamilyExtListRecord } from '/@/api/patients/model/familyExtensionModel';

  import { getPublicExtStatisticsApi } from '/@/api/patients/bedExtension';
  import { getFamilyExtListApi } from '/@/api/patients/familyExtension';
  import { useMqttStore } from '/@/store/modules/mqtt';

  // const { createMessage } = useMessage();
  const userStore = useUserStore();
  const userMqtt = useMqttStore();

  const page = reactive({
    index: 1,
    size: 10,
    total: 0,
  });
  const list = ref<ICUFamilyExtListRecord[]>([]);

  const statistics = reactive({
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
    const { allnum, usednum, freenum } = await getPublicExtStatisticsApi({
      partition_id,
    });
    statistics.used.count = allnum || 0;
    statistics.all.count = usednum || 0;
    statistics.empty.count = freenum || 0;
  }

  function handleRefresh() {
    getList();
    getBedCounts();
  }

  /**
   * @description: 请求一页数据
   */
  async function getList() {
    list.value = [];
    const { data, data_sum, page_index, page_size } = await getFamilyExtListApi({
      partition_id: userStore.getCurrentPartition?.id,
    });
    list.value = data;
    page.index = page_index;
    page.size = page_size;
    page.total = data_sum;
  }

  // 监听select病区的值是否改变；切换了病区，页面数据刷新
  watch(
    () => userStore?.getCurrentPartition,
    (newVal) => {
      if (!newVal) return;
      handleRefresh();
    },
    {
      deep: true,
    },
  );

  // 1. 【订阅】业务状态事件通知
  function changeDeviceCallStatus(data) {
    list.value.forEach((device) => {
      if (data.type === 'device' && device.id == data.info_id) {
        device.online_status = data.status;
      }
    });
  }

  // 2.【订阅】设备状态变化通知 - 仅返回床位的上线下线的一种
  async function changeDeviceOnlineStatus(data) {
    list.value.forEach((device: ICUFamilyExtListRecord & { historyStatus: number }) => {
      data.forEach((resRecord) => {
        if (device.id == resRecord.bed_id) {
          //  注意: 呼叫状态由离线状态恢复到线状态, 页面要显示离线前的那个在线状态; 此处加个historyStatus字段用于暂时记录
          if (resRecord.status == 0) {
            device.historyStatus = device.online_status;
            device.online_status = 0;
          } else {
            device.online_status = device.historyStatus || 1;
          }
        }
      });
    });
  }

  // 监听mqtt返回值, 进行数据处理
  watch(
    () => userMqtt?.msg,
    (data) => {
      // 对mqtt返回值进行分类处理
      if (!data) return;
      const { topic, data: msg } = data;
      switch (topic) {
        // 1. 呼叫状态改变
        case '/device/web/get/button/change':
          changeDeviceCallStatus(msg);
          break;
        // 2. 上线下线状态改变
        case '/device/web/get/status/change':
          changeDeviceOnlineStatus(msg);
          break;
        default:
          break;
      }
    },
    {
      deep: true,
    },
  );

  onMounted(() => {
    handleRefresh();
  });
</script>
