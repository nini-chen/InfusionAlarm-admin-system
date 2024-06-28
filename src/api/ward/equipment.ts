// 架构管理-设备管理模块

import { defHttp } from '/@/utils/http/axios';
import {
  DeviceListSearchParams,
  DeviceListResult,
  BindDeviceParams,
  ICUFreeNumberSearchParams,
  ICURoomSelectParams,
  ICURoomSelectOption,
  ICCardSearchParams,
  ICCardListResult,
  ICCardDeleteParams,
  ICCardEditParams,
} from './model/equipmentModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  GET_DEVICE_LIST = '/api/v2/device/getDeviceList',
  SAVE_DEVICE = '/api/v2/device/saveDevice',
  GET_ONILE_LIST = '/api/v2/device/getOutLineDeviceList',
  UNBIND_DEVICE = '/api/v2/device/unbindDevice',
  BIND_DEVICE = '/api/v2/device/bindDevice',
  BIND_ICU_DEVICE = '/api/v2/device/bindIcuDevice',
  GET_DEVICE_SICKBED = '/api/v2/device/getDeviceSickbed',
  GET_DEVICE_SOS = '/api/v2/device/getDeviceSos',
  GET_ALL_BED = '/api/v2/partition/getAllHospitalBed',
  BIND_SICK_BED = '/api/v2/device/bindDeviceSickbed',
  BIND_DEVICE_SOS = '/api/v2/device/bindDeviceSos',
  ADD_PASSAGEWAY_DEVICE = '/api/v2/device/addPassagewayDevice',
  PUT_PASSAGEWAY_DEVICE = '/api/v2/device/savePassagewayDevice',
  DELETE_DEVICE = '/api/v2/device/delDevice',
  GET_SWITCH = '/api/v2/device/getSwitch',

  GET_ICU_BED_FREE = '/api/v2/partition/getIcuCanBinNum',
  GET_ICU_ROOM_SELECT = '/api/v2/partition/getAllHospitalRoom',

  IC_CARD_LIST = '/api/v2/door/iccard_lists',
  IC_CARD_DELETE = '/api/v2/door/iccard',
  IC_CARD_EDIT = '/api/v2/door/iccard',
  ICU_UNBIND_DEVICE = '/api/v2/device/unbindIcuDevice',
  DEVICE_RESET_PWD = '/api/v2/device/resetDevicePassword',
}

/**
 * @description: 获取设备列表
 */
export const getDeviceList = (
  params: DeviceListSearchParams,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get<DeviceListResult>(
    {
      url: Api.GET_DEVICE_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 获取离线设备列表
 */
export const getOnlineList = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_ONILE_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 绑定设备
 */
export const bindDeviceApi = (
  params: {
    isICU: boolean;
    data: BindDeviceParams;
  },
  mode: ErrorMessageMode = 'message',
) => {
  const url = params.isICU ? Api.BIND_ICU_DEVICE : Api.BIND_DEVICE;
  return defHttp.put(
    {
      url,
      data: params.data,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 根据音频转发器id获取病床分机
 */
export const getDeviceSickbed = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_DEVICE_SICKBED,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 根据音频转发器id获取卫生间紧急呼叫机
 */
export const getDeviceSos = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_DEVICE_SOS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 根据病房获取病床
 */
export const getAllHospitalBed = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_ALL_BED,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 绑定病床分机到床位
 */
export const bindDeviceSickbed = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.BIND_SICK_BED,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 绑定sos
 */
export const bindDeviceSos = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.BIND_DEVICE_SOS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 添加走廊屏
 */
export const addPassagewayDevice = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.ADD_PASSAGEWAY_DEVICE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 修改走廊屏
 */
export const putPassagewayDevice = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.PUT_PASSAGEWAY_DEVICE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 删除设备
 */
export const deleteDeviceByIdApi = (params: { id: String }, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete(
    {
      url: Api.DELETE_DEVICE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 根据病床分机或sos 的id 获取音频交换机信息
 */
export const getSwitch = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_SWITCH,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 设备管理修改设备
 */
export const saveDevice = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.SAVE_DEVICE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * 解绑设备
 * @description: 普通设备、ICU设备的都用此接口
 * @param {Object} params
 * @param {boolean} isICUDevice
 */
export const unbindDevice = (params, isICUDevice: boolean) => {
  return defHttp.delete({
    url: isICUDevice ? Api.ICU_UNBIND_DEVICE : Api.UNBIND_DEVICE,
    params,
  });
};

/**
 * 绑定ICU设备-获取家属分机、病床分机的病房
 */
export const getRoomSelectApi = (params: ICURoomSelectParams) =>
  defHttp.get<ICURoomSelectOption[]>({ url: Api.GET_ICU_ROOM_SELECT, params });

/**
 * 绑定ICU设备-获取家属分机、病床分机的病房 下面的未绑定的病床或分机
 */
export const getICUFreeBedOrExtApi = (params: ICUFreeNumberSearchParams) =>
  defHttp.get({
    url: Api.GET_ICU_BED_FREE,
    params,
  });

/**
 * @description: ICU智能门禁管理-IC卡列表
 */
export const getICCardListApi = (params: ICCardSearchParams) =>
  defHttp.get<ICCardListResult>({ url: Api.IC_CARD_LIST, params });

/**
 * @description: ICU智能门禁管理-IC卡列表-删除ICU卡
 */
export const deleteICCardApi = (params: ICCardDeleteParams) =>
  defHttp.delete({ url: Api.IC_CARD_DELETE, params });

/**
 * @description: ICU智能门禁管理-IC卡列表-编辑
 */
export const editICCardApi = (data: ICCardEditParams) =>
  defHttp.put<boolean>({ url: Api.IC_CARD_EDIT, data });

/**
 * @description: 设备编辑-重置设备密码
 */
export const resetDevicePwdApi = (data: { device_mac: string }) =>
  defHttp.post<boolean>({ url: Api.DEVICE_RESET_PWD, data });
