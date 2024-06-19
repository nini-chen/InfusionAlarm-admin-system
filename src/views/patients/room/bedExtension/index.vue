<template>
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
  <!-- 护理级别统计、不同状态的病房筛选 -->
  <SelectBar :statistics="statistics" @change="selectWard" />
  <template v-if="list.length > 0">
    <!-- 床位卡片列表 -->
    <div class="bed-list flex flex-wrap gap-4 mt-4">
      <BedItem
        v-for="item of list"
        :key="item.bed_id"
        :statistics="statistics"
        :data="item"
        @handleMenu="handleMenu"
        @click="handleBedCard"
      />
    </div>
    <!-- 空床-入院登记信息(新建) 和 编辑 -->
    <PatientInfoModal :width="948" @register="registerModal" @success="refreshData" />
    <!-- 使用中-转床 -->
    <ChangeBedModal
      :width="446"
      :canFullscreen="false"
      @register="registerChangeBedModal"
      @success="getBeds"
    />
    <!-- 使用中-添加医嘱信息 -->
    <AddAdviceModal :width="600" @register="registerAddAdviceModal" @success="getBeds" />
    <!-- 查看床位卡片的信息 -->
    <CheckModal :width="948" @register="registerCheckModal" />
    <!-- 患者出院 弹窗 -->
    <Modal
      v-model:visible="leaveVisible"
      width="446"
      title="患者出院"
      okText="确认"
      @ok="confirmLeave"
    >
      <div class="px-24px py-30px">
        <div class="flex justify-center items-center">
          <Icon icon="ant-design:exclamation-circle-filled" color="#FAAD14" size="23" />
          <span class="flex-1 rounded-sm ml-2 p-8px text-base leading-initial">
            <span>
              患者<i class="text-blue-500 not-italic"> {{ currentAccount.patient_name }} </i
              >确定离院吗？
            </span>
          </span>
        </div>
      </div>
    </Modal>
  </template>
  <template v-else>
    <NoData />
  </template>
