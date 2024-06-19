/*
 * @Author: 朱开 1396509050@qq.com
 * @Date: 2022-06-01 09:55:19
 * @LastEditors: 朱开 1396509050@qq.com
 * @LastEditTime: 2022-07-27 15:46:46
 * @FilePath: \医疗vben简化版\MedicalIntercomSystem_PCWeb_Vue\src\views\system\advanced\data.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*背光设置配置列*/
export const BackLightColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 80,
    slots: { customRender: 'index' },
  },
  {
    title: '控制设备类型',
    dataIndex: 'device_type',
    slots: { customRender: 'type' },
  },
  {
    title: '白天',
    slots: { customRender: 'day' },
  },
  {
    title: '亮度',
    dataIndex: 'light',
    slots: { customRender: 'daylight' },
  },
  {
    title: '黑夜',
    slots: { customRender: 'night' },
  },
  {
    title: '亮度',
    dataIndex: 'light',
    slots: { customRender: 'nightlight' },
  },
];

export const deviceType = {
  guard: '门禁',
  bbs: '信息看板屏',
  nurse: '智慧护理屏',
  sickbed: '病床分机',
  host: '医护主机',
  passageway: '走廊屏',
  // guest: '医护分机',
  doorway: '病房门口机',
  icu_sickbed: '探视病床分机',
  icu_family: '探视家属分机',
  icu_host: '探视医护主机',
  icu_guard: '智能门禁',
  apk_sickbed: '安卓版病床分机',
  apk_passageway: '安卓版走廊屏',
};

export const deviceTypeList = [
  {
    label: '病房门口机',
    value: 'doorway',
  },
  {
    label: '智慧护理屏',
    value: 'nurse',
  },
  {
    label: '病床分机',
    value: 'sickbed',
  },
  {
    label: '安卓版病床分机',
    value: 'apk_sickbed',
  },
];

export const ICUDeviceTypeList = [
  {
    label: '病房门口机',
    value: 'doorway',
  },
  {
    label: '智慧护理屏',
    value: 'nurse',
  },
  {
    label: '病床分机',
    value: 'sickbed',
  },
  {
    label: '探视病床分机',
    value: 'icu_sickbed',
  },
];
