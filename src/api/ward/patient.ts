// 医院管理-病区管理模块

import { defHttp } from '/@/utils/http/axios';
import {
  PartitionDetail,
  ICUWardTreeRoomNode,
  AddICUGeneralRoomParams,
  AddICUFamilyRoomParams,
  EditICURoomParams,
  FilterPartitionsParams,
  FilterPartitionsRecord,
} from './model/patientModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  GET_PARTITION_ONE = '/api/v2/partition/getPartitionOne',
  GET_PARTITION_INFO_LIST = '/api/v2/partition/getPartitionInfoList',
  EDIT_PARTITION_INFO = '/api/v2/partition/savePartitionInfo',
  ADD_PARTITION_INFO = '/api/v2/partition/addPartitionInfo',
  DEL_PARTITION_INFO = '/api/v2/partition/delPartitionInfo',
  GET_FILTER_PARTITION = '/api/v2/partition/getAllPartition',

  GET_DEVICE_GROUP_LIST = '/api/v2/device/getDeviceGroupList',
  ADD_DEVICE_GROUP = '/api/v2/device/addDeviceGroup',
  GET_ALL_DEVICE = '/api/v2/device/getAllDevice',
  GET_ROOM_TREE = '/api/v2/partition/getHospitalRoomTree2',
  GET_ALL_ROOM = '/api/v2/partition/getAllHospitalRoom',
  ADD_HOSPITAL_ROOM = '/api/v2/partition/addHospitalRoom',
  SAVE_HOSPITAL_ROOM = '/api/v2/partition/saveHospitalRoom',
  DELETE_ROOM = '/api/v2/partition/delHospitalRoom',

  // ICU
  ICU_ROOM_BED_TREE = '/api/v2/partition/getIcuHospitalRoomTree2',
  ICU_ROOM_ADD = '/api/v2/partition/addIcuHospitalRoom',
  ICU_ROOM_EDIT = '/api/v2/partition/saveIcuHospitalRoom',
}

// 普通病区相关---------------------------
/**
 * @description: 获取单个病区详细信息
 */
export const getPartitionOne = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get<PartitionDetail>(
    {
      url: Api.GET_PARTITION_ONE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 获取病区联系方式列表
 */
export const getPartitionInfoList = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_PARTITION_INFO_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 修改病区联系方式
 */
export const editPartitionInfo = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.EDIT_PARTITION_INFO,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 新增病区联系方式
 */
export const addPartitionInfo = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.ADD_PARTITION_INFO,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 删除病区联系方式
 */
export const delPartitionInfo = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete(
    {
      url: Api.DEL_PARTITION_INFO,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 获取根据条件筛选病区
 */
export const getFilterPartitionsApi = (params: FilterPartitionsParams) =>
  defHttp.get<FilterPartitionsRecord[]>({
    url: Api.GET_FILTER_PARTITION,
    params,
  });

// 病房管理---------------------------

/**
 * @description: 获取病房病床设备树形数据
 */
export const getRoomTree = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_ROOM_TREE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 删除病房
 */
export const deleteRoom = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete(
    {
      url: Api.DELETE_ROOM,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 根据病区ID获取病区分组
 */
export const getDeviceGroupList = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_DEVICE_GROUP_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 新增设备分组
 */
export const addDeviceGroup = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.ADD_DEVICE_GROUP,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 获取所有设备
 */
export const getAllDevice = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_ALL_DEVICE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 添加病房
 */
export const addHospitalRoom = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.ADD_HOSPITAL_ROOM,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 获取所有病房
 */
export const getAllHospitalRoom = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_ALL_ROOM,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: （病房）编辑病房
 */
export const saveHospitalRoom = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.SAVE_HOSPITAL_ROOM,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: ICU病区管理-病房管理-树性结构数据
 */
export const getICUWardTreeApi = (params: { partition_id: number }) =>
  defHttp.get<ICUWardTreeRoomNode[]>({ url: Api.ICU_ROOM_BED_TREE, params });

/**
 * ICU病区管理-病房管理-添加普通病房、添加探视病房
 */
export const addICURoomApi = (data: AddICUGeneralRoomParams | AddICUFamilyRoomParams) =>
  defHttp.post<boolean>({ url: Api.ICU_ROOM_ADD, data });

/**
 * ICU病区管理-病房管理-编辑普通病房、编辑探视病房
 */
export const editICURoomApi = (data: EditICURoomParams) =>
  defHttp.put<boolean>({ url: Api.ICU_ROOM_EDIT, data });
