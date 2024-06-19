// 设备状态 0离线  1空闲   4对讲中
export enum DeviceStatusEnum {
  // 离线
  OFF = 0,
  // 空闲
  FREE = 1,
  // 对讲中
  CALLING = 4,
}

// 设备卡片类名
export enum DeviceStatusClass {
  OFF = 'family-device-off',
  FREE = 'family-device-free',
  CALLING = 'family-device-calling',
}

export enum DeviceStatusLabelsEnum {
  OFF = '设备离线！',
  FREE = '空闲',
  CALLING = '对讲中',
}

export enum DeviceStatusIconsEnum {
  OFF = 'device-off',
  FREE = '',
  CALLING = 'user-calling',
}

export enum DeviceStatusColorsEnum {
  OFF = '#9C9C9C',
  FREE = '',
  CALLING = 'rgba(0,0,0,0.3)',
}
