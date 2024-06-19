export const versionColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    align: 'center',
    slots: { customRender: 'index' },
  },
  {
    title: '类型',
    dataIndex: 'device_type',
    align: 'center',
    slots: { customRender: 'type' },
  },
  {
    title: '文件名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '上传人',
    dataIndex: 'user_name',
    align: 'center',
  },
  {
    title: '上传时间',
    dataIndex: 'create_time',
    ellipsis: true,
    align: 'center',
    slots: { customRender: 'time' },
  },
  {
    title: '备注',
    dataIndex: 'comment',
    align: 'center',
  },
  {
    title: '升级进度',
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

export const deviceTypeSelect = [
  {
    label: '全部设备类型',
    value: '',
  },
  {
    label: '信息看板屏',
    value: 'bbs',
  },
  {
    label: '智慧护理屏',
    value: 'nurse',
  },
  {
    label: '医护主机',
    value: 'host',
  },
  {
    label: '病房门口机',
    value: 'doorway',
  },
  {
    label: '音频转发器',
    value: 'switch',
  },

  {
    label: '探视家属分机',
    value: 'icu_family',
  },
  {
    label: '探视医护主机',
    value: 'icu_host',
  },
  {
    label: '智能门禁',
    value: 'icu_guard',
  },
  {
    label: '探视病床分机',
    value: 'icu_sickbed',
  },
  {
    label: '安卓版病床分机',
    value: 'apk_sickbed',
  },
  {
    label: '安卓版走廊屏',
    value: 'apk_passageway',
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
