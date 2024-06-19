import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { CallResModal, DeviceResModal, IcuCallResModal, IcuCaller } from './model/callModal';

enum Api {
  GET_CALL_LIST = '/api/v2/call/lists',
  GET_DEVICE_LIST = '/api/v2/device/getAllDevice',
  GET_ICU_CALL_LIST = '/api/v2/kin/getIcuMessageHistory',
  GET_ICU_CALLER = '/api/v2/kin/getIcuALLCallName',
}

/**
 * @description
 */
export const getCallList = (params: CallResModal, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_CALL_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description
 */
export const getIcuCallList = (params: IcuCallResModal, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_ICU_CALL_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description
 */
export const getDeviceList = (params: DeviceResModal, mode: ErrorMessageMode = 'message') => {
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
 * @description
 */
export const getIcuCaller = (params: IcuCaller, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_ICU_CALLER,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};
