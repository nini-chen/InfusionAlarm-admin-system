<template>
  <div
    v-if="data"
    :class="setCardClass"
    class="bed-item pt-6px pb-2 px-2 rounded box-border w-280px cursor-pointer relative"
  >
    <div>
      <div class="flex justify-between">
        <!-- 分机号 -->
        <div
          class="extension-name flex items-center justify-center min-w-75px px-6px py-4px mr-6 rounded"
        >
          <span class="text-white text-sm">{{ data.numname || '--' }}</span>
        </div>
        <!-- 设备状态 -->
        <StatusIcon :status="Number(data.online_status)" />
      </div>
      <div class="bg-white mt-5px rounded p-2 pt-10px min-h-192px flex justify-center items-center">
        探视家属分机
      </div>
    </div>
    <div
      class="absolute right-4 bottom-4 w-32px h-32px flex justify-center items-center rounded-full cursor-pointer hover:bg-blue-50"
      style="box-shadow: 0px 0px 4px 0px rgba(72, 128, 255, 0.3)"
      @click="handleEdit"
    >
      <SvgIcon size="16" name="edit-icon" />
    </div>

    <!-- 设备编辑 弹窗：调用医院管理模块-设备管理-终端设备编辑的弹窗 -->
    <EditDeviceModal
      :width="620"
      @register="registerDeviceEditModal"
      @success="handleEditSuccess"
    />
  </div>
</template>
<script lang="ts" setup>
  import {
    computed,
    // ref, reactive
  } from 'vue';
  import StatusIcon from './StatusIcon.vue';

  import { DeviceStatusEnum, DeviceStatusClass } from './deviceEnum';

  import { SvgIcon } from '/@/components/Icon';
  import { useModal } from '/@/components/Modal';
  // import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';

  // import { BedListRecord, CareRecord } from '/@/api/patients/model/bedModel';
  import EditDeviceModal from '/@/views/ward/device/components/TerminalDevice/EditModal.vue';
  import { ICUFamilyExtListRecord } from '/@/api/patients/model/familyExtensionModel';
  // const visible = ref<boolean>(false);
  const emit = defineEmits(['refresh']);
  const props = defineProps({
    data: {
      type: Object as PropType<ICUFamilyExtListRecord>,
      default: null,
    },
  });

  // const leaveVisible = ref<boolean>(false);

  const userStore = useUserStore();
  // const { createMessage } = useMessage();
  const [registerDeviceEditModal, { openModal: openEditDeviceModal }] = useModal();

  const setCardClass = computed(() => {
    // 设备状态 0离线  1空闲  4对讲中
    const status = props.data.online_status ?? 0;
    return DeviceStatusClass[DeviceStatusEnum[status]];
  });

  /**
   * @description: 点击编辑设备
   */
  function handleEdit() {
    openEditDeviceModal(true, {
      record: {
        partition_name: userStore?.getCurrentPartition.partition_name,
        device_type: 'icu_family',
        ...props.data,
      },
    });
  }

  function handleEditSuccess() {
    emit('refresh');
  }
</script>
<style lang="less" scoped>
  .extension-name {
    background-color: #4880ff;
  }
  // 设备卡片样式-离线0
  .family-device-off {
    background-color: #e0e0e0;
  }

  // 设备卡片样式-空闲1
  .family-device-free {
    background: linear-gradient(180deg, #dae6f5 0%, #dae6f5 100%);
  }

  // 设备卡片样式-对讲中4
  .family-device-calling {
    background: linear-gradient(180deg, #4880ff 0%, #dae6f5 100%);
    .extension-name {
      background-color: #ff4f4f;
    }
  }
</style>
