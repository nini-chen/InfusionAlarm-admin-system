import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form';
import { tableEmptyRender } from '/@/utils/tableRender';

// 显示设备类型文本
export const deviceTypeCustomRender = ({ text }) => getDeviceClassifyName(text);

//终端设备绑定
export const listColumns: BasicColumn[] = [
  {
    title: '设备类型',
    dataIndex: 'device_type',
    customRender: deviceTypeCustomRender,
  },
  {
    title: '所属病区',
    dataIndex: 'partition_name',
    customRender: tableEmptyRender,
  },
  {
    title: '设备名称',
    dataIndex: 'device_name',
  },
  {
    title: '设备编号',
    dataIndex: 'device_code',
    customRender: tableEmptyRender,
  },
  {
    title: 'MAC地址',
    dataIndex: 'device_mac',
  },
  {
    title: 'IP地址',
    dataIndex: 'device_ip',
  },
  // {
  //   title: '通道号',
  //   dataIndex: 'device_channel',
  //   customRender: ({ record }) => {
  //     return record.device_channel ? record.device_channel : '--';
  //   },
  // },
  {
    title: '状态',
    dataIndex: 'device_online_status',
    slots: { customRender: 'device_online_status' },
  },
  {
    title: '添加日期',
    dataIndex: 'bindtime',
    slots: { customRender: 'bindtime' },
  },
];

//新设备上线
export const newListColumns: BasicColumn[] = [
  {
    title: '设备类型',
    dataIndex: 'device_type',
    customRender: deviceTypeCustomRender,
  },
  {
    title: '所属病区',
    dataIndex: 'partition_name',
    customRender: tableEmptyRender,
  },
  {
    title: '设备名称',
    dataIndex: 'device_name',
  },
  {
    title: '设备编号',
    dataIndex: 'device_code',
    customRender: tableEmptyRender,
  },
  {
    title: 'MAC地址',
    dataIndex: 'device_mac',
  },
  {
    title: 'IP地址',
    dataIndex: 'device_ip',
  },
  {
    title: '状态',
    dataIndex: 'device_online_status',
    slots: { customRender: 'device_online_status' },
  },
  {
    title: '上线日期',
    dataIndex: 'timestamp',
    slots: { customRender: 'timestamp' },
  },
];

//离线设备列表
export const offliceColumns: BasicColumn[] = [
  {
    title: '设备类型',
    dataIndex: 'device_type',
    customRender: deviceTypeCustomRender,
  },
  {
    title: '所属病区',
    dataIndex: 'partition_name',
    customRender: tableEmptyRender,
  },
  {
    title: '设备名称',
    dataIndex: 'device_name',
  },
  {
    title: '设备编号',
    dataIndex: 'device_code',
    customRender: tableEmptyRender,
  },
  {
    title: 'MAC地址',
    dataIndex: 'device_mac',
  },
  {
    title: 'IP地址',
    dataIndex: 'device_ip',
  },
  {
    title: '通道号',
    dataIndex: 'device_channel',
    customRender: tableEmptyRender,
  },
  {
    title: '状态',
    dataIndex: 'device_online_status',
    slots: { customRender: 'device_online_status' },
  },
  {
    title: '离线时间',
    dataIndex: 'outline_time',
    slots: { customRender: 'outline_time' },
  },
];

export const extensionList: BasicColumn[] = [
  {
    title: '通道',
    dataIndex: 'device_channel',
    width: '50px',
  },
  // {
  //   title: '状态',
  //   dataIndex: 'flag',
  //   slots: { customRender: 'flag' },
  //   width: '100px',
  // },
  {
    title: '设备位置',
    dataIndex: 'room_id',
    width: '300px',
    slots: { customRender: 'room_id' },
  },
  {
    title: '设备名称',
    dataIndex: 'device_name',
    slots: { customRender: 'device_name' },
  },
  {
    title: '设备编号',
    dataIndex: 'device_code',
    slots: { customRender: 'device_code' },
  },
];

export const modalFormSchemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: 'id',
    colProps: {
      span: 24,
    },
    show: false,
  },
  {
    field: 'ipAddress',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 24,
    },
    show: false,
  },
  {
    field: 'maskAddress',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 24,
    },
    show: false,
  },
  {
    field: 'wayAddress',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 24,
    },
    show: false,
  },
  {
    field: 'device_name',
    component: 'Input',
    label: '设备名称',
    colProps: {
      span: 12,
    },
    slot: 'device_name',
  },
  {
    field: 'partition_name',
    component: 'Input',
    label: '所属病区',
    colProps: {
      span: 12,
    },
    slot: 'partition_name',
  },
  {
    field: 'device_code',
    component: 'Input',
    label: '设备编号',
    colProps: {
      span: 24,
    },
    slot: 'device_code',
  },
  {
    field: 'device_mac',
    component: 'Input',
    label: 'MAC地址',
    colProps: {
      span: 12,
    },
    slot: 'device_mac',
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
    field: 'device_subnet_mask',
    component: 'Input',
    label: '子网掩码',
    colProps: {
      span: 12,
    },
    slot: 'device_subnet_mask',
  },
  {
    field: 'device_gateway',
    component: 'Input',
    label: '网关',
    colProps: {
      span: 12,
    },
    slot: 'device_gateway',
  },
  {
    field: 'remarks',
    component: 'InputTextArea',
    label: '备注',
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: '请输入',
      rows: 4,
      allowClear: true,
    },
    slot: 'remarks',
  },
];

export const deviceClassify = [
  {
    value: '',
    label: '全部设备类型',
  },
  {
    value: 'host',
    label: '医护主机',
  },
  // {
  //   value: 'guest',
  //   label: '医护分机',
  // },
  {
    value: 'passageway',
    label: '走廊显示屏',
  },
  {
    value: 'nurse',
    label: '智慧护理屏',
  },
  {
    value: 'bbs',
    label: '信息看板屏',
  },
  {
    value: 'doorway',
    label: '病房门口机',
  },
  {
    value: 'switch',
    label: '音频转发器',
  },
  {
    value: 'apk_passageway',
    label: '安卓版走廊屏',
  },

  // V2.0新增普通病区的安卓版病床分机, 它绑定病区的时候跟探视病床分机是一样的需要选择床位
  {
    value: 'apk_sickbed',
    label: '安卓版病床分机',
  },
  // {
  //   value: 'sickbed',
  //   label: '病床分机',
  // },
  // {
  //   value: 'sos',
  //   label: '洗手间报警按钮',
  // },
  {
    value: 'guard',
    label: '门禁',
  },
  // V2.0新增以下新设备类型
  {
    value: 'icu_host',
    label: '探视医护主机',
  },
  {
    value: 'icu_family',
    label: '探视家属分机',
  },
  {
    value: 'icu_sickbed',
    label: '探视病床分机',
  },
  {
    value: 'icu_guard',
    label: '智能门禁',
  },
];

export function getDeviceClassifyName(type: string): string {
  const match = deviceClassify.find((classifyItem) => classifyItem.value === type);
  return match ? match.label : '--';
}

export const extensionSosList: BasicColumn[] = [
  {
    title: '接口',
    dataIndex: 'device_channel',
    width: '50px',
  },
  {
    title: '设备位置',
    dataIndex: 'room_id',
    width: '300px',
    slots: { customRender: 'device_local' },
  },
  {
    title: '设备名称',
    dataIndex: 'device_name',
    slots: { customRender: 'device_name' },
  },
  {
    title: '设备编号',
    dataIndex: 'device_code',
    slots: { customRender: 'device_code' },
  },
];
