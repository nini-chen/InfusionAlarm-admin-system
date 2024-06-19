<template>
  <div class="bind-modal">
    <BasicModal destroyOnClose v-bind="$attrs" @register="registerModal" @ok="handleSubmit">
      <div class="w-full">
        <BasicForm @register="register">
          <template #partition_id="{ model, field }">
            <Select
              v-model:value="model[field]"
              placeholder="请选择绑定病区"
              :options="filterPartitionOptions"
              :notFoundContent="noPartitionTips"
              @dropdownVisibleChange="handleFetchPartitions"
              @change="getPartition"
              allowClear
            >
              <template #option="{ label, is_icu }">
                <span :style="[is_icu === 1 ? 'color:#ff4f4f;' : '']">{{ label }}</span>
              </template>

              <template #suffixIcon v-if="getPartitionLoading">
                <LoadingOutlined spin />
              </template>
              <template #notFoundContent v-if="getPartitionLoading">
                <span>
                  <LoadingOutlined spin class="mr-1" />
                  {{ t('component.form.apiSelectNotFound') }}
                </span>
              </template>
            </Select>
          </template>

          <!-- 设备位置：病房门口屏 专属 -->
          <template #room_id="{ model, field }">
            <Select
              v-model:value="model[field]"
              placeholder="请选择病房"
              :options="positionOfDoorwayOptions"
              allowClear
            />
          </template>

          <!-- 病房名称：探视家属分机、病床分机 这2种设备才有此选项 -->
          <template #icuRoomNameSlot="{ model, field }">
            <Select
              v-model:value="model[field]"
              style="width: 45%"
              placeholder="名称"
              allowClear
              :options="ICURoomNumberOptions"
              @change="handleSelectRoom"
            />
          </template>

          <!-- 分机编号：探视家属分机 专属-->
          <template #icuFamilyExNumberSlot="{ model, field }">
            <Select
              allowClear
              v-model:value="model[field]"
              :options="freeExtsOptions"
              placeholder="分机编号"
              :getPopupContainer="getPopupContainer"
            />
          </template>

          <!-- 床位号：探视病床分机专属 -->
          <template #icuBedExNumberSlot="{ model, field }">
            <Select
              allowClear
              v-model:value="model[field]"
              :options="freeBedsOptions"
              placeholder="床位号"
              :getPopupContainer="getPopupContainer"
            />
          </template>
        </BasicForm>
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import moment from 'moment';
  import { ref, computed } from 'vue';
  import { Select } from 'ant-design-vue';
  import { LoadingOutlined } from '@ant-design/icons-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useI18n } from '/@/hooks/web/useI18n';

  // import { useUserStore } from '/@/store/modules/user';
  import { getPopupContainer } from '/@/utils';

  import { modalFormSchemas } from './data.config';

  import { DeviceListRecord } from '/@/api/ward/model/equipmentModel';
  import { bindDeviceApi } from '/@/api/ward/equipment';
  import { FilterPartitionsRecord } from '/@/api/ward/model/patientModel';
  import { getFilterPartitionsApi, getAllHospitalRoom } from '/@/api/ward/patient';
  import {
    getRoomSelectApi,
    getICUFreeBedOrExtApi,
    getAllHospitalBed,
  } from '/@/api/ward/equipment';

  const emit = defineEmits(['success', 'register']);
  // const userStore = useUserStore();
  const { t } = useI18n();

  const getPartitionLoading = ref(false);
  const partitionId = ref(0);
  // 门口屏-设置位置select框options (即设置在哪个病房号)
  const positionOfDoorwayOptions = ref([]);
  // ICU家属分机、 ICU病床分机都有的病房名称（数据来源于A1-6-2-2 病区管理-病房管理中添加的探视房列表）
  const ICURoomNumberOptions = ref<LabelValueOptions>([]);
  // ICU家属分机-空余分机号
  const freeExtsOptions = ref<LabelValueOptions>([]);
  // ICU病床分机-空余床位号
  const freeBedsOptions = ref<LabelValueOptions>([]);
  // 病区select框没有数据时的提示
  const noPartitionTips = ref('暂无数据');
  // 当前设备
  const device = ref({} as DeviceListRecord);

  interface selectPartitionsRecord extends FilterPartitionsRecord {
    value: number; // 病区id (同id字段)
    label: string; // 病区名称 (同partition_name字段)
  }

  const filterPartitionOptions = ref<selectPartitionsRecord[]>([]);

  const [
    register,
    { setFieldsValue, resetFields, clearValidate, updateSchema, validate, validateFields },
  ] = useForm({
    labelWidth: 100,
    baseColProps: {
      span: 24,
    },
    schemas: modalFormSchemas,
    colon: true,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    const { record } = data;
    setModalProps({
      title: '新设备绑定',
    });

    if (record) {
      device.value = record;
      record.partition_id && refreshExtOptions(record.partition_id); // 此时病区id为0，获取全部
      setFieldsValue({
        ...record,
        partition_id: record.partition_id || null,
        room_id: record.room_id || null,
        order_num: record.order_num || null,
        bed_id: record.bed_id || null,
      });
      // 当设备时走廊屏时，IP、子网掩码、网关选项可编辑，否则不可编辑
      const readonly = record.device_type != 'passageway';
      ['device_ip', 'device_subnet_mask', 'device_gateway'].forEach((field) => {
        updateSchema({
          field,
          componentProps: {
            readonly,
          },
        });
      });
    }

    clearValidate();
  });

  // 当前设备的类型
  const deviceType = computed(() => device.value.device_type);
  // 病区列表数据
  // const partitions = computed(() => userStore?.getSelectPartitions);
  // 判断当前设备是否是医护主机设备
  const isHostDevice = computed(() => device.value?.device_type === 'host');
  // 判断当前设备是否是探视医护主机设备
  const isICUHostDevice = computed(() => device.value?.device_type === 'icu_host');
  // 判断当前设备是否是icu设备
  const isICUDevice = computed(() => device.value?.device_type?.startsWith('icu_'));

  /**
   * 筛选选择病区下拉框options数据
   * @description 每个病区仅能绑定一个医护主机；(普通病区仅能绑定一个医护主机；ICU病区仅能绑定一个探视医护主机；)
   * @returns {Array}
   */
  async function handleFetchPartitions(open) {
    if (open) {
      getPartitionLoading.value = true;
      noPartitionTips.value = '暂无数据';
      filterPartitionOptions.value = [];
      try {
        // 智能门禁icu_guard 支持绑定普通病区和icu病区，此处只需要不传isicu、is_bind_icu_host字段即可获取所有病区
        let res = await getFilterPartitionsApi({
          is_check_user: 1,
          isicu: deviceType.value == 'icu_guard' ? undefined : isICUDevice.value ? 1 : 0,
          is_bind_icu_host:
            deviceType.value == 'icu_guard' ? undefined : isICUHostDevice.value ? 0 : undefined,
          // is_bind_host: isHostDevice.value ? 0 : undefined,
        });
        if (res?.length > 0) {
          filterPartitionOptions.value = res.map((partition) => {
            return {
              ...partition,
              value: partition.id,
              label: partition.partition_name,
            };
          });
        } else {
          noPartitionTips.value = isICUDevice.value
            ? '请解绑探视医护主机或创建新的探视病区'
            : isHostDevice.value
            ? '请解绑主机或创建新病区'
            : '暂无数据';
        }
      } catch (error) {
        console.warn(error);
      } finally {
        getPartitionLoading.value = false;
      }
    }
  }

  // 所属病区change事件
  function getPartition(value) {
    partitionId.value = value;
    value && validateFields(['partition_id']);
    // 用当前年月日时分秒的数字当作 设备编号
    setFieldsValue({ device_code: moment().format('YYYYMMDDHHmmss') });

    if (deviceType.value === 'icu_family') {
      setFieldsValue({ icu_room_id: null });
      setFieldsValue({ order_num: null });
    } else if (['icu_sickbed', 'apk_sickbed'].includes(deviceType.value)) {
      setFieldsValue({ icu_room_id: null });
      setFieldsValue({ bed_id: null });
    }
    clearValidate();

    refreshExtOptions(value);
  }

  // 更新分机或者位置选项（部门类型设备的特有选项的select框的options）
  function refreshExtOptions(partitionId: number) {
    switch (deviceType.value) {
      // 病房门口屏
      case 'doorway':
        getWardList(partitionId);
        break;
      // 探视家属分机
      case 'icu_family':
      case 'icu_sickbed':
      case 'apk_sickbed':
        // 探视家属分机\探视病床分机的病房列表
        getICURoom({
          partition_id: partitionId,
          is_kin: deviceType.value === 'icu_family' ? 1 : 0,
        });
        break;
      default:
        break;
    }
  }

  // 病房门口屏-获取空闲的病房号
  async function getWardList(partitionId) {
    const res = await getAllHospitalRoom({
      partition_id: partitionId,
    });
    positionOfDoorwayOptions.value = res.map((v) => {
      return {
        label: v.hospital_room_name.split('房')[0],
        value: v.id,
      };
    });
  }

  // 获取病床分机、家属分机 的病房
  async function getICURoom(params) {
    const res = await getRoomSelectApi(params);
    ICURoomNumberOptions.value = res.map((item) => {
      return {
        label: item.hospital_room_name,
        value: item.id,
      };
    });
  }

  // 获取能绑定病床分机的分机号
  async function getICUFreeNumber(params) {
    const res = await getICUFreeBedOrExtApi(params);
    freeExtsOptions.value = res.map((item) => {
      const { order_num } = item;
      return {
        label: order_num,
        value: order_num,
      };
    });
  }

  // 获取能绑定家属分机的病床号
  async function getICUFreeBed(params) {
    const res = await getAllHospitalBed(params);
    freeBedsOptions.value = res.map((item) => {
      const { hospital_bed_name: label, id: value } = item;
      return {
        label,
        value,
      };
    });
  }

  // 当设备是病床分机、家属分机，选择了一个病房
  function handleSelectRoom(roomId) {
    switch (device.value.device_type) {
      // 探视病床分机
      case 'icu_sickbed':
        getICUFreeBed({
          partition_id: partitionId.value,
          room_id: roomId,
          is_bind_icu_sickbed: 0,
        });
        break;
      // 探视家属分机
      case 'icu_family':
        getICUFreeNumber({
          partition_id: partitionId.value,
          room_id: roomId,
          //类型  1：将依据绑定了家属分级的序号去掉   0：获取所有序号
          type: 1,
        });
        break;
      // 安卓病床分机
      case 'apk_sickbed':
        getICUFreeBed({
          partition_id: partitionId.value,
          room_id: roomId,
          is_bind_sickbed: 0,
        });
        break;
      default:
        break;
    }
  }

  // 设置成功的回调
  function successHandler() {
    resetFields();
    closeModal();
    emit('success');
  }

  // 提交
  async function handleSubmit() {
    const { icu_room_id, ...othersParams } = await validate();
    const res = await bindDeviceApi({
      isICU: isICUDevice.value,
      data: {
        id: device.value.id,
        partition_id: partitionId.value,
        ...othersParams,
        room_id: icu_room_id ? icu_room_id : othersParams.room_id,
      },
    });
    res && successHandler();
  }
</script>
