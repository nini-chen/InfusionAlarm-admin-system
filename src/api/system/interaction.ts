import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  getInconfigListResultModel,
  addInconfigListResultModel,
  editInconfigListResultModel,
  deleteInconfigListResultModel,
} from './model/interactionModel';

enum Api {
  GET_INCONFIG_LIST = '/api/v2/inconfig/lists',
  INCONFIG = '/api/v2/inconfig/one',
}

/**
 * @description: 获取配置列表
 */
export const getInconfigList = (
  params: getInconfigListResultModel,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get(
    {
      url: Api.GET_INCONFIG_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 添加配置
 */
export const addConfig = (
  params: addInconfigListResultModel,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.post(
    {
      url: Api.INCONFIG,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 修改配置
 */
export const editConfig = (
  params: editInconfigListResultModel,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.put(
    {
      url: Api.INCONFIG,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 删除配置
 */
export const deleteConfig = (
  params: deleteInconfigListResultModel,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.delete(
    {
      url: Api.INCONFIG,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};
