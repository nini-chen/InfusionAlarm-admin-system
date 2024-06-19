import type { RouteMeta } from 'vue-router';
export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

/**
 * @description: Get menu return value
 */
export type getMenuListResultModel = RouteItem[];

/**
 * @description: 获取所有设备-单个设备数据
 */
export interface DeviceRecord {
  device_id: number;
  device_name: string;
  device_mac: string;
  partition_name: string;
  room_name: string;
  bed_name: string;
}

/**
 * @description: 获取离线设备参数
 */
export interface OfflineParams {
  page_size?: number;
  page_index?: number;
  device_type?: number;
  keyword?: string;
}
/**
 * @description: 获取所有离线设备-单个离线设备数据
 */
export interface OfflineDeviceResult {
  data_sum: number;
  page_size: number;
  page_index: number;
  data: any;
}
