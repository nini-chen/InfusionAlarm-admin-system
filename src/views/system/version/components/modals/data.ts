/*
 * @Author: 朱开 1396509050@qq.com
 * @Date: 2022-05-26 14:44:09
 * @LastEditors: 朱开 1396509050@qq.com
 * @LastEditTime: 2023-08-15 17:40:01
 * @FilePath: \医疗vben简化版\MedicalIntercomSystem_PCWeb_Vue\src\views\system\version\components\modals\data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export const deviceType = {
  guard: '门禁',
  bbs: '信息看板屏',
  nurse: '智慧护理屏',
  sickbed: '病床分机',
  host: '医护主机',
  // guest: '医护分机',
  web: 'PC WEB端 ',
  switch: '音频转发器',
  doorway: '病房门口机',
  icu_sickbed: '探视病床分机',
  icu_family: '探视家属分机',
  icu_host: '探视医护主机',
  icu_guard: '智能门禁',
  apk_sickbed: '安卓版病床分机',
  apk_passageway: '安卓版走廊屏',
  other: '其他设备',
};

export const deviceTypeList = [
  {
    label: '信息看板屏',
    value: 'bbs',
  },
  {
    label: '智慧护理屏',
    value: 'nurse',
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
    label: '音频转发器',
    value: 'switch',
  },
  {
    label: '探视家属分机',
    value: 'icu_family',
  },
  {
    label: '探视医护主机',
    value: 'icu_host',
  },
  {
    label: '智能门禁',
    value: 'icu_guard',
  },
  {
    label: '探视病床分机',
    value: 'icu_sickbed',
  },
  {
    label: '安卓版病床分机',
    value: 'apk_sickbed',
  },
  {
    label: '安卓版走廊屏',
    value: 'apk_passageway',
  },
  {
    label: '其他设备',
    value: 'other',
  },
];

export const columns = [
  {
    title: '所属病区',
    dataIndex: 'partition_name',
  },
  {
    title: '设备名称',
    dataIndex: 'device_name',
  },
  {
    title: '升级状态',
    dataIndex: 'upgrade_status',
    slots: { customRender: 'update' },
  },
  {
    title: '操作',
    dataIndex: 'op',
    slots: { customRender: 'op' },
  },
];

export const versionColumn = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    align: 'center',
    slots: { customRender: 'index' },
  },
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '上传人',
    dataIndex: 'user_name',
    align: 'center',
  },
  // {
  //   title: '备注',
  //   dataIndex: 'comment',
  //   ellipsis: true,
  //   align: 'center',
  // },
  {
    title: '管理',
    dataIndex: 'op',
    align: 'center',
    slots: { customRender: 'op' },
  },
];
