import { BasicColumn } from '/@/components/Table';

export const listColumns: BasicColumn[] = [
  {
    title: '病区编号',
    dataIndex: 'partition_code',
  },

  {
    title: '病区名称',
    dataIndex: 'partition_name',
  },

  {
    title: '病区唯一编码',
    dataIndex: 'area_code',
  },

  {
    title: '医护主机数量',
    dataIndex: 'medical_host_num',
  },

  {
    title: '病房数量',
    dataIndex: 'hospital_room_num',
  },

  {
    title: '终端设备数量',
    dataIndex: 'device_num',
  },
];
