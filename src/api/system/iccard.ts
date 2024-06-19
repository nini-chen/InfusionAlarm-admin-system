import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  GET_IC_LIST = '/api/v2/door/iccard_lists',
  CHANGE_IC_STATUS = '/api/v2/door/change_iccard',
  EDIT_IC = '/api/v2/door/iccard',
  ICCARD_DEMO = '/api/v2/door/down_iccard_demo',
  IMPORT_DEMO = '/api/v2/door/import_iccard',
  GET_SERVER_CONFIG = '/api/v2/door/face_config',
  EDIT_SERVER_CONFIG = '/api/v2/door/face_config',
}

/**
 * @description: 获取ic列表
 */
export const getICCardList = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_IC_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 更改ic状态
 */
export const changeICStatus = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.CHANGE_IC_STATUS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 编辑ic卡
 */
export const editICStatus = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.EDIT_IC,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 下载导入模板
 */
export const downICCardDemo = (params: any = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.ICCARD_DEMO,
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
 * @description: 导入模板
 */
export const uplaodICCardDemo = (data: any = {}, mode: ErrorMessageMode = 'none') => {
  return defHttp.post(
    {
      url: Api.IMPORT_DEMO,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 服务器配置
 */
export const getServerConfig = (params: any = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_SERVER_CONFIG,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 服务器配置
 */
export const setServerConfig = (data: any = {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.GET_SERVER_CONFIG,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
};
