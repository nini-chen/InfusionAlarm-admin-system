import otherIcon from '/@/assets/images/male0.png';
import manIcon from '/@/assets/images/male1.png';
import womanIcon from '/@/assets/images/male2.png';
import noBody from '/@/assets/images/no-body.png';

// 呼叫状态值（此处对接MQTT的返回值）
export enum CallStatusEnum {
  // 离线
  CALL_OFF = 0,
  // 在线（空闲）
  NO_CALL = 1,
  // 在线（洗手间报警）
  WC_WARNING = 6,
}

// 呼叫状态对应的房间卡片背景颜色
export enum CallBgEnum {
  // 离线
  CALL_OFF = '#E0E0E0',
  // 默认颜色
  NO_CALL = 'linear-gradient(180deg, #DAE6F5 0%, #DAE6F5 100%);',
  // 洗手间报警颜色
  WC_WARNING = 'linear-gradient(180deg, #FF4F4F 0%, #FFE3E1 100%);',
}

// 呼叫状态对应的房间名称颜色
export enum RoomTitleColorEnum {
  // 离线
  CALL_OFF = '#4880FF',
  // 默认颜色
  NO_CALL = '#4880FF',
  // 洗手间报警颜色
  WC_WARNING = '#B23C3C',
}

// 呼叫状态描述
export enum CallLabelEnum {
  CALL_OFF = '设备离线！',
  WC_WARNING = '洗手间报警中', // 默认提示，如果后端有返回提示，则用后端返回的
}

// 呼叫状态图标颜色
export enum CallIconColorEnum {
  // 离线
  CALL_OFF = '#9C9C9C',
  WC_WARNING = '#FF4F4F',
}

// 呼叫状态文本背景颜色
export enum CallLabelBgEnum {
  // 离线
  CALL_OFF = '#9C9C9C',
  WC_WARNING = '#B23C3C',
}

export const BedOptions = {
  // 离线状态
  callOff: {
    textColor: '#fff',
    textBg: '#9C9C9C',
    icon: otherIcon,
    iconBg: '#EEEEEE',
  },
  // 空闲状态,绿色系
  noCall: {
    textColor: '#fff',
    textBg: '#13B3A6',
    icon: noBody,
    iconBg: '#E7FFFD',
  },
  // 在线: 男性
  man: {
    textColor: '#000',
    textBg: '#DAE6F5',
    icon: manIcon,
    iconBg: '#F3F7FF',
  },
  // 在线: 女性
  woman: {
    textColor: '#000',
    textBg: '#DAE6F5',
    icon: womanIcon,
    iconBg: '#FFEAF2',
  },
};
