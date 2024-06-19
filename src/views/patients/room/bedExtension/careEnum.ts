import otherIcon from '/@/assets/images/male0.png';
import manIcon from '/@/assets/images/male1.png';
import womanIcon from '/@/assets/images/male2.png';

// 呼叫状态值（此处对接MQTT的返回值）
export enum CallStatusEnum {
  // 离线
  CALL_OFF = 0,
  // 空闲
  NO_CALL = 1,
  // 对讲中
  CALLING = 4,
}

// 呼叫状态对应的床位卡片背景颜色
export enum CallBgEnum {
  // 离线
  CALL_OFF = '#E0E0E0',
  // 默认颜色
  NO_CALL = 'linear-gradient(180deg, #DAE6F5 0%, #DAE6F5 100%);',
  // 呼叫中颜色
  CALLING = 'linear-gradient(180deg, #4880FF 0%, #DAE6F5 100%);',
}

// 呼叫状态图标颜色
export enum CallIconColorEnum {
  // 离线
  CALL_OFF = '#9C9C9C',
  // 对讲中
  CALLING = '#5488FE',
}

// 呼叫状态文本背景颜色
export enum CallLabelBgEnum {
  // 离线
  CALL_OFF = '#9C9C9C',
  // 对讲中
  CALLING = '#3C60B1',
}

// 呼叫状态描述
export enum CallLabelEnum {
  CALL_OFF = '设备离线！',
  CALLING = '对讲中',
}

// 护理级别取值（对应后端的返回值id字段）
export enum CareLevelEnum {
  LEVEL_SPECIAL = 2,
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
}

// 护理级别简称
export enum CareLabelEnum {
  LEVEL_SPECIAL = '特',
  LEVEL_1 = '一',
  LEVEL_2 = '二',
  LEVEL_3 = '三',
}

// 护理级别简称
export const MaleOptions = [
  {
    value: '1',
    label: '男',
    icon: manIcon,
    color: '#EAF3FF',
  },
  {
    value: '2',
    label: '女',
    icon: womanIcon,
    color: '#FFEAF2',
  },
  {
    value: '3',
    label: '其他',
    icon: otherIcon,
    color: '#EAF3FF',
  },
];

// 下拉菜单
export enum MangeMenu {
  EDIT,
  LEAVE,
  CHANGE_BED,
  ADD_ADVICE,
  REGISTER,
}

// 护理颜色
export const colorSettings = [
  '#FF4F4F',
  '#F5667E',
  '#F56696',
  '#F566AE',
  '#F566C7',
  '#F566DE',
  '#BC66BC',
  '#9E6DA8',

  '#C666F5',
  '#AE66F5',
  '#9966FF',
  '#8066FF',
  '#6767F0',
  '#677EF1',
  '#6895F2',
  '#4880FF',

  '#67ACF1',
  '#66D1E7',
  '#51CBCB',
  '#5BDAC5',
  '#4CD5A7',
  '#4CC88A',
  '#4ED97D',
  '#13B3A6',

  '#59DA59',
  '#7EE869',
  '#89DE5D',
  '#99D161',
  '#BAE466',
  '#BDD351',
  '#C6DE4A',
  '#B1D037',

  '#EAC300',
  '#F0B94C',
  '#F09E4C',
  '#F59F13',
];

export const setCareLevelColor = (colorVal: number | string) => {
  const inx = Number(colorVal) - 1;
  return colorSettings[inx] || colorSettings[0];
};
