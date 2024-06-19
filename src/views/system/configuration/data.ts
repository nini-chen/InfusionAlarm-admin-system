/*排班类型后端返回类型*/
export interface ScTypeItem {
  schedulingtype_name: string /*类型名称*/;
  schedulingtype_population: number | string /*所属人群*/;
  schedulingtype_is_managebed: number /*是否管床*/;
  schedulingtype_managebed_range: string /*管床范围*/;
  schedulingtype_partition: string | number /*所属病区*/;
  schedulingtype_starttime: string /*开始时间*/;
  schedulingtype_endtime: string /*结束时间*/;
  schedulingtype_timesting: string;
  managebed_list: string;
  id: number | string;
}

/*排班类型列*/
export const ScTypeColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    align: 'center',
    slots: { customRender: 'index' },
  },
  {
    title: '类型名称',
    align: 'center',
    dataIndex: 'schedulingtype_name',
  },
  {
    title: '所属人群',
    align: 'center',
    dataIndex: 'schedulingtype_population',
    slots: { customRender: 'position' },
  },
  {
    title: '值班时段',
    align: 'center',
    dataIndex: 'schedulingtype_timesting',
  },
  {
    title: '是否预设管床',
    align: 'center',
    dataIndex: 'schedulingtype_is_managebed',
    slots: { customRender: 'bed' },
  },
  {
    title: '预设管床范围',
    align: 'center',
    dataIndex: 'schedulingtype_managebed_range',
    slots: { customRender: 'prebed' },
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'op',
    slots: { customRender: 'op' },
  },
];

/*职级权重配置列*/
export const PositionColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    align: 'center',
    width: 80,
    slots: { customRender: 'index' },
  },
  {
    title: '职级名称',
    align: 'center',
    dataIndex: 'position_name',
  },
  {
    title: '类型',
    align: 'center',
    dataIndex: 'position_type',
    slots: { customRender: 'postype' },
  },
  {
    align: 'center',
    title: '权重',
    dataIndex: 'position_order',
  },
  {
    title: '备注',
    align: 'center',
    dataIndex: 'position_remarks',
    slots: { customRender: 'remarks' },
  },
  {
    title: '操作',
    align: 'center',
    dataIndex: 'op',
    slots: { customRender: 'op' },
  },
];
