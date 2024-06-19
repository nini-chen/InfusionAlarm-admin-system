// 患者管理-床位一览模块

import { defHttp } from '/@/utils/http/axios';
import {
  BedCountsParams,
  BedCountsResult,
  BedListParams,
  BedListResult,
  CareParams,
  CareRecord,
  PatientAddParams,
  PatientEditParams,
  InfoConfigParams,
  InfoConfigResult,
  BedSelectParams,
  BedSelectOption,
  DoctorAdviceSearch,
  DoctorAdviceResult,
  DoctorAdviceParams,
  ChangeBedParams,
  OnDutyResult,
} from './model/bedModel';

enum Api {
  // 床位一览相关
  BED_COUNTS = '/api/v2/partition/getBedNums',
  BED_LIST = '/api/v2/partition/bedPreviewList',
  CARE_LIST = '/api/v2/partition/getNursingLevel',
  PATIENT_ADD = '/api/v2/patient/addPatient',
  PATIENT_EDIT = '/api/v2/patient/savePatient',
  PATIENT_LEAVE = '/api/v2/patient/delPatient',
  PATIENT_DETAIL = '/api/v2/patient/getPatientInfo',
  PATIENT_CHANGE_BED = '/api/v2/patient/changePatientBed',
  INFO = '/api/v2/inconfig/lists',
  BED_SELECT = '/api/v2/partition/getAllHospitalBed',
  DOCTOR_ADVICE = '/api/v2/patient/getPatientAdvice',
  DOCTOR_ADD = '/api/v2/patient/addPatientAdvice',
  ON_DUTY = '/api/v2/patient/getPatientDuty',
}

/**
 * @description: 床位一览-病床统计：所有、已使用、空闲3这种状态的数量
 */
export const getBedCountsApi = (params: BedCountsParams) =>
  defHttp.get<BedCountsResult>({ url: Api.BED_COUNTS, params });

/**
 * @description: 床位一览-获取所有状态的病床列表
 */
export const getBedListApi = (params: BedListParams) =>
  defHttp.get<BedListResult>({ url: Api.BED_LIST, params });

/**
 * @description: 床位一览-获取护理级别的数据
 */
export const getCareListApi = (params: CareParams) =>
  defHttp.get<CareRecord[]>({ url: Api.CARE_LIST, params });

/**
 * @description: 床位一览-添加病人（入院信息登记）
 */
export const patientRegisterApi = (data: PatientAddParams) =>
  defHttp.post<boolean>({ url: Api.PATIENT_ADD, data });

/**
 * @description: 床位一览-获取某个病床上的病人详情
 */
export const getPatientDetailApi = (bed_id: number) =>
  defHttp.get<PatientEditParams>({ url: Api.PATIENT_DETAIL, params: { bed_id } });

/**
 * @description: 床位一览-添加病人（入院信息登记）
 */
export const patientEditApi = (data: PatientEditParams) =>
  defHttp.put<boolean>({ url: Api.PATIENT_EDIT, data });

/**
 * 床位一览-各种信息select框
 * @description: 配置类型（1：护理级别，2：安全防范，3：饮食类别，4：药物反应，5：隔离类别，6：医保类别）
 */
export const infoConfigSelectApi = (params: InfoConfigParams) =>
  defHttp.get<InfoConfigResult>({ url: Api.INFO, params });

/**
 * @description: 床位一览-病人出院
 */
export const patientLeaveApi = (bed_id: number) =>
  defHttp.delete<boolean>({ url: Api.PATIENT_LEAVE, params: { bed_id } });

/**
 * @description: 床位一览-病人换床位
 */
export const patientChangeBedApi = (data: ChangeBedParams) =>
  defHttp.put<boolean>({ url: Api.PATIENT_CHANGE_BED, data });

/**
 * 病房一览-获取所有病房 （仅id与名字 用于筛选）
 */
export const getBedSelectApi = (params: BedSelectParams) =>
  defHttp.get<BedSelectOption[]>({ url: Api.BED_SELECT, params });

/**
 * 病房一览-获取医嘱列表
 */
export const getDoctorAdviceListApi = (params: DoctorAdviceSearch) =>
  defHttp.get<DoctorAdviceResult>({ url: Api.DOCTOR_ADVICE, params });

/**
 * 病房一览-添加医嘱
 */
export const addDoctorAdviceApi = (data: DoctorAdviceParams) =>
  defHttp.post<boolean>({ url: Api.DOCTOR_ADD, data });

/**
 * 病房一览-获取本周的值班人员
 */
export const getOnDutyApi = (bed_id: string) =>
  defHttp.get<OnDutyResult>({ url: Api.ON_DUTY, params: { bed_id } });
