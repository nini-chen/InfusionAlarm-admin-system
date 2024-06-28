import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import { VersionListResultModal } from './model/versionModal';

enum Api {
  GET_VERTION_LIST = '/api/v2/version/lists',
  UPLOAD = '/api/v2/version/one',
  GET_DEVICE = '/api/v2/device/getAllDevice',
  GET_ICU_DEVICE = '/api/v2/device/getIcuAllDevice',
  GET_ONE = '/api/v2/version/one',
  REUPGRADE = '/api/v2/version/reupgrade',
  DEL_VERSION = '/api/v2/version/one',
  EDIT_VERSION = '/api/v2/version/one',
  APP_FILE_ADD = '/api/v2/version/fileone',
  APP_FILE_DEL = '/api/v2/version/fileone',
  UPGRADE = '/api/v2/version/upgrade',
  APP_CALL_STATUS = '/api/v2/call/app_call_status',
  APP_FILES = '/api/v2/version/filelists',
}

/**
 * @description 版本列表
 */
export const getVersionList = (
  params: VersionListResultModal,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get(
    {
      url: Api.GET_VERTION_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 上传
 */
export const upload = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.UPLOAD,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 获取设备列表
 */
export const getDevice = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_DEVICE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 获取设备列表
 */
export const getIcuDevice = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_ICU_DEVICE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 获取单个设备列表
 */
export const getDeviceOne = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_ONE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 升级单个设备
 */
export const upgrade = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.UPGRADE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 重新升级单个设备列表
 */
export const reUpgrade = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.REUPGRADE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 编辑版本
 */
export const editVersion = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.EDIT_VERSION,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 删除版本
 */
export const delVersion = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete(
    {
      url: Api.DEL_VERSION,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 屏蔽主机挂断  获取
 */
export const getAppStatus = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.APP_CALL_STATUS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 屏蔽主机挂断  编辑
 */
export const setAppStatus = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.APP_CALL_STATUS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 获取版本列表
 */
export const getFiles = (params: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.APP_FILES,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 添加版本
 */
export const addFile = (data: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.APP_FILE_ADD,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description 删除版本
 */
export const delFile = (data: any, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete(
    {
      url: Api.APP_FILE_DEL,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
};
