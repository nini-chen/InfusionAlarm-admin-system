// todo:  安卓版分级和安卓版走廊屏

export const callType = [
  {
    label: '呼叫增援',
    value: 'assist',
  },
  {
    label: '普通呼叫',
    value: 'call',
  },
  {
    label: '换液换药提醒',
    value: 'warn',
  },
  {
    label: '洗手间报警',
    value: 'sos',
  },
];

export const callHashMap = {
  assist: '呼叫增援',
  call: '普通呼叫',
  warn: '换液换药提醒',
  sos: '洗手间报警',
};

/*完整type*/
export const doType = [
  {
    label: '接听',
    value: 3,
  },
  {
    label: '拒接',
    value: 4,
  },
  {
    label: '取消',
    value: 6,
  },
  {
    label: '复位',
    value: 7,
  },
  {
    label: '未知',
    value: 8,
  },
];
/*联动type call || assist || warn*/
export const filterCallType = [
  {
    label: '接听',
    value: 3,
  },
  {
    label: '拒接',
    value: 4,
  },
  {
    label: '取消',
    value: 6,
  },
  {
    label: '未知',
    value: 8,
  },
];
/*联动type sos*/
export const sosType = [
  {
    label: '复位',
    value: 7,
  },
  {
    label: '未知',
    value: 8,
  },
];

export const doHashMap = {
  3: '接听',
  4: '拒接',
  6: '取消',
  7: '复位',
  8: '未知',
};

export const icuHandleType = [
  {
    label: '接听',
    value: 'answer',
  },
  {
    label: '拒接',
    value: 'hangup',
  },
];

export const icuHandleHashMap = {
  answer: '接听',
  hangup: '拒接',
};

export const icuCallType = [
  {
    label: '门禁呼叫',
    value: 'icu_guard',
  },
  {
    label: '普通呼叫',
    value: 'normal',
  },
];

export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    slots: { customRender: 'index' },
    align: 'center',
  },
  {
    title: '呼叫时间',
    dataIndex: 'addtime_format',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '处理时间',
    dataIndex: 'do_time_format',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '通话时长',
    dataIndex: 'length_format',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '呼叫类型',
    dataIndex: 'type',
    ellipsis: true,
    slots: { customRender: 'type' },
    align: 'center',
  },
  {
    title: '处理方式',
    dataIndex: 'do_value_format',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '主叫方名称',
    dataIndex: 'from_name',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '处理方名称',
    dataIndex: 'do_name',
    ellipsis: true,
    align: 'center',
  },
];

export const icucolumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    slots: { customRender: 'index' },
    align: 'center',
  },
  {
    title: '呼叫时间',
    dataIndex: 'call_ts',
    ellipsis: true,
    slots: { customRender: 'call_ts' },
    align: 'center',
  },
  {
    title: '处理时间',
    dataIndex: 'handle_ts',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '通话时长',
    dataIndex: 'visit_duration',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '呼叫类型',
    dataIndex: 'call_type',
    ellipsis: true,
    slots: { customRender: 'call_type' },
    align: 'center',
  },
  {
    title: '处理方式',
    dataIndex: 'handle_type',
    ellipsis: true,
    align: 'center',
    slots: { customRender: 'handle_type' },
  },
  {
    title: '主叫方名称',
    dataIndex: 'caller_name',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '处理方名称',
    dataIndex: 'callee_name',
    ellipsis: true,
    align: 'center',
  },
];

export const IcuCallTypeHashMap = {
  icu_guard: '门禁呼叫',
  normal: '普通呼叫',
};

export interface FilterOptions {
  dateValue: string[];
  callTypeValue: string | number | undefined;
  operateTypeValue: number | string | undefined;
  callFromValue: string | undefined;
}
