/**
 * @description: 病房一览-所有病房select框参数
 */
export interface RoomSelectParams {
  partition_id: number;
  // 1:探视间  0：普通病房   不发这个参数则获取所有病房
  is_kin?: number;
}

/**
 * @description: 病房一览-所有病房select框返回值选项
 */
export interface RoomSelectOption {
  id: number;
  hospital_room_name: string;
}

/**
 * @description: 病房一览-病房列表搜索参数
 */
export interface RoomListSearchParams {
  partition_id: number;
  keyword: any;
}

/**
 * @description: 病房一览-病房-病床-病人
 */
export interface PatientRecord {
  patient_name: string;
  patient_sex: string;
}

/**
 * @description: 病房一览-病房-病床数据
 */
export interface BedRecord {
  id: number;
  hospital_bed_name: string;
  patient: PatientRecord[];
  sickbed_online_status: number;
}

/**
 * @description: 病房一览-病房列表返回值选项
 */
export interface RoomListRecord {
  id: number;
  hospital_room_name: string;
  bed: BedRecord[];
  scheduling_doctor: string;
  scheduling_nurse: string;
  online_status: number;
  online_text?: string; // 洗手间报警状态特有：http接口返回洗手间报警提示；对应mqtt协议/device/web/get/button/change里的text
  historyStatus?: number;
  sickbed_num: number;
}

/**
 * @description: 病房一览-病房列表返回值
 */
export interface RoomListResult {
  data: RoomListRecord[];
  data_sum: number;
  page_index: number;
  page_size: number;
}

/**
 * @description: 病房一览-获取某个病床的设备上线下线状态
 */
export interface RoomBedStatusParams {
  room_id?: number;
  bed_id: number;
}

/**
 * @description: 病房一览-获取某个病床的设备上线下线状态: 状态和它所属病房的id
 */
export interface RoomBedStatusResult {
  room_id: number;
  // true在线; false离线
  online_status: boolean;
}
