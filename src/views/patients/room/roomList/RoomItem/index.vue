<template>
  <div
    class="bed-item pt-6px pb-8px px-8px bg-blue-200 rounded box-border w-280px cursor-pointer"
    :style="`background: ${callColor};`"
    @click="handleCardClick"
  >
    <div class="flex justify-between">
      <!-- 病房号 -->
      <div
        class="min-w-52px px-8px py-2px mr-6 rounded text-center"
        :style="`background: ${roomTitleColor};`"
      >
        <span class="text-white text-sm">{{ data.hospital_room_name }}</span>
      </div>
      <!-- 设备呼叫状态: 离线或卫生间报警 时显示 -->
      <CallStatus
        v-if="data.online_status == 0 || data.online_status == 6"
        :status="data.online_status"
        :data="data"
      />
    </div>
    <div class="bg-white rounded">
      <!-- 医护信息 -->
      <div class="mt-5px p-8px pt-10px">
        <div class="flex justify-between relative border-line">
          <ul class="text-sm leading-5 truncate max-w-60 text-gray-600">
            <li class="truncate">
              <span>管床医生：</span>
              <span>{{ data.scheduling_doctor || '无' }}</span>
            </li>
            <li class="truncate pt-1">
              <span>管床护士：</span>
              <span>{{ data.scheduling_nurse || '无' }}</span>
            </li>
          </ul>
          <!-- 编辑图标按钮 -->
          <div
            class="w-32px h-32px flex justify-center items-center rounded-full cursor-pointer hover:bg-blue-50"
            style="box-shadow: 0px 0px 4px 0px rgba(72, 128, 255, 0.3)"
            title="排班"
            @click="handleEdit"
          >
            <SvgIcon size="16" name="edit-icon" />
          </div>
        </div>
      </div>
      <!-- 只需有一张病床绑定了分机，就显示 病床信息 -->
      <div v-if="data.sickbed_num > 0" class="flex justify-center items-center pt-19px pb-45px">
        <div class="flex flex-1 items-center flex-col" v-for="bed of bedList" :key="bed.id">
          <div
            class="text-xs bed-label"
            :style="`color: ${bed.textColor};background: ${bed.textBg};`"
            >{{ bed.hospital_bed_name }}</div
          >
          <div class="male-icon" :style="`background: ${bed.iconBg};`">
            <img class="w-16px h-16px" :src="bed.icon" alt="" />
          </div>
        </div>
      </div>
      <div v-else class="no-bind">
        <p>未绑定病床分机</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { SvgIcon } from '/@/components/Icon';
  import CallStatus from './CallStatus.vue';

  import {
    CallStatusEnum,
    CallBgEnum,
    BedOptions,
    // RoomTitleColorEnum
  } from '../careEnum';
  import { RoomListRecord } from '/@/api/patients/model/roomModel';

  const emit = defineEmits(['click', 'scheduling']);
  const props = defineProps({
    data: {
      type: Object as PropType<RoomListRecord>,
      default: null,
    },
  });

  // 卡片背景颜色
  const callColor = computed(() => {
    const status = props.data?.online_status ?? 1;
    return CallBgEnum[CallStatusEnum[status]];
  });

  // 房号牌颜色
  const roomTitleColor = computed(() => {
    const status = props.data?.online_status ?? 1;
    return status == 6 ? '#B23C3C' : '#4880FF';
  });

  /**
   * 设置床位列表的颜色和图标
   */
  const bedList = computed(() => {
    return props.data.bed.map((one) => {
      const isWoman = one?.patient[0]?.patient_sex == '2';

      // 1 设备离线
      if (one.sickbed_online_status == 0) {
        return { ...one, ...BedOptions.callOff };
      }

      // 2 床位空闲
      if (one.patient?.length == 0) {
        return { ...one, ...BedOptions.noCall };
      }

      // 3 床位-女病人
      if (isWoman) {
        return { ...one, ...BedOptions.woman };
      }

      // 4 床位-男病人
      return { ...one, ...BedOptions.man };
    });
  });

  /**
   * @description: 编辑图标点击事件, 进行排班
   */
  function handleEdit() {
    emit('scheduling', props.data);
  }

  function handleCardClick() {
    emit('click', props.data);
  }
</script>
<style lang="less">
  .bed-item {
    .border-line {
      border-bottom: 1px solid #e9e9e9;
    }
    .bed-label {
      width: 52px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      background-color: #dae6f5;
      border-radius: 6px 6px 0px 0px;
    }
    .male-icon {
      width: 52px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background-color: #dae6f5;
      img {
        display: inline-block;
      }
    }

    .no-bind {
      p {
        margin: 0;
        padding: 39px 76px 59px;
        font-size: 16px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.45);
      }
    }
  }
</style>
