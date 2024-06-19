import { BasicFetchResult } from '/@/api/model/baseModel';

/**
 * @description:病床分机列表-搜索条件
 */
export interface ICUBedExtListSearchParams {
  partition_id: number;
  keyword: string;
  // 1使用中   2空闲中
  is_use?: number;
  page_index?: number;
  page_size?: number;
}

/**
 * @description:病床分机-卡片列表-每个病床的信息
 */
export interface ICUBedExtListRecord {
  bed_id: number;
  // 住院时间
  day_num: number;
  device_code: string;
  device_gateway: string;
  device_ip: string;
  device_mac: string;
  device_name: string;
  device_subnet_mask: string;
  // 病床分机编号
  numname: string;
  // 排序字号
  order_num: number;
  // 设备类型
  device_type: string;
  diagnosis: string;
  hospital_bed_name: string;
  hospital_room_name: string;
  i1_color: string;
  i1_id: string;
  i1_name: string;
  i6_color: string;
  i6_name: string;
  id: number;
  num: string;
  // 设备在线状态 0离线  1空闲
  online_status: number;
  patient_age: string;
  patient_id: string;
  patient_livedate: string;
  // 病人名
  patient_name: string;
  patient_number: string;
  patient_sex: string;
  room_id: number;
}

/**
 * @description:病床分机-卡片列表返回值
 */
export type ICUBedExtListResult = BasicFetchResult<ICUBedExtListRecord>;

/**
 * @description: 病床分机和家属分机的-床位统计
 */
export interface ICUExtStatisticsResult {
  allnum: number;
  usednum: number;
  freenum: number;
}

/**
 * @description: 病床分机-病床列表-搜索条件
 */
export interface BedListParams {
  partition_id: number;
  keyword?: string;
  // 0：全部   1:使用中    2空闲
  is_use?: number;
  room_id?: number;
  page_index?: number;
  page_size?: number;
}

/**
 * @description: 病床分机-病床列表-每个病床的信息
 */
export interface ICUBedListRecord {
  bed_id: number;
  day_num: number;
  diagnosis: string;
  hospital_bed_name: string;
  hospital_room_name: string;
  i1_color: string;
  i1_name: string;
  i3_name: string;
  i4_name: string;
  i6_name: string;
  patient_age: string;
  patient_livedate: string;
  patient_name: string;
  patient_number: string;
  patient_sex: string;
  scheduling_doctor: string;
  scheduling_nurse: string;
  sickbed_channel: number;
  sickbed_mac: string;

  device_code: string;
  device_gateway: string;
  device_ip: string;
  device_mac: string;
  device_name: string;
  device_subnet_mask: string;
  device_type: string;
  i1_id: string;
  id: number;
  inconfig_3: string;
  inconfig_4: string;
  num: string;
  partition_id: number;
  partition_name: string;
  patient_doctor_avatar: string;
  patient_doctor_id: number;
  patient_doctor_name: string;
  patient_id: string;

  patient_nurse_avatar: string;
  patient_nurse_id: number;
  patient_nurse_name: string;
  room_id: number;

  online_status: number; // 离线0，在线1
  answer_status: number; // 空闲0，忙碌1

  bedState: number; // 前端自定义字段：用于集中记录病床的状态值（因为后端数据返回多个字段表达病床状态，http返回online_status、answer_status）
  historyStatus: number; // 前端自定义字段：用于记录病床状态切换前的值
}

/**
 * @description: 病床分机-病床列表返回值
 */
export type BedListResult = BasicFetchResult<ICUBedListRecord>;

/**
 * @description: 病床分机-护理级别搜索
 */
export interface CareParams {
  partition_id: number;
  keyword?: string;
}

/**
 * @description: 病床分机-护理级别返回值
 */
export interface CareRecord {
  id: number;
  nums: number;
  color: string;
  name: string;
}

/**
 * @description: 病床分机-添加病人信息
 */
export interface PatientAddParams {
  // 病床id
  bed_id: number;
  // 住院号
  patient_number: string;
  // 住院时间
  patient_livedate: string;
  // 病人姓名
  patient_name: string;
  // 病人性别（1=男，2=女，3=其它）
  patient_sex: number;
  // 病人年龄
  patient_age: string;
  // 病人出生日期（yyyy-MM-dd）
  patient_birthday?: string;
  // 血型  1：A型  2：B型  3：AB型   4：O型   5:Rh阴性(A型)  6:Rh阴性(B型)  7:Rh阴性(AB型)   8:Rh阴性(O型)
  patient_blood?: number;
  // 病人籍贯
  patient_nativeplace?: string;
  // 病人身份
  patient_patient_responce?: string;
  // 身份证号码
  patient_idcard?: string;
  // 病人电话号码
  patient_phone_number?: string;
  patient_address?: string;
  // 病人紧急联系人
  patient_emergency_contact?: string;
  // 病人紧急联系人电话号码
  patient_emergency_contact_phone_number?: string;
  // 护理级别
  inconfig_1?: string;
  // 住院次数
  num?: number;
  // 病情状态： 1正常 2病危 3病重
  patient_illness?: number;
  // 医生id
  patient_doctor?: number;
  patient_nurse?: number;
  // 是否做手术 1是 2否
  is_operation?: number;
  // 手术时间
  operation_time?: string;
  // 医保类型
  inconfig_6?: string;
  // 预交金额
  before_money?: number;
  // 术结金额
  after_money?: number;
  // 饮食类别
  inconfig_3?: string;
  // 药物反应
  inconfig_4?: string;
  // 隔离类别
  inconfig_5?: string;
  // 安全防范
  inconfig_2?: string;
  // 诊断
  diagnosis?: string;
}

