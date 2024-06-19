export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    slots: { customRender: 'index' },
  },
  {
    title: '人员角色',
    dataIndex: 'role_name',
    ellipsis: true,
  },
  {
    title: '账号',
    dataIndex: 'user_number',
    ellipsis: true,
  },
  {
    title: '姓名',
    dataIndex: 'user_name',
    ellipsis: true,
  },
  {
    title: '操作时间',
    dataIndex: 'create_time',
    key: 'address',
    ellipsis: true,
    slots: { customRender: 'time' },
  },
  {
    title: '所属模块',
    dataIndex: 'module_name',
    ellipsis: true,
  },
  {
    title: '操作类型',
    dataIndex: 'type_name',
    ellipsis: true,
  },
  {
    title: '操作',
    dataIndex: 'content',
    ellipsis: true,
  },
  {
    title: '详细信息',
    dataIndex: 'info',
    ellipsis: true,
  },
];

export const terminalColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    slots: { customRender: 'index' },
  },
  {
    title: '设备类型',
    dataIndex: 'device_type_name',
    ellipsis: true,
  },
  {
    title: '设备名称',
    dataIndex: 'device_name',
    ellipsis: true,
  },
  {
    title: '操作时间',
    dataIndex: 'op_time',
    ellipsis: true,
    slots: { customRender: 'time' },
  },
  {
    title: '操作类型',
    dataIndex: 'type_name',
    ellipsis: true,
  },
  {
    title: '详细信息',
    dataIndex: 'info',
    ellipsis: true,
  },
];

export const terminalIcuColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    slots: { customRender: 'index' },
  },
  {
    title: '设备类型',
    dataIndex: 'device_type',
    ellipsis: true,
    slots: { customRender: 'device_type' },
  },
  {
    title: '设备名称',
    dataIndex: 'device_name',
    ellipsis: true,
  },
  {
    title: '操作时间',
    dataIndex: 'op_time',
    ellipsis: true,
    slots: { customRender: 'time' },
  },
  {
    title: '操作类型',
    dataIndex: 'type',
    ellipsis: true,
    slots: { customRender: 'type' },
  },
  {
    title: '详细信息',
    dataIndex: 'info',
    ellipsis: true,
  },
];

export const typeList = [
  {
    label: '新增',
    value: 'add',
  },
  {
    label: '删除',
    value: 'delete',
  },
  {
    label: '编辑',
    value: 'update',
  },
  {
    label: '查询',
    value: 'query',
  },
  {
    label: '导出',
    value: 'export',
  },
  {
    label: '登出',
    value: 'logout',
  },
  {
    label: '登入',
    value: 'login',
  },
  {
    label: '升级',
    value: 'upgrade',
  },
];

export const typeMap = {
  add: '新增',
  delete: '删除',
  update: '编辑',
  query: '新增',
  export: '查询',
  logout: '登出',
  login: '登入',
  upgrade: '升级',
};

export const deviceTypeAll = [
  {
    label: '病床分机',
    value: 'sickbed',
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
    label: '洗手间报警按钮',
    value: 'sos',
  },
  {
    label: '安卓版病床分机',
    value: 'apk_sickbed',
  },
];

/*全部选择项*/
export const ternimalOpList = [
  {
    label: '新增',
    value: 'add',
  },
  {
    label: '增援',
    value: 'assist',
  },
  {
    label: '换液换药提醒',
    value: 'warn',
  },
  {
    label: '接听',
    value: 'answer',
  },
  {
    label: '呼叫',
    value: 'call',
  },
  {
    label: '挂断',
    value: 'hang',
  },
  {
    label: '拒接',
    value: 'reject',
  },
  {
    label: '知晓',
    value: 'know',
  },
  {
    label: '编辑',
    value: 'update',
  },
  {
    label: '立即托管',
    value: 'agent',
  },
  {
    label: '删除',
    value: 'delete',
  },
  {
    label: '到达', //到达 进入护理
    value: 'nursing',
  },
  {
    label: '完成', //完成 退出护理
    value: 'endnurs',
  },
  {
    label: '取消',
    value: 'cancel',
  },
];

