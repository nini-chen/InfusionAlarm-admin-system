<template>
  <div
    class="bed-item pt-6px pb-2 px-2 bg-blue-200 rounded box-border w-280px cursor-pointer relative"
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
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { Tag, Popover } from 'ant-design-vue';
  import CareIcon from './CareIcon.vue';
  import CallStatus from './CallStatus.vue';
  import {
    MaleOptions,
    CallStatusEnum,
    CallBgEnum,
    MangeMenu,
    setCareLevelColor,
  } from '../careEnum';
  import noPatients from '/@/assets/images/no-patient.png';
  import { SvgIcon } from '/@/components/Icon';
  import { getPopupContainer } from '/@/utils';

  import { ICUBedListRecord, CareRecord } from '/@/api/patients/model/bedExtensionModel';
  const visible = ref<boolean>(false);
  const emit = defineEmits(['click', 'handleMenu']);

  const props = defineProps({
    data: {
      type: Object as PropType<ICUBedListRecord>,
      default: null,
    },
    statistics: {
      type: Array as PropType<CareRecord[]>,
      default: () => [],
    },
  });

  const bedStatus = computed(() => {
    const status = props.data.bedState ?? 0;
    return Number(status);
  });

  // 卡片背景颜色
  const callColor = computed(() => {
    const status = props.data.bedState ?? 0;
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

  /**
   * @description: 编辑图标-下拉菜单的点击事件
   */
  function handleMenuEvent(type) {
    visible.value = false;
    emit('handleMenu', {
      record: props.data,
      type,
    });
  }

  /**
   * @description: 编辑图标以外范围的点击事件
   */
  function handleClick() {
    if (!props.data.patient_name) return;
    emit('click', props.data);
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
