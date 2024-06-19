/*
 * @Author: 朱开 1396509050@qq.com
 * @Date: 2022-06-01 14:40:59
 * @LastEditors: 朱开 1396509050@qq.com
 * @LastEditTime: 2022-07-21 10:44:37
 * @FilePath: \医疗vben简化版\MedicalIntercomSystem_PCWeb_Vue\src\views\record\managed\data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    slots: { customRender: 'index' },
  },
  {
    title: '托管方',
    dataIndex: 'call_name',
    ellipsis: true,
  },
  {
    title: '被托管方',
    dataIndex: 'called_name',
    ellipsis: true,
  },
  {
    title: '开始时间',
    dataIndex: 'start_time',
    ellipsis: true,
    slots: { customRender: 'start' },
  },
  {
    title: '结束时间',
    dataIndex: 'end_time',
    key: 'address',
    ellipsis: true,
    slots: { customRender: 'end' },
  },
  {
    title: '托管时长',
    dataIndex: 'length',
    ellipsis: true,
    slots: { customRender: 'length' },
  },
  {
    title: '托管状态',
    dataIndex: 'agent_status',
    ellipsis: true,
    slots: { customRender: 'status' },
  },
];

export const manageTypeOptions = [
  {
    value: 1,
    label: '托管中',
  },
  {
    value: 2,
    label: '已结束',
  },
];

export interface FilterOptions {
  dateValue: string[];
  statusValue: string | number | undefined;
}
