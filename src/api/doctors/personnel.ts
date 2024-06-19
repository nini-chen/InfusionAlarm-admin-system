// 医护管理-医护人员管理模块

import { defHttp } from '/@/utils/http/axios';
import {
  PersonListSearch,
  PersonListRecord,
  AddPersonParams,
  EditPersonParams,
  DeletePersonParams,
  PersonOptionParams,
  PositionSelectOption,
  UploadTemplateData,
} from './model/personnelModel';

enum Api {
  PERSON_LIST = '/api/v2/staff/getStaffList',
  PERSON_ADD = '/api/v2/staff/addStaff',
  PERSON_EDIT = '/api/v2/staff/saveStaff',
  PERSON_DELETE = '/api/v2/staff/delStaff',
  PERSON_OPTION = '/api/v2/staff/getAllStaff',
  POSITION = '/api/v2/position/getAllPosition',
  UPLOAD_TEMPLATE = '/api/v2/staff/importStaff',
}

/**
 * @description: 医护人员管理-获取医护人员列表
 */
export const getPersonListApi = (params: PersonListSearch) =>
  defHttp.get<PersonListRecord[]>({ url: Api.PERSON_LIST, params });

/**
 * @description: 医护人员管理-添加医护人员
 */
export const addPersonApi = (data: AddPersonParams) => defHttp.post({ url: Api.PERSON_ADD, data });

/**
 * @description: 医护人员管理-编辑医护人员
 */
export const editPersonApi = (data: EditPersonParams) =>
  defHttp.put({ url: Api.PERSON_EDIT, data });

/**
 * @description: 医护人员管理-删除医护人员
 */
export const deletePersonApi = (params: DeletePersonParams) =>
  defHttp.delete({ url: Api.PERSON_DELETE, params });

/**
 * @description: 医护人员管理-获取所有医护人员 （仅id和名字 用于筛选）
 */
export const getPersonOptionApi = (params: PersonOptionParams) =>
  defHttp.get({ url: Api.PERSON_OPTION, params });

/**
 * @description: 医护人员管理-获取职级列表(仅名字和id)
 * @param {number} position_type 类型 1医疗人员   2护理人员
 */
export const getPositionSelectApi = (position_type: number) =>
  defHttp.get<PositionSelectOption[]>({
    url: Api.POSITION,
    params: { position_type },
  });

/**
 * @description: 医护人员管理-批量导入-用户提交填好的模板
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
