// 架构管理-院区管理模块 接口声明

/**
 * @description: 院区信息-编辑详情参数
 */
export interface EditFacilityInfoParams {
  hospital_name: string;
}

/**
 * @description: 病区列表-新增病区信息参数
 */
export interface AddFacilityParams {
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
}

/**
 * @description: 病区列表-编辑病区信息参数
 */
export interface EditFacilityParams extends AddFacilityParams {
  id: string | number;
}

