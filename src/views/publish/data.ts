export const versionColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    align: 'center',
    slots: { customRender: 'index' },
  },
  {
    title: '设备类型',
    dataIndex: 'device_type',
    align: 'center',
    slots: { customRender: 'type' },
  },
  {
    title: '位置编号',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '设备名称',
    dataIndex: 'user_name',
    align: 'center',
  },
  {
    title: '呼叫码',
    dataIndex: 'create_time',
    ellipsis: true,
    align: 'center',
    slots: { customRender: 'time' },
  },
  {
    title: '编辑日期',
    dataIndex: 'comment',
    align: 'center',
  },
  {
    title: '接收器IP',
    dataIndex: 'upgrade_status',
    align: 'center',
    slots: { customRender: 'status' },
  },
  {
    title: '操作',
    dataIndex: 'op',
    align: 'center',
    slots: { customRender: 'op' },
  },
];
export const serialNumberSelect = [
  {
    label: '请选择是否编号',
    value: '',
  },
  {
    label: '已编号',
    value: '1',
  },
  {
    label: '未编号',
    value: '0',
  },
];

export const deviceTypeSelect = [
  {
    label: '请选择接收器IP',
    value: '',
  },
  {
    label: '其他设备',
    value: 'other',
  },
];

export const deviceTypeMap = {
  guard: '门禁',
  bbs: '信息看板屏',
  nurse: '智慧护理屏',
  sickbed: '病床分机',
  host: '医护主机',
  // guest: '医护分机',
  web: 'PC WEB端 ',
  switch: '音频转发器',
  doorway: '病房门口机',
  icu_sickbed: '探视病床分机',
  icu_family: '探视家属分机',
  icu_host: '探视医护主机',
  icu_guard: '智能门禁',
  apk_sickbed: '安卓版病床分机',
  apk_passageway: '安卓版走廊屏',
  other: '其他设备',
};
