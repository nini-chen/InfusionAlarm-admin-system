import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  getHRoomBedTreeResultModel,
  addSchedulingTypeResultModel,
  getSchedulingTypeListResultModal,
  editSchedulingTypeResultModel,
  deleteSchedulingTypeResultModal,
  getPositionListResultModal,
  addPositionResultModal,
  editPositionResultModal,
  deletePositionResultModal,
} from './model/inconfigModel';

enum Api {
  GET_H_ROOMBED_TREE = '/api/v2/partition/getHospitalRoomBedTree',
  ADD_SchedulingType = '/api/v2/scheduling/addSchedulingType',
  GET_SchedulingType_LIST = '/api/v2/scheduling/getSchedulingTypeList',
  EDIT_SchedulingType = '/api/v2/scheduling/saveSchedulingType',
  DELETE_SchedulingType = '/api/v2/scheduling/delSchedulingType',
  GET_POSITION_LIST = '/api/v2/position/getPositionList',
  ADD_POSITION = '/api/v2/position/addPosition',
  EDIT_POSITION = '/api/v2/position/savePosition',
  DELETE_POSITION = '/api/v2/position/delPosition',
}

/**
 * @description: 获取病房病床列表
 */
export const getHRoomBedTree = (
  params: getHRoomBedTreeResultModel,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get(
    {
      url: Api.GET_H_ROOMBED_TREE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 添加排班类型
 */
export const addSchedulingType = (
  params: addSchedulingTypeResultModel,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.post(
    {
      url: Api.ADD_SchedulingType,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 修改排班类型
 */
export const editSchedulingType = (
  params: editSchedulingTypeResultModel,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.put(
    {
      url: Api.EDIT_SchedulingType,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 获取排班类型
 */
export const getSchedulingTypeList = (
  params: getSchedulingTypeListResultModal,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get(
    {
      url: Api.GET_SchedulingType_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 删除排班类型
 */
export const deleteSchedulingType = (
  params: deleteSchedulingTypeResultModal,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.delete(
    {
      url: Api.DELETE_SchedulingType,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 获取职级列表
 */
export const getPositionList = (
  params: getPositionListResultModal,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get(
    {
      url: Api.GET_POSITION_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 添加职级
 */
export const addPosition = (params: addPositionResultModal, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.ADD_POSITION,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 添加职级
 */
export const editPosition = (
  params: editPositionResultModal,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.put(
    {
      url: Api.EDIT_POSITION,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 删除职级
 */
export const deletePosition = (
  params: deletePositionResultModal,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.delete(
    {
      url: Api.DELETE_POSITION,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};
