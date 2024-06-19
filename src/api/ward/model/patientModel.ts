// 医院管理-病区管理模块 接口声明

/**
 * @description: 病区详情
 */
export interface PartitionDetail {
  id: number;
  // 病区名
  partition_name: string;
  // 病区编号值
  partition_code: string;
  // 该参数不发或者为空代表关闭规避
  partition_avoidnum?: string;
  // 备注 （简介）
  remarks: string;
  // 病床号排序方式 1房内顺序   2区内顺序
  partition_order: number;
  // 病区唯一编码值
  area_code: string;
  // 是否是icu病区  1：是    0：否
  is_icu: number;
  // 温馨提醒
  tips: string;
  // 探视时长，以分钟为单位，当is_icu为1时，这里的范围必须为1-30
  visit_time: number;
  // 申请时长 以分钟为单位，当is_icu为1时，这里的范围必须为1-30
  apply_time: number;
  // 设备数（除开病床分机和sos）
  device_num: number;
  // 医院名称（这个字段应移动端要求加上）
  hospital_name: string;
  // 病房数
  hospital_room_num: number;
  // 探视病床分机数量
  medical_icu_sickbed_num: number;
  // 病床数
  medical_bed_num: number;
  // 医护主机数
  medical_host_num: number;
  partition_create_time: string;
  // icu医护主机数量
  medical_icu_host_num: number;
  // icu家属分机数量
  medical_icu_family_num: number;
}

/**
 * @description: ICU病区管理-病房管理-树性结构数据 第一层 病房节点
 */
export interface ICUWardTreeRoomNode {
  id: number;
  // 病房名称
  hospital_room_name: string;
  // 当前节点的类型：room:病房   bed:病床   device:设备
  datatype: string;
  // 备注
  remarks: string;
  // 病床数量
  hospital_bed_num: number;
  order_num: string;
  // 是否是家属探视间  1：是  0：否
  is_kin: number;
  children: ICUWardTreeBedNode[];
}

/**
 * @description: ICU病区管理-病房管理-树性结构数据 第二层 病床节点
 */
export interface ICUWardTreeBedNode {
  id: number;
  datatype: string;
  hospital_bed_name: string;
  hospital_bed_number: number;
  hospital_bed_partition_id: number;
  hospital_bed_patient_code: string;
  hospital_bed_remarks: string;
  hospital_room_id: number;
  children: ICUWardTreeExtNode[];
}

/**
 * @description: ICU病区管理-病房管理-树性结构数据 第三层 分机节点
 */
export interface ICUWardTreeExtNode {
  area_code: string;
  bed_id: number;
  bindtime: number;
  datatype: string;
  default_word: string;
  device_channel: number;
  device_code: string;
  device_gateway: null | string;
  device_ip: null | string;
  device_mac: null | string;
  device_name: string;
  device_online_status: number;
  device_subnet_mask: null | string;
  device_type: string;
  extensionnum: number;
  flag: number;
  height: number;
  id: number;
  order_num: number;
  partition_id: number;
  platform_ip: null | string;
  remarks: string;
  room_id: number;
  sn: null | string;
  timestamp: number;
  uId: number;
  version: string;
  width: number;
}

/**
 * @description: ICU病区管理-病房管理-添加病房基本参数参数
 */
export interface AddICURoomBaseParams {
  partition_id: number;
  // 是否是探视间  1是  0否
  is_kin: number;
  remarks: string;
}

/**
 * @description: ICU病区管理-病房管理-添加普通病房基本参数参数
 */
export interface AddICUGeneralRoomParams extends AddICURoomBaseParams {
  room_num: number;
  bed_num: number;
}

/**
 * @description: ICU病区管理-病房管理-添加探视病房基本参数参数
 */
export interface AddICUFamilyRoomParams extends AddICURoomBaseParams {
  hospital_room_name: string;
  extnum: number;
}

/**
 * @description: ICU病区管理-病房管理-编辑普通病房和探视病房
 */
export interface EditICURoomParams {
  id: number;
  hospital_room_name: string;
  remarks: string;
}

/**
 * @description: ICU病区管理-筛选病区数据
 */
export interface FilterPartitionsParams {
  is_check_user?: number; // 是否根据当前用户来获取能够管理的病区 1是 0否
  isicu?: 0 | 1; // 0获取普通病区；1是获取探视病区；
  is_bind_icu_host?: number; // 是否绑定了icu主机 1绑定了icu主机 0没有绑定icu主机
  is_bind_host?: number; // 是否绑定了普通主机  1绑定了普通主机 0没有绑定普通主机
}

/**
 * @description: ICU病区管理-筛选病区数据-返回的选项
 */
export interface FilterPartitionsRecord {
  id: number; // 病区id
  partition_name: string; // 病区名称
  is_icu: 0 | 1; // 是否是探视病区
}
