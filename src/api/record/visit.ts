import { ICUVisitModel, downloadVisitVideoModel, ApprovalModel } from './model/visitModel';
import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  // 探视审批
  GET_VISIT_APPROVAL_LIST = '/api/v2/IcuReserve/list',
  // 探视录像
  GET_ICU_VISIT_VIDEO_LIST = '/api/v2/kin/getIcuVisitHistory',
  DOWNLOAD_VISIT_VIDEO_LIST = '/api/v2/kin/downloadIcuVisitVideo',
}

/**
 * @description 探视审批
 */
export const getVisitApprovalList = (params: ApprovalModel, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_VISIT_APPROVAL_LIST,
      params,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
};

/**
 * @description 探视录像
 */
export const getIcuVisitVideoList = (params: ICUVisitModel, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_ICU_VISIT_VIDEO_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

export const downloadVisitVideo = (
  params: downloadVisitVideoModel,
  mode: ErrorMessageMode = 'message',
) => {
  return defHttp.get(
    {
      url: Api.DOWNLOAD_VISIT_LIST,
      params,
      responseType: 'blob',
    },
    {
      errorMessageMode: mode,
    },
  );
};