/**
 * @description: 病床分机-添加病人信息
 */
export interface PatientEditParams extends PatientAddParams {
  // 病人ID
  patient_id: number;
  partition_id: number;
  device_mac?: string;
}

/**
 * @description: 病床分机-信息交互管理列表请求参数
 */
export interface InfoConfigParams {
  page_index?: number;
  page_size?: number;
  // 是否分页（1：是（默认），0：否）
  page?: number;
  // 配置类型（1：护理级别，2：安全防范，3：饮食类别，4：药物反应，5：隔离类别，6：医保类别）
  type: number;
}

/**
 * @description: 病床分机-信息交互管理列表请求参数
 */
export interface InfoConfigResult {
  id: number;
  name: string;
  type: string;
  color: string;
  comment: string;
}

/**
 * @description: 病床分机-所有病床select框参数
 */
export interface BedSelectParams {
  // 病区id
  partition_id: number;
  // 病房id
  room_id?: number;
  // 是否绑定病床分机 1是  0或不发 表示全部
  is_bind_sickbed?: 1 | 0 | undefined;
  // 是否筛选出空床  1： 是    0或不发 表示全部
  is_empty_bed?: 1 | 0 | undefined;
  // 是否绑定ICU病床分机  1是  0 表示没绑定ICU病床分机  不发 表示全部
  is_bind_icu_sickbed?: 1 | 0 | undefined;
}

/**
 * @description: 病床分机-所有病床select框返回值选项
 */
export interface BedSelectOption {
  id: number;
  hospital_bed_name: string;
}

/**
 * @description: 病床分机-添加医嘱参数
 */
export interface DoctorAdviceParams {
  partition_id: number;
  bed_id: number;
  // 医嘱类型  1：检查、2：检验:3：手术、4：护理、5：嘱托、6：用药、7：其他
  advice_type: number;
  // 医嘱内容
  advice_content: string;
  // 长临嘱：1:长期、2:临时
  advice_timetype: number;
  // 频率： 1:q1h、2:q2h、3:q4h、4:q6h、5:q8h、6:q12h、7:qd、8:qod、9:bid、10:bidac、11:tidac、12:tid、13:qm、14:qn、15:hs、16:qid
  advice_race: string;
  // 用法  1：Gtt、2：po、3：H、4：Iv、5：Im
  advice_usage: string;
  advice_startdate: string;
  advice_enddate: string;
}

/**
 * @description: 病床分机-医嘱搜索参数
 */
export interface DoctorAdviceSearch {
  bed_id: number;
  page_index?: number;
  page_size?: number;
}

/**
 * @description: 病床分机-医嘱列表选项
 */
export interface DoctorAdviceRecord {
  id: number;
  bed_id: number;
  // 医嘱类型  1：检查、2：检验:3：手术、4：护理、5：嘱托、6：用药、7：其他
  advice_type: number;
  // 医嘱内容
  advice_content: string;
  // 长临嘱：1:长期、2:临时
  advice_timetype: number;
  // 频率： 1:q1h、2:q2h、3:q4h、4:q6h、5:q8h、6:q12h、7:qd、8:qod、9:bid、10:bidac、11:tidac、12:tid、13:qm、14:qn、15:hs、16:qid
  advice_race: string;
  // 用法  1：Gtt、2：po、3：H、4：Iv、5：Im
  advice_usage: string;
  advice_startdate: string;
  advice_enddate: string;
}

/**
 * @description: 病床分机-医嘱列表返回值
 */
export interface DoctorAdviceResult {
  data: DoctorAdviceRecord[];
  data_sum: number;
  page_size: number;
  page_index: number;
}

/**
 * @description: 病床分机-换床位
 */
export interface ChangeBedParams {
  old_bed_id: number;
  new_bed_id: number;
  partition_id: number;
}

/**
 * @description: 病床分机-详情-值班人员
 */
export interface OnDutyResult {
  date: string;
  doctor: string[];
  nurse: string[];
}
