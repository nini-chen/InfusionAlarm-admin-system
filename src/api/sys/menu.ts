import { defHttp } from '/@/utils/http/axios';
import {
  getMenuListResultModel,
  DeviceRecord,
  OfflineParams,
  OfflineDeviceResult,
} from './model/menuModel';

enum Api {
  GetMenuList = '/getMenuList',
  GET_OFF_DEVICES = '/api/v2/device/getOutLineDeviceList',
  GET_ALL_DEVICE = '/api/v2/device/getAllDeviceList',
}

/**
 * @description: Get user menu based on id
 */
export const getMenuList = () => {
  return defHttp.get<getMenuListResultModel>({ url: Api.GetMenuList });
};

/**
 * @description: 页面顶部栏-设备离线-获取所有的设备数据（包括病床分机和sos）
 */
export const getAllDevicesApi = () => {
  return defHttp.get<DeviceRecord[]>({ url: Api.GET_ALL_DEVICE }, { errorMessageMode: 'none' });
};

/**
 * @description: 页面顶部栏-设备离线-获取所有的离线设备
 */
export const getOfflineDevicesApi = (params?: OfflineParams) => {
  return defHttp.get<OfflineDeviceResult>(
    {
      url: Api.GET_OFF_DEVICES,
      params,
    },
    { errorMessageMode: 'none' },
  );
};