/*联动选项 病房门口机*/
export const doorwayOpList = [
  {
    label: '挂断',
    value: 'hang',
  },
];

/*联动选择项 医护主机*/
export const ternimalHostOpList = [
  {
    label: '新增',
    value: 'add',
  },
  {
    label: '接听',
    value: 'answer',
  },
  {
    label: '呼叫',
    value: 'call',
  },
  // {
  //   label: '挂断',
  //   value: 'hang',
  // },
  {
    label: '拒绝',
    value: 'reject',
  },
  {
    label: '知晓',
    value: 'know',
  },
  {
    label: '编辑',
    value: 'update',
  },
  {
    label: '立即托管',
    value: 'agent',
  },
  {
    label: '删除',
    value: 'delete',
  },
  // {
  //   label: '取消',
  //   value: 'cancel',
  // },
];
/*联动选择项 病床分机*/
export const ternimalSickOpList = [
  {
    label: '呼叫',
    value: 'call',
  },
  {
    label: '到达', //到达  进入护理
    value: 'nursing',
  },
  {
    label: '完成', //完成  退出护理
    value: 'endnurs',
  },
  {
    label: '增援',
    value: 'assist',
  },
  {
    label: '换液换药提醒',
    value: 'warn',
  },
];
/*联动选择项 sos*/
export const ternimalSosOpList = [
  {
    label: '呼叫', //到达  进入护理
    value: 'call',
  },
  {
    label: '复位', //完成  退出护理
    value: 'cancel',
  },
];

export interface FilterOptions {
  dateValue: string[];
  operateTypeValue: number | string | undefined;
}

export interface TerminalFilterOptions {
  dateValue: string[];
  terLogTypeValue: number | string | undefined;
  terminalTypeValue: number | string | undefined;
}

export const icuDevTypesMap = {
  icu_family: '探视家属分机',
  icu_host: '探视医护主机',
  icu_sickbed: '探视病床分机',
  icu_guard: '探视门禁',
};

export const icuDevTypes = [
  {
    label: '探视家属分机',
    value: 'icu_family',
  },
  {
    label: '探视医护主机',
    value: 'icu_host',
  },
  {
    label: '探视病床分机',
    value: 'icu_sickbed',
  },
  // {
  //   label: '探视门禁',
  //   value: 'icu_guard',
  // },
];

export const allIcuTypesMap = {
  call: '呼叫',
  answer: '接听',
  hang: '挂断',
  update: '编辑',
  whisper: '插话',
  agree: '通过',
  disagree: '不通过',
  apply_video: '申请探视',
  apply_delay: '申请加时',
};

export const allIcuTypes = [
  {
    label: '呼叫',
    value: 'call',
  },
  {
    label: '接听',
    value: 'answer',
  },
  {
    label: '挂断',
    value: 'hang',
  },
  {
    label: '编辑',
    value: 'update',
  },
  {
    label: '插话',
    value: 'whisper',
  },
  {
    label: '通过',
    value: 'agree',
  },
  {
    label: '不通过',
    value: 'disagree',
  },
  {
    label: '申请探视',
    value: 'apply_video',
  },
  {
    label: '申请加时',
    value: 'apply_delay',
  },
];

export const icuHostTypes = [
  {
    label: '呼叫',
    value: 'call',
  },
  {
    label: '接听',
    value: 'answer',
  },
  {
    label: '挂断',
    value: 'hang',
  },
  {
    label: '编辑',
    value: 'update',
  },
  {
    label: '插话',
    value: 'whisper',
  },
  {
    label: '通过',
    value: 'agree',
  },
  {
    label: '不通过',
    value: 'disagree',
  },
];

export const icuSickTypes = [
  {
    label: '呼叫',
    value: 'call',
  },
  {
    label: '接听',
    value: 'answer',
  },
];

export const icuFamilyTypes = [
  {
    label: '申请探视',
    value: 'apply_video',
  },
  {
    label: '申请加时',
    value: 'apply_delay',
  },
  {
    label: '挂断',
    value: 'hang',
  },
];
