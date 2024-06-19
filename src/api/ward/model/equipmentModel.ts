import { BasicFetchResult } from '/@/api/model/baseModel';

// 医院管理-设备管理模块 接口声明
export interface DeviceListSearchParams {
  page_index: number | string;
  page_size: number | string;
  partition_id?: number | string;
  device_type?: number | string;
  is_binding?: number | string;
}

/**
 * @description 设备列表返回值项
 */
export interface DeviceListRecord {
  agent: {};
  area_code: string;
  bed_id: number;
  bed_name: string;
  bindtime: number;
  // 是否允许删除设备
  can_delete: boolean;
  default_word: string;
  device_channel: number;
  // 编码
  device_code: string;
  device_gateway: string;
  device_ip: string;
  device_mac: string;
  // 设备名
  device_name: string;
  device_online_status: number;
  device_subnet_mask: string;
  device_type: string;
  flag: number;
  height: number;
  http_port: string;
  // 设备id
  id: number;
  mqtt_port: string;
  numname: string;
  online_time: string;
  // 序号（病床，家属分机这一项必填）
  order_num: number;
  // 病区id (0 说明未绑定病区)
  partition_id: number;
  partition_name: string;
  platform_ip: string;
  // 备注
  remarks: string;
  // 设备位置
  room_id: number;
  room_name: string;
  sn: string;
  timestamp: string;
  uId: number;
  // 版本号
  version: string;
  width: number;
}

/**
 * @description: 终端设备列表-返回值
 */
export type DeviceListResult = BasicFetchResult<DeviceListRecord>;

/**
 * @description 绑定ICU传参
 */
export interface BindDeviceParams {
  // 设备id
  id: number;
  // 病区id
  partition_id: number;
  // 序号（病床，家属分机这一项必填）
  order_num?: number;
  // 设备位置
  room_id?: number;
  // 备注
  remarks: string;
  // 编码
  device_code: number;
  // 设备名
  device_name: string;
}

/**
 * @description ICU设备可使用的床号或者分机号传参
 */
export interface ICUFreeNumberSearchParams {
  // 病区id
  partition_id: number;
  // 病房id 病床分机或家属分机病房的id
  room_id: number;
  // 类型  1：将已经绑定了家属分级的序号去掉   0：获取所有序号
  type: number;
}

/**
 * @description: ICU病房-所有病房select框参数
 */
export interface ICURoomSelectParams {
  partition_id: number;
  // 1:探视间  0：普通病房   不发这个参数则获取所有病房
  is_kin?: number;
}

/**
 * @description: ICU病房-所有病房select框返回值选项
 */
export interface ICURoomSelectOption {
  id: number;
  hospital_room_name: string;
  is_bind: number;
  is_bind_icu: number;
}

/**
 * @description ICU-IC卡列表搜索条件参数
 */
export interface ICCardSearchParams {
  partition_id: number;
}

/**
 * @description ICU-IC卡列表选项
 */
export interface ICCardListRecord {
  id: number;
  code: number;
  name: string;
}

export type ICCardListResult = BasicFetchResult<ICCardListRecord>;

/**
 * @description ICU-IC卡列表-删除
 */
export interface ICCardDeleteParams {
  card_code: number;
}

/**
 * @description ICU-IC卡编辑
 */
export interface ICCardEditParams {
  card_code: number;
  card_name: string;
}
