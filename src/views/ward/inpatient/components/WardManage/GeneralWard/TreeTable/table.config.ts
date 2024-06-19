import { BasicColumn } from '/@/components/Table/src/types/table';
import moment from 'moment';
import { h } from 'vue';

// mac地址选项：
const macRender = ({ record, text }) =>
  ['sos', 'sickbed'].includes(record.device_type) ? '--' : text;

// 设备在线状态选项: 仅限设备; 病房、病床没有此状态
const onlineStatusRender = ({ record, text }) => {
  if (record.datatype != 'device') return;
  const style = text == 0 ? 'color:#FF4D4F;' : 'color:#00C219;';
  const content = text == 0 ? '离线' : '在线';
  return h(
    'span',
    {
      style,
    },
    content,
  );
};

// 通道号选项: 病房门口机、病床分机 这两种类型的设备，才显示通道号
const channelRender = ({ record, text }) =>
  ['passageway', 'sos'].includes(record.device_type) ? '--' : text;

// 添加日期选项: 日期格式化
const dateTimeRender = ({ record, text }) => {
  // 如果是病床、病房， 则此选项留空白
  if (record.datatype != 'device') return;
  // 如果是设备类型 此选项是空值，用-代替
  if (!text) return '--';
  // 如果是设备类型 此选项的值是10位数字（此种情况多是病床分机的日期），需要乘以1000；其他设备日期一般是13位数，直接格式话即可
  const timestamp = String(text)?.length === 10 ? text * 1000 : text;
  return moment(timestamp).format('YYYY-MM-DD');
};

export function getBasicColumns(): BasicColumn[] {
  return [
    {
      align: 'left',
      title: '设备类型',
      dataIndex: 'hospital_room_name',
      fixed: 'left',
    },
    {
      align: 'left',
      title: '设备编号',
      dataIndex: 'device_code',
    },
    {
      align: 'left',
      title: '设备名称',
      dataIndex: 'device_name',
    },
    {
      align: 'left',
      title: 'MAC地址',
      dataIndex: 'device_mac',
      customRender: macRender,
    },
    {
      align: 'left',
      title: 'IP地址',
      dataIndex: 'device_ip',
    },
    {
      align: 'left',
      title: '通道号',
      dataIndex: 'device_channel',
      customRender: channelRender,
      width: 100,
    },
    // {
    //   title: '子网掩码',
    //   width: 150,
    //   dataIndex: 'device_subnet_mask',
    // },
    {
      align: 'left',
      title: '状态',
      dataIndex: 'device_online_status',
      customRender: onlineStatusRender,
      width: 100,
    },
    {
      align: 'left',
      title: '添加日期',
      dataIndex: 'timestamp',
      customRender: dateTimeRender,
      width: 150,
    },
  ];
}
