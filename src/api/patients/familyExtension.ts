// 患者管理-ICU病房(病床分机)

import { defHttp } from '/@/utils/http/axios';
import { ICUFamilyExtListSearchParams, ICUFamilyExtListResult } from './model/familyExtensionModel';

enum Api {
  FAMILY_EXT_LIST = '/api/v2/kin/getIcuKinList',
}

/**
 * @description: 家属分机-获取卡片列表
 */
export const getFamilyExtListApi = (params: ICUFamilyExtListSearchParams) =>
  defHttp.get<ICUFamilyExtListResult>({ url: Api.FAMILY_EXT_LIST, params });
