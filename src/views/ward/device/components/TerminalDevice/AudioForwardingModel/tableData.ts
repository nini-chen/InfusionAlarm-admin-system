// import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';


/** 病床分机table列配置 */
export function getBedColumns(): BasicColumn[] {
  return [
    {
      title: '通道',
      width: 150,
      dataIndex: 'pip',
      sorter: true,
      sortOrder: 'ascend',
    },
    {
      title: '设备位置',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '设备名称',
      dataIndex: 'address',
    },
    {
      title: '设备编号',
      dataIndex: 'no',
      width: 80,
    },
  ];
}


/** 洗手间table列配置 */
export function getToiletColumns(): BasicColumn[] {
  return [
    {
      title: '接口',
      width: 150,
      dataIndex: 'pip',
      sorter: true,
      sortOrder: 'ascend',
    },
    {
      title: '设备位置',
      dataIndex: 'name',
      width: 120,
    },
    {
      title: '设备名称',
      dataIndex: 'address',
    },
    {
      title: '设备编号',
      dataIndex: 'no',
      width: 80,
    },
  ];
}