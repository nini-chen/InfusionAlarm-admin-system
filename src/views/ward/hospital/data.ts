import { BasicColumn } from '/@/components/Table';

export const listColumns: BasicColumn[] = [
  {
    title: '分区编号',
    dataIndex: 'partition_code',
  },

  {
    title: '分区名称',
    dataIndex: 'partition_name',
  },

  {
    title: '分区编码',
    dataIndex: 'area_code',
  },

  {
    title: '接收器数量',
    dataIndex: 'medical_host_num',
  },

  {
    title: '输液报警器数量',
    dataIndex: 'hospital_room_num',
  },

  // {
  //   title: '终端设备数量',
  //   dataIndex: 'device_num',
  // },
];
