export const approvalColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    slots: { customRender: 'index' },
    align: 'center',
  },
  {
    title: '家属姓名',
    dataIndex: 'name',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '患者姓名',
    dataIndex: 'patient_name',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '家属电话',
    dataIndex: 'phone',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '关系',
    dataIndex: 'relation',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '申请时间',
    dataIndex: 'create_time',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '预约时间',
    dataIndex: 'datetime',
    ellipsis: true,
    slots: { customRender: 'datetime' },
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'state_name',
    ellipsis: true,
    slots: { customRender: 'state' },
    align: 'center',
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
    title: '患者姓名',
    dataIndex: 'patient_name',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '病房和床位',
    dataIndex: 'bed_room',
    ellipsis: true,
    slots: { customRender: 'bed_room' },
    align: 'center',
  },
  {
    title: '探视时间',
    dataIndex: 'visit_time',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '探视时长',
    dataIndex: 'visit_duration',
    ellipsis: true,
    align: 'center',
  },
  {
    title: '录音录像',
    dataIndex: 'record',
    slots: { customRender: 'record' },
    ellipsis: true,
    align: 'center',
  },
];

export interface FilterOptions {
  dateValue: string[];
  keyword: string;
  state: string;
}
