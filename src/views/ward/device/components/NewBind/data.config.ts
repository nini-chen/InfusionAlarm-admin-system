import { FormSchema } from '/@/components/Form/index';
import { verificationNull, verificationDeviceCode } from '/@/views/ward/wardRules';
import { getDeviceClassifyName } from '/@/views/ward/device/components/table.data';

export const modalFormSchemas: FormSchema[] = [
  {
    field: 'device_type',
    component: 'Input',
    label: '设备类型',
    render: ({ model, field }) => getDeviceClassifyName(model[field]),
  },
  {
    field: 'device_name',
    component: 'Input',
    label: '设备名称',
    colProps: {
      span: 13,
    },
    componentProps: {
      maxlength: 18,
      placeholder: '请输入设备名称',
    },
    dynamicRules: verificationNull,
  },
  {
    field: 'partition_id',
    component: 'Select',
    label: '所属病区',
    colProps: {
      span: 13,
    },
    componentProps: {
      options: [],
      placeholder: '请选择绑定病区',
    },
    slot: 'partition_id',
    required: true,
  },

  // 病房门口屏 专属
  {
    field: 'room_id',
    component: 'Select',
    label: '设备位置',
    slot: 'room_id',
    suffix: '房',
    required: true,
    ifShow: ({ values }) => values.device_type == 'doorway',
    colProps: {
      span: 13,
    },
  },

  //  家属分机 和 病床分机 、普通病区的安卓病床分机都有
  {
    field: 'icu_room_id',
    component: 'Select',
    label: '病房名称',
    slot: 'icuRoomNameSlot',
    required: true,
    // 家属分机 和 病床分机都是这个room_id字段
    ifShow: ({ values }) =>
      ['icu_family', 'icu_sickbed', 'apk_sickbed'].includes(values.device_type),
  },

  // 家属分机 专属
  {
    field: 'order_num',
    component: 'Select',
    label: '分机编号',
    slot: 'icuFamilyExNumberSlot',
    required: true,
    ifShow: ({ values }) => values.device_type == 'icu_family',
    suffix: '号',
    colProps: {
      span: 14,
    },
  },

  // icu病区的病床分机 和普通病区的安卓病床分机
  {
    field: 'bed_id',
    component: 'Select',
    label: '床位号',
    slot: 'icuBedExNumberSlot',
    required: true,
    ifShow: ({ values }) => ['icu_sickbed', 'apk_sickbed'].includes(values.device_type),
    suffix: '号',
    colProps: {
      span: 14,
    },
  },

  {
    field: 'device_code',
    component: 'Input',
    label: '设备编号',
    colProps: {
      span: 13,
    },
    required: true,
    componentProps: {
      placeholder: '请输入设备编号',
      maxlength: 15,
    },
    dynamicRules: verificationDeviceCode,
  },
  {
    field: 'device_mac',
    component: 'Input',
    label: 'MAC地址',
    render: ({ model, field }) => model[field] || '--',
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
    field: 'version',
    component: 'Input',
    label: '固件版本',
    render: ({ model, field }) => model[field] || '默认出厂版本',
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
