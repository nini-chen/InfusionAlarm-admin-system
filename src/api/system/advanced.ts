import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  BackLightListResModel,
  AddBackLightResModel,
  GetDeviceListResModel,
  EditBackLightResModel,
  DelDeviceListResModel,
  SetPrivacyResModel,
  GetPrivacyResModel,
} from './model/advancedModel';

enum Api {
  GET_BACKLIGHT_LIST = '/api/v2/backlight/lists',
  ADD_BACKLIGHT = '/api/v2/backlight/one',
  GET_DEVICE_LIST = '/api/v2/device/getAllDevice',
  SET_PRIVACY = '/api/v2/privacy/one',
  SET_BACKLIGHT = '/api/v2/backlight/editTime',
}

/**
 * @description 背光设置列表
 */
export const getBackLightList = (
  params: BackLightListResModel,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get(
    {
      url: Api.GET_BACKLIGHT_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 添加背光
 */
export const addBackLight = (params: AddBackLightResModel, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.ADD_BACKLIGHT,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 编辑背光
 */
export const editBackLight = (
  params: EditBackLightResModel,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.put(
    {
      url: Api.ADD_BACKLIGHT,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 删除背光
 */
export const delBackLight = (params: DelDeviceListResModel, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete(
    {
      url: Api.ADD_BACKLIGHT,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 批量编辑时间
 */
export const editBackLightTime = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.SET_BACKLIGHT,
      params,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: true,
    },
  );
};

/**
 * @description 筛选设备列表
 */
export const getDeviceList = (
  params: GetDeviceListResModel,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get(
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
 * @description 隐私设置
 */
export const setPrivacy = (params: SetPrivacyResModel, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.SET_PRIVACY,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 隐私设置获取
 */
export const getPrivacy = (params: GetPrivacyResModel, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.SET_PRIVACY,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};