</template>
<script lang="ts" setup>
  import { ref, onMounted, reactive, watch } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { oninputDeal } from '/@/utils/formRender';
  import { InputSearch, Modal } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import PartitionSelect from '/@/views/sys/partition/index.vue';

  import { useModal } from '/@/components/Modal';
  import Navbar from '/@/views/patients/components/Navbar.vue';
  import NoData from '/@/views/patients/components/NoData.vue';
  import BedItem from './BedItem/index.vue';
  import SelectBar from './SelectBar.vue';
  import PatientInfoModal from './PatientInfoModal.vue';
  import ChangeBedModal from './ChangeBedModal.vue';
  import AddAdviceModal from './AddAdviceModal.vue';
  import CheckModal from './CheckModal/index.vue';

  import { MangeMenu } from './careEnum';
  import { useUserStore } from '/@/store/modules/user';
  import { MqCallResRecord, MqOnlineResRecord, useMqttStore } from '/@/store/modules/mqtt';

  import { ICUBedListRecord, CareRecord } from '/@/api/patients/model/bedExtensionModel';
  import {
    getCareListApi,
    getBedExtListApi,
    patientLeaveApi,
    getPatientDetailApi,
    infoConfigSelectApi,
    getPublicExtStatisticsApi,
  } from '/@/api/patients/bedExtension';
  import { getPersonListApi } from '/@/api/doctors/personnel';

  const userStore = useUserStore();
  const userMqtt = useMqttStore();
  const { createMessage } = useMessage();

  const [registerModal, { openModal: openRegisterModal }] = useModal();
  const [registerChangeBedModal, { openModal: openChangeBedModal }] = useModal();
  const [registerAddAdviceModal, { openModal: openAddAdviceModal }] = useModal();
  const [registerCheckModal, { openModal: openCheckModal }] = useModal();

  const page = reactive({
    index: 1,
    size: 10,
    total: 0,
  });
  const list = ref<ICUBedListRecord[]>([]);
  const statistics = ref<CareRecord[]>([]);
  const bedStatus = ref<number>(0);
  const keyword = ref('');
  const leaveVisible = ref<boolean>(false);
  const currentAccount = ref<Recordable>({});
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
    const { allnum, usednum, freenum } = await getPublicExtStatisticsApi({
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
    const { data, data_sum, page_index, page_size } = await getBedExtListApi({
      partition_id: userStore.getCurrentPartition?.id,
      keyword: keyword.value,
      is_use: bedStatus.value,
      // page_index: page.index,
      // page_size: page.size,
    });
    list.value = data.map((bedItem) => {
      /**
       * http返回的病床列表的每个病床的设备状态：
       * 1. 判断online_status 0离线；1在线；
       * 2. 判断online_status === 1时，判断answer_status===0空闲中，否则是对讲中；
       */
      const bedState = bedItem.online_status == 0 ? 0 : bedItem.answer_status == 0 ? 1 : 4;
      return {
        ...bedItem,
        bedState,
      };
    });
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

  /**
   * @description: 出院弹窗
   */
  function leaveHospital(record: ICUBedListRecord) {
    currentAccount.value = record;
    leaveVisible.value = true;
  }

  /**
   * @description: 确定给患者出院
   */
  async function confirmLeave() {
    const res = await patientLeaveApi({
      partition_id: currentAccount.value.partition_id,
      bed_id: currentAccount.value.bed_id,
    });
    if (res) {
      refreshData();
      leaveVisible.value = false;
      createMessage.success('操作成功!');
    }
  }

  /**
   * @description: 床位卡片的下拉菜单操作
   */
  function handleMenu(e: { type: number; record: ICUBedListRecord }) {
    const { type, record } = e;
    switch (type) {
      // 空床位-入院登记
      case MangeMenu.REGISTER:
        openRegisterModal(true, {
          isUpdate: false,
          record,
          statistics: statistics.value,
          configs: configOptions,
        });
        break;
      // 使用中的床位-编辑
      case MangeMenu.EDIT:
        openRegisterModal(true, {
          isUpdate: true,
          record,
          statistics: statistics.value,
          configs: configOptions,
        });
        break;
      // 使用中的床位-出院
      case MangeMenu.LEAVE:
        leaveHospital(record);
        break;
      // 使用中的床位-转床
      case MangeMenu.CHANGE_BED:
        openChangeBedModal(true, { record });
        break;
      // 使用中的床位-添加医嘱
      case MangeMenu.ADD_ADVICE:
        openAddAdviceModal(true, { record });
        break;
      default:
        break;
    }
  }

  /**
   * @description: 点击一个床位卡片，查看基本信息
   */
  async function handleBedCard(record: ICUBedListRecord) {
    const { partition_id, bed_id } = record;
    const res = await getPatientDetailApi({ partition_id, bed_id });
    openCheckModal(true, { record: { ...res, bed_id } });
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
  function selectWard(status: number) {
    bedStatus.value = status;
    getBeds();
  }

  /**
   *  改变页面中床位数据的的状态
   *  1.呼叫状态: 页面初始化发送http请求: api/partition/bedPreviewList 接口获取online_status字段;
   *  2.页面初始化连上mqtt后，如果病床设备状态变化会主动推送：get/button/change和get/status/change返回status字段;
   * */
  // 1. 【订阅】业务状态事件通知 - 返回床位各种呼叫状态的一种
  function changeBedCallStatus(data: MqCallResRecord) {
    list.value.forEach((bed) => {
      if (data.type === 'bed' && bed.bed_id == data.info_id) {
        bed.bedState = data.status;
      }
    });
  }

  // 2.【订阅】设备状态变化通知（病床分机）- 仅返回床位的上线下线的一种
  function changeBedOnlineStatus(data: MqOnlineResRecord[]) {
    list.value.forEach((bed) => {
      data.forEach((resRecord) => {
        if (bed.bed_id == resRecord.bed_id) {
          //  注意: 呼叫状态由离线状态恢复到线状态, 页面要显示离线前的那个在线状态; 此处加个historyStatus字段用于暂时记录
          if (resRecord.status == 0) {
            bed.historyStatus = bed.bedState;
            bed.bedState = 0;
          } else {
            bed.bedState = bed.historyStatus || 1;
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
