import { BasicFetchResult } from '/@/api/model/baseModel';

// /**
//  * @description: 病房一览-所有病房select框参数
//  */
// export interface RoomSelectParams {
//   partition_id: number;
// }

// /**
//  * @description: 病房一览-所有病房select框返回值选项
//  */
// export interface RoomSelectOption {
//   id: number;
//   hospital_room_name: string;
// }

// /**
//  * @description: 病房一览-病房列表搜索参数
//  */
// export interface RoomListSearchParams {
//   partition_id: number;
// }

// /**
//  * @description: 病房一览-病房-病床-病人
//  */
// export interface PatientRecord {
//   patient_name: string;
//   patient_sex: number;
// }

// /**
//  * @description: 病房一览-病房-病床数据
//  */
// export interface BedRecord {
//   id: number;
//   hospital_bed_name: string;
//   patient: PatientRecord[];
// }

// /**
//  * @description: 病房一览-病房列表返回值选项
//  */
// export interface RoomListRecord {
//   id: number;
//   hospital_room_name: string;
//   bed: BedRecord[];
//   scheduling_doctor: string;
//   scheduling_nurse: string;
//   online_status: number;
//   historyStatus?: number;
// }

// /**
//  * @description: 病房一览-病房列表返回值
//  */
// export interface RoomListResult {
//   data: RoomListRecord[];
//   data_sum: number;
//   page_index: number;
//   page_size: number;
// }

// /**
//  * @description: 病房一览-获取某个病床的设备上线下线状态
//  */
// export interface RoomBedStatusParams {
//   room_id?: number;
//   bed_id: number;
// }

// /**
//  * @description: 病房一览-获取某个病床的设备上线下线状态: 状态和它所属病房的id
//  */
// export interface RoomBedStatusResult {
//   room_id: number;
//   // true在线; false离线
//   online_status: boolean;
// }

/**
 * @description: 家属分机列表-搜索条件
 */
export interface ICUFamilyExtListSearchParams {
  partition_id: number;
  page_index?: number;
  page_size?: number;
}

/**
 * @description:家属分机-卡片列表-每个分机的信息
 */
export interface ICUFamilyExtListRecord {
  id: number;
  device_name: string;
  device_code: string;

  device_ip: string;
  device_mac: string;
  device_gateway: string;
  device_subnet_mask: string;
  // 序号
  order_num: number;
  // 序号名
  numname: string;
  // 探视间id
  room_id: number;
  // 探视间名
  hospital_room_name: string;
  // 分机号
  extensionnum: number;
  // 设备状态 0离线  1空闲 2普通呼叫中
  online_status: number;
}

/**
 * @description: 家属分机列表
 */
export type ICUFamilyExtListResult = BasicFetchResult<ICUFamilyExtListRecord>;
