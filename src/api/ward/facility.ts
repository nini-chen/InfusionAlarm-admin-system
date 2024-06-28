// 架构管理-院区管理模块
import { defHttp } from '/@/utils/http/axios';
import {
  EditFacilityInfoParams,
  AddFacilityParams,
  EditFacilityParams,
  VisitInfoParams,
} from './model/facilityModel';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  GET_FACILITY_INFO = '/api/v2/partition/getHospital',
  SET_FACILITY_NAME = '/api/v2/partition/setHospital',
  GET_FACILITY_LIST = '/api/v2/partition/getPartitionList',
  ADD_FACILITY = '/api/v2/partition/addPartition',
  EDIT_FACILITY = '/api/v2/partition/savePartition',
  DELETE_FACILITY = '/api/v2/partition/delpartition',
  //云探视配置
  GET_VISIT_INFO = '/api/v2/IcuReserve/reserveConfig',
  SET_VISIT_INFO = '/api/v2/IcuReserve/reserveConfig',
  GET_VISIT_POWER = '/api/v2/IcuReserve/authority',
  // 检测远程探视地址是否存在
  GET_CHECK_ICUHOST = '/api/v2/IcuReserve/check',
}

/**
 * @description: 获取院区相关信息
 */
export const getFacilityInfoApi = (params: {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_FACILITY_INFO,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 设置院区名字
 */
export const setFacilityNameApi = (
  params: EditFacilityInfoParams,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.put(
    {
      url: Api.SET_FACILITY_NAME,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 获取病区管理列表
 */
export const getFacilityListApi = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_FACILITY_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 删除病区
 */
export const deleteFacilityApi = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete(
    {
      url: Api.DELETE_FACILITY,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: v2.0 新增病区
 */
export const addFacilityApi = (data: AddFacilityParams, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.ADD_FACILITY,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: v2.0 修改病区
 */
export const editFacilityApi = (params: EditFacilityParams, mode: ErrorMessageMode = 'message') => {
  return defHttp.put(
    {
      url: Api.EDIT_FACILITY,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};
/**
 * @description: 获取院云探视配置
 */
export const getVisitInfoApi = (params: {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_VISIT_INFO,
      params,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
};

/**
 * @description: 获取云探视配置权限
 */
export const getIsVisitPowerApi = (params: {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_VISIT_POWER,
    },
    {
      errorMessageMode: mode,
    },
  );
};

export const setVisitInfoApi = (data: VisitInfoParams, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.SET_VISIT_INFO,
      data,
    },
    {
      errorMessageMode: mode,
    },
  );
};
/**
 * @description: 检测远程探视地址是否存在
 */
export const checkIcuHostApi = (params: {}, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_CHECK_ICUHOST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};
