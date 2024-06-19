// 患者管理-ICU病床(家属分机)

import { defHttp } from '/@/utils/http/axios';
import {
  ICUBedExtListSearchParams,
  ICUBedExtListResult,
  ICUExtStatisticsResult,
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
} from './model/bedExtensionModel';

enum Api {
  ICU_BED_EXT_LIST = '/api/v2/partition/icuSickbedPreviewList',
  ICU_Family_COUNTS = '/api/v2/partition/getIcuBedNums',

  PATIENT_DETAIL = '/api/v2/patient/getIcuPatientInfo',
  DOCTOR_ADVICE = '/api/v2/patient/getIcuPatientAdvice',
  DOCTOR_ADD = '/api/v2/patient/addIcuPatientAdvice',
  PATIENT_LEAVE = '/api/v2/patient/delIcuPatient',
  PATIENT_ADD = '/api/v2/patient/addIcuPatient',
  PATIENT_EDIT = '/api/v2/patient/saveIcuPatient',
  PATIENT_CHANGE_BED = '/api/v2/patient/changeIcuPatientBed',
  ON_DUTY = '/api/v2/patient/getIcuPatientDuty',

  // BED_LIST = '/api/v2/partition/bedPreviewList',
  CARE_LIST = '/api/v2/partition/getNursingLevel',
  INFO = '/api/v2/inconfig/lists',
  BED_SELECT = '/api/v2/partition/getAllHospitalBed',
}

/**
 * @description: ICU病床（病床分机）-获取分机列表
 */
export const getBedExtListApi = (params: ICUBedExtListSearchParams) =>
  defHttp.get<ICUBedExtListResult>({ url: Api.ICU_BED_EXT_LIST, params });

/**
 * @description: ICU病床（病床分机和家属分机公用的接口）-获取分机状态统计
 */
export const getPublicExtStatisticsApi = (params: { partition_id: number }) =>
  defHttp.get<ICUExtStatisticsResult>({ url: Api.ICU_Family_COUNTS, params });

/**
 * @description: ICU病床（病床分机）-获取护理级别的数据
 */
export const getCareListApi = (params: CareParams) =>
  defHttp.get<CareRecord[]>({ url: Api.CARE_LIST, params });

/**
 * @description: ICU病床（病床分机）-添加病人（入院信息登记）
 */
export const patientRegisterApi = (data: PatientAddParams) =>
  defHttp.post<boolean>({ url: Api.PATIENT_ADD, data });

/**
 * @description: ICU病床（病床分机）-获取某个病床上的病人详情
 */
export const getPatientDetailApi = (params: { bed_id: number; partition_id: number }) =>
  defHttp.get<PatientEditParams>({ url: Api.PATIENT_DETAIL, params });

/**
 * @description: ICU病床（病床分机）-修改病人信息（入院信息登记）
 */
export const patientEditApi = (data: PatientEditParams) =>
  defHttp.put<boolean>({ url: Api.PATIENT_EDIT, data });

/**
 * ICU病床（病床分机）-各种信息select框
 * @description: 配置类型（1：护理级别，2：安全防范，3：饮食类别，4：药物反应，5：隔离类别，6：医保类别）
 */
export const infoConfigSelectApi = (params: InfoConfigParams) =>
  defHttp.get<InfoConfigResult>({ url: Api.INFO, params });

/**
 * @description: ICU病床（病床分机）-病人出院
 */
export const patientLeaveApi = (params: { bed_id: number; partition_id: number }) =>
  defHttp.delete<boolean>({ url: Api.PATIENT_LEAVE, params });

/**
 * @description: ICU病床（病床分机）-病人换床位
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

export const getOnDutyApi = (params: { bed_id: number; partition_id: number }) =>
  defHttp.get<OnDutyResult>({ url: Api.ON_DUTY, params });
