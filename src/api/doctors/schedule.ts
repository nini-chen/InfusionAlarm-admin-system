// 医护管理-医护排班模块: 护士排班和医生排班

import { defHttp } from '/@/utils/http/axios';
import {
  ScheduleListSearch,
  ScheduleListRecord,
  ScheduleTypeParams,
  ScheduleTypeRecord,
  RoomTreeParams,
  RoomManageRecord,
  SetScheduleParams,
  UploadTemplateData,
} from './model/scheduleModel';

enum Api {
  SCHEDULE_LIST = '/api/v2/scheduling/getSchedulingList',
  SCHEDULE_TYPE = '/api/v2/scheduling/getSchedulingTypeList',
  SCHEDULE_SET = '/api/v2/scheduling/setScheduling',
  ROOM_MANAGE = '/api/v2/partition/getHospitalRoomBedTree',

  ICU_SCHEDULE_LIST = '/api/v2/scheduling/getIcuSchedulingList',
  ICU_SCHEDULE_TYPE = '/api/v2/scheduling/getIcuSchedulingTypeList',
  ICU_SCHEDULE_SET = '/api/v2/scheduling/setIcuScheduling',
  ICU_ROOM_MANAGE = '/api/v2/partition/getIcuHospitalRoomBedTree',
  // 下载模板（带参数）
  DOWNLOAD_EXCEL = 'api/v2/SchedulingExecl/download',
  //批量导入
  UPLOAD_TEMPLATE = '/api/v2/SchedulingExecl/import',
}
/**
 * @description:下载模板（带参数）
 */
export const getDownloadTemplateApi = (params: ScheduleTypeParams) =>
  defHttp.get<ScheduleTypeRecord[]>({
    url: Api.DOWNLOAD_EXCEL,
    params,
  });

/**
 * @description:排班管理-获取排班列表
 */
export const getScheduleListApi = (data: { params: ScheduleListSearch; isICU: boolean }) =>
  defHttp.get<ScheduleListRecord[]>({
    url: data.isICU ? Api.ICU_SCHEDULE_LIST : Api.SCHEDULE_LIST,
    params: data.params,
  });

/**
 * @description:排班管理-获取排班类型
 */
export const getScheduleTypesApi = (params: ScheduleTypeParams, isICU: boolean) =>
  defHttp.get<ScheduleTypeRecord[]>({
    url: isICU ? Api.ICU_SCHEDULE_TYPE : Api.SCHEDULE_TYPE,
    params,
  });

/**
 * @description:排班管理-获取病房管理tree
 */
export const getRoomMangeTreeApi = (params: RoomTreeParams, isICU: boolean) =>
  defHttp.get<RoomManageRecord[]>({ url: isICU ? Api.ICU_ROOM_MANAGE : Api.ROOM_MANAGE, params });

/**
 * @description:排班管理-设置排班
 */
export const setScheduleApi = (data: SetScheduleParams, isICU: boolean) =>
  defHttp.put<boolean>({ url: isICU ? Api.ICU_SCHEDULE_SET : Api.SCHEDULE_SET, data });

/**
 * @description: 医护排班-批量导入-用户提交填好的模板
 */
export const uploadTemplateApi = (data: UploadTemplateData) =>
  defHttp.post(
    {
      url: Api.UPLOAD_TEMPLATE,
      data,
    },
    {
      isReturnNativeResponse: true,
      isTransformResponse: false,
    },
  );
