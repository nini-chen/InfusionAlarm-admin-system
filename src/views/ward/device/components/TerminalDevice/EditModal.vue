<template>
  <BasicModal
    title="设备编辑"
    destroyOnClose
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <div class="w-full device-edit-form">
      <BasicForm @register="register" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';

  import { useMessage } from '/@/hooks/web/useMessage';
  import { Button } from 'ant-design-vue';
  // import { useUserStore } from '/@/store/modules/user';
  import { verificationNull, verificationDeviceCode } from '/@/views/ward/wardRules';
  import { getDeviceClassifyName } from '/@/views/ward/device/components/table.data';

  import { saveDevice, resetDevicePwdApi } from '/@/api/ward/equipment';
  import { DeviceListRecord } from '/@/api/ward/model/equipmentModel';

  const emit = defineEmits(['success', 'register']);

  const resetPwdLoading = ref<boolean>(false);
  // 自定义重置密码按钮选项
  const customPasswordResetRender = () => {
    return h(
      Button,
      {
        class: 'w-110px',
        type: 'primary',
        ghost: true,
        loading: resetPwdLoading.value,
        onclick: () => {
          handleResetPwd();
        },
      },
      () => '密码重置',
    );
  };

  const modalFormSchemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: 'id',
      show: false,
    },
    {
      field: 'device_type',
      component: 'Input',
      label: '设备类型',
      render: ({ model, field }) => getDeviceClassifyName(model[field]),
    },
    {
      field: 'pwdReset',
      component: 'Input',
      label: '密码',
      render: customPasswordResetRender,
      // suffix: '点击重置后默认密码：123456',
      /** V2.0版本功能：仅 探视医护主机 和 探视病床分机、智能门禁 3种设备才有重置密码功能 */
      ifShow: ({ values }) => ['icu_host', 'icu_sickbed', 'icu_guard'].includes(values.device_type),
      colProps: {
        span: 16,
      },
    },
    {
      field: 'room_id',
      component: 'Input',
      label: '设备位置',
      ifShow: ({ values }) => {
        return values.device_type == 'doorway';
      },
      render: ({ model, field }) => `${model[field] || '--'}房`,
    },
    {
      field: 'order_num',
      component: 'Input',
      label: '设备分机号', // 探视家属分机 专属
      ifShow: ({ values }) => values.device_type == 'icu_family',
      render: ({ model, field }) => `${model[field] || '--'}号`,
      colProps: {
        span: 13,
      },
    },
    {
      field: 'order_num',
      component: 'Input',
      label: '设备床号', // 探视病床分机 专属
      ifShow: ({ values }) => values.device_type == 'icu_sickbed',
      render: ({ model, field }) => `${model[field] || '--'}床`,
      colProps: {
        span: 13,
      },
    },
    {
      field: 'device_name',
      component: 'Input',
      label: '设备名称',
      required: true,
      dynamicRules: verificationNull,
      colProps: {
        span: 13,
      },
      componentProps: {
        maxlength: 18,
      },
    },
    {
      field: 'default_word',
      component: 'Input',
      label: '默认显示文字',
      ifShow: ({ values }) => {
        return values.device_type == 'passageway';
      },
    },
    {
      field: 'partition_name',
      component: 'Input',
      label: '所属病区',
      render: ({ model, field }) => model[field] || '--',
    },
    {
      field: 'device_code',
      component: 'Input',
      label: '设备编号',
      required: true,
      colProps: {
        span: 13,
      },
      componentProps: {
        placeholder: '请输入设备编号',
        maxlength: 15,
      },
      dynamicRules: verificationDeviceCode,
    },
    {
      field: 'device_ip',
      component: 'IPAddressInput',
      label: 'IP地址',
      componentProps: {
        readonly: false,
      },
    },
    {
      field: 'device_subnet_mask',
      component: 'IPAddressInput',
      label: '子网掩码',
      componentProps: {
        readonly: false,
      },
    },
    {
      field: 'device_gateway',
      component: 'IPAddressInput',
      label: '网关',
      componentProps: {
        readonly: false,
      },
    },
    {
      field: 'device_mac',
      component: 'Input',
      label: 'MAC地址',
      render: ({ model, field }) => model[field] || '--',
    },
    {
      field: 'version',
      component: 'Input',
      label: '固件版本',
      render: ({ model, field }) => model[field] || '--',
    },
    {
      field: 'remarks',
      component: 'InputTextArea',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
        rows: 4,
        maxlength: 100,
        showCount: true,
        allowClear: true,
      },
    },
  ];
  // 当前设备
  const device = ref({} as DeviceListRecord);

  const { createMessage } = useMessage();
  // const userStore = useUserStore();
  // 当前用户所处的病区的id
  // const partitionId = computed(() => userStore.getCurrentPartition.id);

  const [
    register,
    { getFieldsValue, setFieldsValue, resetFields, clearValidate, validate, updateSchema },
  ] = useForm({
    labelWidth: 100,
    colon: true,
    schemas: modalFormSchemas,
    showActionButtonGroup: false,
  });

  const [registerModal, { closeModal }] = useModalInner((data) => {
    const { record } = data;
    if (record) {
      device.value = record;
      setFieldsValue({
        ...record,
        partition_id: record.partition_id || null,
        order_num: record.order_num || null,
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

  // 重置密码 （重置安卓端进入设置页面的密码）
  async function handleResetPwd() {
    if (resetPwdLoading.value) return;
    resetPwdLoading.value = true;
    try {
      const res = await resetDevicePwdApi({
        device_mac: device.value.device_mac,
      });
      if (res) {
        createMessage.success('重置成功');
      }
      setTimeout(() => {
        resetPwdLoading.value = false;
      }, 1000);
    } catch (error) {
      resetPwdLoading.value = false;
    }
  }

  async function handleSubmit() {
    await validate();
    const { id, device_name, device_code, remarks } = getFieldsValue();
    let params = {
      id,
      device_name,
      device_code,
      remarks,
    };

    const res = await saveDevice(params);
    if (res) {
      resetFields();
      closeModal();
      emit('success');
      createMessage.success('编辑成功');
    }
  }
</script>
<style lang="less">
  .device-edit-form {
    #pwdReset {
      height: 32px;
      margin-top: -8px;
    }
  }
</style>
