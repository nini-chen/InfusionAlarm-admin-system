<template>
  <div class="addModal">
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      @ok="handleSubmit"
      @visible-change="handlecancel"
    >
      <div class="w-full">
        <BasicForm @register="register">
          <template #device_type="{ model, field }">
            <span class="text-gray-500">{{
              model[field] ? getDeviceClassifyName(model[field]) : '--'
            }}</span>
          </template>
          <template #partition_id="{ model, field }">
            <span class="text-gray-500">{{
              model[field] ? getPartitionName(model[field]) : '--'
            }}</span>
          </template>
          <template #room_id="{ model, field }">
            <span class="text-gray-500">{{ getRoomName(model[field]) }}</span>
          </template>
          <template #device_ip="{ model, field }">
            <span class="text-gray-500">{{ model[field] ? model[field] : '--' }}</span>
          </template>
          <template #device_mac="{ model, field }">
            <span class="text-gray-500">{{ model[field] ? model[field] : '--' }}</span>
          </template>
        </BasicForm>
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, unref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { getAllHospitalRoom } from '/@/api/ward/patient';
  import { saveDevice } from '/@/api/ward/equipment';

  import { useUserStore } from '/@/store/modules/user';
  import { verificationNull, verificationDeviceCode } from '/@/views/ward/wardRules';
  import { getDeviceClassifyName } from '/@/views/ward/device/components/table.data';

  const emit = defineEmits(['success', 'register']);
  const modalFormSchemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 24,
      },
      required: true,
      show: false,
    },
    {
      field: 'device_type',
      component: 'Input',
      label: '设备类型',
      colProps: {
        span: 24,
      },
      slot: 'device_type',
    },
    {
      field: 'device_name',
      component: 'Input',
      label: '设备名称',
      colProps: {
        span: 24,
      },
      dynamicRules: verificationNull,
      required: true,
    },
    {
      field: 'partition_id',
      component: 'Input',
      label: '所属病区',
      colProps: {
        span: 24,
      },
      slot: 'partition_id',
    },
    {
      field: 'room_id',
      component: 'Input',
      label: '设备位置',
      colProps: {
        span: 24,
      },
      slot: 'room_id',
    },
    {
      field: 'device_code',
      component: 'Input',
      label: '设备编号',
      colProps: {
        span: 24,
      },
      required: true,
      componentProps: {
        placeholder: '请输入设备编号',
        maxlength: 15,
      },
      dynamicRules: verificationDeviceCode,
    },
    {
      field: 'device_ip',
      component: 'Input',
      label: 'IP地址',
      colProps: {
        span: 24,
      },
      slot: 'device_ip',
    },
    {
      field: 'device_mac',
      component: 'Input',
      label: 'MAC地址',
      colProps: {
        span: 24,
      },
      slot: 'device_mac',
    },
    {
      field: 'remarks',
      component: 'InputTextArea',
      label: '备注',
      componentProps: {
        placeholder: '请输入',
        rows: 4,
        maxlength: 100,
        showCount: true,
        allowClear: true,
      },
      colProps: {
        span: 24,
      },
    },
  ];

  const [register, { getFieldsValue, setFieldsValue, resetFields, validate, clearValidate }] =
    useForm({
      labelWidth: 100,
      schemas: modalFormSchemas,
      colon: true,
      showActionButtonGroup: false,
    });

  //病房号
  const wardOptions = ref([]);
  const userStore = useUserStore();
  const partitionOptions = computed(() => userStore.getAllPartitions);
  // 当前用户所处的病区的id
  const partitionId = computed(() => userStore.getCurrentPartition.id);

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    console.log(data.data);
    setModalProps({ title: '设备信息编辑' });
    if (JSON.stringify(data.data) != '{}') {
      setFieldsValue({
        id: data.data.id,
        device_type: data.data.device_type,
        device_name: data.data.device_name,
        partition_id: data.data.partition_id,
        device_code: data.data.device_code,
        device_ip: data.data.device_ip,
        device_mac: data.data.device_mac,
        remarks: data.data.remarks,
        room_id: data.data.room_id,
      });
    }

    clearValidate();
  });

  async function handleSubmit() {
    await validate();
    const { remarks, id, device_code, device_name } = getFieldsValue();
    let params = {
      id,
      device_code,
      device_name,
      remarks,
    };

    const res: any = await saveDevice(params);
    if (res) {
      resetFields();
      closeModal();
      emit('success');
    }
  }
  //获取病房
  getWardList();
  //获取病房
  async function getWardList() {
    let params = {
      partition_id: partitionId.value,
    };
    let res = await getAllHospitalRoom(params);
    let list = res.map((v) => {
      let obj = {
        label: v.hospital_room_name,
        value: v.id,
      };

      return obj;
    });

    wardOptions.value = list;
  }

  function getRoomName(value) {
    return value ? unref(wardOptions).find((v) => v.value == value).label : '--';
  }

  function getPartitionName(id) {
    let obj: any = partitionOptions.value.find((v) => {
      return v.id == id;
    });

    return obj.partition_name;
  }

  function handlecancel(val) {
    !val && resetFields();
  }
</script>
