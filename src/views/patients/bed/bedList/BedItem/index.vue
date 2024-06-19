<template>
  <div
    class="bed-item pt-6px pb-2 px-2 bg-blue-200 rounded box-border w-280px cursor-pointer relative ccccc"
    :style="`background: ${callColor};`"
  >
    <div @click="handleClick">
      <div class="flex justify-between">
        <!-- 病床信息 -->
        <div
          class="flex items-center justify-center min-w-75px px-6px py-4px mr-6 rounded"
          :style="`background: ${data.i1_name ? setCareLevelColor(data.i1_color) : '#4880ff80'};`"
        >
          <CareIcon
            v-if="data.i1_name"
            :color="setCareLevelColor(data.i1_color)"
            :label="data.i1_name.slice(0, 1)"
          />
          <span class="text-white text-sm"
            >{{ data.hospital_room_name }}{{ data.hospital_bed_name }}</span
          >
        </div>
        <!-- 设备呼叫状态: 呼叫状态不空闲 时显示 -->
        <CallStatus v-if="bedStatus != 1" :status="bedStatus" />
      </div>
      <!-- 病人详情 -->
      <div class="bg-white mt-5px rounded p-2 pt-10px min-h-192px">
        <div class="flex items-center pb-10px">
          <template v-if="data.patient_name">
            <!-- 性别图标 -->
            <img
              class="p-10px rounded mr-4px"
              :src="maleData.icon"
              :style="`background: ${maleData.color};`"
            />
            <div>
              <p class="mb-0 flex items-center truncate">
                <!-- 病人姓名、年龄 -->
                <span
                  class="text-base font-bold mr-6px truncate max-w-7em"
                  :title="`${data.patient_name}(${data.patient_age}岁)`"
                  >{{ data.patient_name }}({{ data.patient_age }}岁)</span
                >
                <!-- 医保类型 -->
                <Tag
                  v-if="data.i6_name"
                  class="mb-2 !rounded-xl truncate max-w-7em"
                  :color="setCareLevelColor(data.i6_color)"
                  :title="data.i6_name"
                >
                  {{ data.i6_name }}
                </Tag>
              </p>
              <p class="mb-0 text-xs text-black flex aligns-center truncate w-200px">
                <span class="truncate max-w-8em" :title="data.patient_number"
                  >住院号：{{ data.patient_number }}</span
                >
                <!-- 入院日期 -->
                <span class="ml-2 mr-10px w-63px" :title="data.patient_livedate">{{
                  data.patient_livedate
                }}</span>
                <!-- 住院天数 -->
                <span class="truncate max-w-8em" :title="`${data.day_num}天`"
                  >{{ data.day_num }} 天</span
                >
              </p>
            </div>
          </template>
        </div>
        <div class="flex pt-2">
          <ul class="text-xs leading-5 truncate max-w-60" v-if="data.patient_name">
            <li class="truncate">
              <span class="text-black opacity-60">诊断：</span>
              <span class="text-black" :title="data.diagnosis ? data.diagnosis : '无'">{{
                data.diagnosis || '无'
              }}</span>
            </li>
            <li class="truncate">
              <span class="text-black opacity-60">饮食：</span>
              <span class="text-black" :title="data.i3_name ? data.i3_name : '无'">{{
                data.i3_name || '无'
              }}</span>
            </li>
            <li class="truncate pb-4px">
              <span class="text-black opacity-60">药物反应：</span>
              <span class="text-black" :title="data.i4_name ? data.i4_name : '无'">{{
                data.i4_name || '无'
              }}</span>
            </li>
            <li class="truncate">
              <span class="text-black opacity-60">管床医生：</span>
              <span
                class="text-black"
                :title="data.scheduling_doctor ? data.scheduling_doctor : '无'"
                >{{ data.scheduling_doctor || '无' }}</span
              >
            </li>
            <li class="truncate max-w-54">
              <span class="text-black opacity-60">管床护士：</span>
              <span
                class="text-black"
                :title="data.scheduling_nurse ? data.scheduling_nurse : '无'"
                >{{ data.scheduling_nurse || '无' }}</span
              >
            </li>
          </ul>
          <div v-else class="no-patient_name pl-63px pr-23px pb-48px pt-34px">
            <img :src="noPatients" alt="" />
          </div>
        </div>
      </div>
    </div>
    <!-- 管理图标按钮 -->
    <Popover
      v-model:visible="visible"
      trigger="click"
      placement="bottom"
      class="absolute right-4 bottom-4"
      :getPopupContainer="getPopupContainer"
    >
      <div
        class="w-32px h-32px flex justify-center items-center rounded-full cursor-pointer hover:bg-blue-50"
        style="box-shadow: 0px 0px 4px 0px rgba(72, 128, 255, 0.3)"
      >
        <SvgIcon size="16" name="edit-icon" />
      </div>
      <template #content>
        <ul class="bed-manage-menu">
          <li v-for="item of manageMenu" :key="item.value" @click="handleMenuEvent(item.value)">{{
            item.label
          }}</li>
        </ul>
      </template>
    </Popover>

    <!-- 空床-入院登记信息(新建) 和 编辑 -->
    <PatientInfoModal :width="948" @register="registerModal" @success="handleSuccess" />
    <!-- 使用中-转床 -->
    <ChangeBedModal
      :width="446"
      :canFullscreen="false"
      @register="registerChangeBedModal"
      @success="handleSuccess"
    />
    <!-- 使用中-添加医嘱信息 -->
    <AddAdviceModal :width="600" @register="registerAddAdviceModal" @success="handleSuccess" />
    <!-- 查看床位卡片的信息 -->
    <CheckModal :width="948" @register="registerCheckModal" />
    <!-- 患者出院 弹窗 -->
    <Modal v-model:visible="leaveVisible" width="446" title="患者出院" okText="确认" @ok="confirmLeave">
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
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { getPopupContainer } from '/@/utils';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { Tag, Popover, Modal } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import CareIcon from './CareIcon.vue';
  import CallStatus from './CallStatus.vue';
  import {
    MaleOptions,
    CallStatusEnum,
    CallBgEnum,
    MangeMenu,
    setCareLevelColor,
  } from './careEnum';

  import { useModal } from '/@/components/Modal';
  import noPatients from '/@/assets/images/no-patient.png';
  import { SvgIcon } from '/@/components/Icon';
  import PatientInfoModal from './PatientInfoModal.vue';
  import ChangeBedModal from './ChangeBedModal.vue';
  import AddAdviceModal from './AddAdviceModal.vue';
  import CheckModal from './CheckModal/index.vue';

  import { BedListRecord, CareRecord } from '/@/api/patients/model/bedModel';
  import {
    // getCareListApi,
    // getBedListApi,
    patientLeaveApi,
    getPatientDetailApi,
    // infoConfigSelectApi,
    // getBedCountsApi,
  } from '/@/api/patients/bed';

  const visible = ref<boolean>(false);
  const leaveVisible = ref<boolean>(false);
  const currentAccount = ref<Recordable>({});

  const emit = defineEmits(['success']);
  const props = defineProps({
    data: {
      type: Object as PropType<BedListRecord>,
      default: null,
    },
    statistics: {
      type: Array as PropType<CareRecord[]>,
      default: () => [],
    },
    configOptions: {
      type: Object as PropType<CareRecord[]>,
      default: null,
    },
  });
  const { createMessage } = useMessage();

  const bedStatus = computed(() => {
    const status = props.data.online_status ?? 0;
    return Number(status);
  });

  // 卡片背景颜色
  const callColor = computed(() => {
    const status = props.data.online_status ?? 0;
    return CallBgEnum[CallStatusEnum[Number(status)]] || '#DAE6F5';
  });

  // 性别
  const maleData = computed(() => {
    const match = MaleOptions.find((x) => props.data.patient_sex == x.value);
    return match ? match : MaleOptions[2];
  });

  /**
   * @description: 管理图标按钮,下拉选框2种情况：
   * 1.病床使用中： 编辑、出院、转床、添加遗嘱
   * 2.病床空闲中： 入院登记
   */
  const usingBedMenu: LabelValueOptions = [
    {
      label: '编辑',
      value: MangeMenu.EDIT,
    },
    {
      label: '出院',
      value: MangeMenu.LEAVE,
    },
    {
      label: '转床',
      value: MangeMenu.CHANGE_BED,
    },
    {
      label: '添加医嘱',
      value: MangeMenu.ADD_ADVICE,
    },
  ];

  const emptyBedMenu = [
    {
      label: '入院登记',
      value: MangeMenu.REGISTER,
    },
  ];

  const manageMenu = computed(() => (props.data.patient_name ? usingBedMenu : emptyBedMenu));

  const [registerModal, { openModal: openRegisterModal }] = useModal();
  const [registerChangeBedModal, { openModal: openChangeBedModal }] = useModal();
  const [registerAddAdviceModal, { openModal: openAddAdviceModal }] = useModal();
  const [registerCheckModal, { openModal: openCheckModal }] = useModal();

  /**
   * @description: 编辑图标-下拉菜单的点击事件
   */
  function handleMenuEvent(type) {
    visible.value = false;
    switch (type) {
      // 空床位-入院登记
      case MangeMenu.REGISTER:
        openRegisterModal(true, {
          isUpdate: false,
          record: props.data,
          statistics: props.statistics,
          configs: props.configOptions,
        });
        break;
      // 使用中的床位-编辑
      case MangeMenu.EDIT:
        openRegisterModal(true, {
          isUpdate: true,
          record: props.data,
          statistics: props.statistics,
          configs: props.configOptions,
        });
        break;
      // 使用中的床位-出院
      case MangeMenu.LEAVE:
        leaveHospital(props.data);
        break;
      // 使用中的床位-转床
      case MangeMenu.CHANGE_BED:
        openChangeBedModal(true, { record: props.data });
        break;
      // 使用中的床位-添加医嘱
      case MangeMenu.ADD_ADVICE:
        openAddAdviceModal(true, { record: props.data });
        break;
      default:
        break;
    }
  }

  /**
   * @description: 出院弹窗
   */
  function leaveHospital(record: BedListRecord) {
    currentAccount.value = record;
    leaveVisible.value = true;
  }

  /**
   * @description: 确定给患者出院
   */
  async function confirmLeave() {
    const res = await patientLeaveApi(currentAccount.value.bed_id);
    if (res) {
      handleSuccess();
      leaveVisible.value = false;
      createMessage.success('操作成功!');
    }
  }

  /**
   * @description: 编辑图标以外范围的点击事件 (查看基本信息)
   */
  async function handleClick() {
    if (!props.data.patient_name) return;
    const res = await getPatientDetailApi(props.data.bed_id);
    openCheckModal(true, { record: res });
  }

  /**
   * @description: 操作成功回调（通常需要刷新列表）
   */
  function handleSuccess() {
    emit('success');
  }
</script>
<style lang="less">
  .bed-manage-menu {
    margin-bottom: 0;
    li {
      width: 76px;
      height: 28px;
      line-height: 28px;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      color: #2a3a5a;
      background: linear-gradient(134deg, #dae7f6 0%, #98cbfa 100%);
      box-shadow: inset 0px -1px 1px 0px rgba(0, 0, 0, 0.05);
      border-radius: 2px;
      cursor: pointer;
      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }
  }
</style>
