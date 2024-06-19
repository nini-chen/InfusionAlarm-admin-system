<template>
  <div>
    <div class="flex justify-center items-center" v-append-to-dom="`SEARCH_AREA`">
      <!-- 选择病区 -->
      <PartitionSelect />
      <!-- 搜索医护 -->
      <InputSearch
        class="!ml-4 !w-220px"
        v-model:value.trim="keyword"
        allowClear
        maxLength="20"
        placeholder="请输入医护姓名"
        @search="searchKeyword"
        @input="
          (e) => {
            keyword = oninputDeal(e);
          }
        "
      />
    </div>
    <PageWrapper class="schedule-page">
      <!-- 护士排班/医生排班的Tabs、切换周、缩略/详细模式切换-->
      <Nav
        class="mb-4"
        @selectWeek="selectWeek"
        @changeModel="changeModel"
        @batchImport="batchImport"
      />
      <!-- 表格内容 -->
      <ScheduleTable
        ref="scheduleRef"
        v-if="searchInfo"
        :isICU="isICU"
        :isDetail="isDetail"
        :searchInfo="searchInfo"
        :typeOptions="scheduleTypeOptions"
        :areaOptions="roomManageOptions"
      />
    </PageWrapper>
    <BatchImportModal
      :width="650"
      :canFullscreen="false"
      :searchInfo="searchInfo"
      @register="registerBatchImportModal"
      @success="reflectTable"
    />
  </div>
</template>
<script lang="ts" setup>
  import { ref, reactive, watch, onMounted, computed } from 'vue';
  import { router } from '/@/router';
  import moment from 'moment';
  import { eachTree } from '/@/utils/helper/treeHelper';
  import { oninputDeal } from '/@/utils/formRender';

  import { InputSearch } from 'ant-design-vue';
  import PartitionSelect from '/@/views/sys/partition/index.vue';
  import { PageWrapper } from '/@/components/Page';
  import Nav from './components/Nav.vue';
  import ScheduleTable from './components/Table.vue';
  import BatchImportModal from './components/BatchImportModal.vue';
  import { useModal } from '/@/components/Modal';

  import { useUserStore } from '/@/store/modules/user';

  import { getScheduleTypesApi, getRoomMangeTreeApi } from '/@/api/doctors/schedule';
  import { ScheduleTypeRecord } from '/@/api/doctors/model/scheduleModel';

  const { currentRoute } = router;
  const userStore = useUserStore();
  const [registerBatchImportModal, { openModal: openBatchImportModal }] = useModal();

  /**此处单独写一个keyword给input框绑定, 而不是直接绑定searchInfo.keyword变量，是为了避免输入文字的时候就触发搜索，实现测试说的只有点击输入框的搜索图标或者回车键才进行搜索； */
  const keyword = ref('');
  const searchInfo = reactive({
    // 病区
    partition_id: userStore.getCurrentPartition.id,
    // 所属人群 1医疗人员   2护理人员
    scheduling_population: 2,
    startDate: moment().day(1).format('YYYY-MM-DD'),
    endDate: moment().day(7).format('YYYY-MM-DD'),
    keyword: '',
  });
  // 默认：详细显示
  const isDetail = ref<boolean>(true);
  const scheduleTypeOptions = ref<ScheduleTypeRecord[]>([]);
  const roomManageOptions = ref<RoomManageRecord[]>([]);

  const isICU = computed(() => userStore.getCurrentPartition.is_icu == 1);

  // 搜索医护名称
  function searchKeyword(searchValue: string) {
    searchInfo.keyword = searchValue;
    initPage();
  }

  // 顶部tabs栏-周选择器 change事件
  function selectWeek(dateRange: { startDate: string; endDate: string }) {
    const { startDate, endDate } = dateRange;
    searchInfo.startDate = startDate;
    searchInfo.endDate = endDate;
    initPage();
  }

  // 顶部tabs栏-table模式切换
  function changeModel(flag: boolean) {
    isDetail.value = flag;
  }
  const scheduleRef = ref();
  const reflectTable = () => {
    scheduleRef.value.reload();
  };

  // 表格编辑模式-排班类型下拉框 options配置
  async function getScheduleType() {
    scheduleTypeOptions.value = [];
    const res = await getScheduleTypesApi(
      {
        partition_id: userStore.getCurrentPartition.id,
        // 所属人群 1医疗人员   2护理人员
        schedulingtype_population: searchInfo.scheduling_population,
      },
      isICU.value,
    );
    if (res.data?.length > 0) {
      scheduleTypeOptions.value = res.data.map((typeItem) => {
        const { id: value, schedulingtype_name: label } = typeItem;
        return {
          value,
          label,
        };
      });
    }
  }

  // 表格编辑模式-管床范围下拉多选框 options配置
  async function getScheduleArea() {
    roomManageOptions.value = [];
    const data = await getRoomMangeTreeApi(
      {
        partition_id: userStore.getCurrentPartition.id,
      },
      isICU.value,
    );
    if (data?.length > 0) {
      eachTree(data, (node, parentNode) => {
        const hasParentNode = Object.keys(parentNode).length > 0;
        node.key = `${node.level}-${node.id}`;
        node.name = hasParentNode ? `${parentNode.name}-${node.name}` : node.name;
      });
      roomManageOptions.value = data;
    }
  }

  // 批量导入
  function batchImport() {
    openBatchImportModal(true);
  }

  function initPage() {
    getScheduleType();
    getScheduleArea();
  }

  // 监听select病区的值是否改变；切换了病区，页面要刷新
  watch(
    () => userStore?.getCurrentPartition,
    (newVal) => {
      if (!newVal) return;
      searchInfo.partition_id = newVal.id;
      initPage();
    },
    {
      // deep: true,
    },
  );

  // 监听当前路由，设置一下当前页面是医生排班还是医护排班
  watch(
    () => currentRoute,
    (newVal) => {
      if (!newVal) return;
      searchInfo.scheduling_population = newVal.value.name === 'DoctorsDoctor' ? 1 : 2;
    },
    {
      immediate: true,
    },
  );
  onMounted(() => {
    initPage();
  });
</script>
