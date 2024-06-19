import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { getWeblogListModel } from './model/weblogModel';

enum Api {
  GET_WEBLOG_LIST = '/api/v2/weblog/lists',
  GET_TER_LIST = '/api/v2/terminallog/lists',
  TER_LOG = '/api/v2/terminallog/listsexcel',
  WEB_LOG = '/api/v2/weblog/listsexcel',
}

/**
 * @description 系统日志
 */
export const getweblogList = (params: getWeblogListModel, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_WEBLOG_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 设备日志
 */
export const getwterlogList = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_TER_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 获取设备日志excel
 */
export const getTerLog = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.TER_LOG,
      params,
      responseType: 'blob',
    },
    {
      errorMessageMode: mode,
      isReturnNativeResponse: true,
    },
  );
};

/**
 * @description 获取web日志excel
 */
export const getWebLog = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.WEB_LOG,
      params,
      responseType: 'blob',
    },
    {
      errorMessageMode: mode,
      isReturnNativeResponse: true,
    },
  );
};
