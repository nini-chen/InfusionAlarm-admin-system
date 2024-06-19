export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    align: 'center',
    slots: { customRender: 'index' },
  },
  {
    title: '持卡人',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    align: 'center',
  },
  {
    title: '卡号',
    dataIndex: 'code',
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
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
