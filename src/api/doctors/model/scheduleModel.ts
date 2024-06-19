/**
 * @description: 排班管理-排版列表返回值
 */
export interface ScheduleListSearch {
  // 病区id
  partition_id: number;
  // 所属人群 1医疗人员   2护理人员
  scheduling_population: number;
  startDate: string;
  endDate: string;
  page_index: number;
  page_size: number;
}

/**
 * @description: 排班管理-排版一周内某天的排班类型和管床范围
 */
export interface DateScedule {
  scheduling_hospital_bed_id?: string;
  scheduling_hospital_bed_name?: string;
  scheduling_type?: number;
  schedulingtype_name?: string;
}

/**
 * @description: 排班管理-排版一周内某天的日期和排班数据
 */
export interface ScheduleItem {
  date: string;
  list: DateScedule;
}

/**
 * @description: 排班管理-排版列表返回值
 */
export interface ScheduleListRecord {
  id: number;
  staff_name: string;
  scheduling: ScheduleItem[];
}

/**
 * @description: 排班管理-排版类型的参数
 */
export interface ScheduleTypeParams {
  partition_id: number;
  schedulingtype_population: number;
}

/**
 * @description: 排班管理-排版类型返回值
 */
export interface ScheduleTypeRecord {
  // 类型id
  id: number;
  // 类型名
  schedulingtype_name: string;
  // 预设管床范围
  managebed_list: string;
  // 是否管床 1是 0否
  schedulingtype_is_managebed: number;
  // 管床范围 （病房id 以逗号隔开）
  schedulingtype_managebed_range: string;
  // 所属病区
  schedulingtype_partition: number;
  // 所属人群 1医疗人员   2护理人员
  schedulingtype_population: number;
  schedulingtype_starttime: string;
  schedulingtype_endtime: string;
  // 时间段
  schedulingtype_timesting: string;
}

/**
 * @description: 排班管理-病房管理tree搜索参数
 */
export interface RoomTreeParams {
  partition_id: number;
}

/**
 * @description: 排班管理-病房管理tree返回值
 */
export interface RoomManageResult {
  partition_id: number;
}

/**
 * @description: 排班管理-病房管理tree返回值
 */
export interface RoomManageRecord {
  id: number;
  name: string;
  level: number;
  children: RoomManageRecord[];
}

/**
 * @description: 排班管理-病房管理tree返回值
 */
export interface SetScheduleParams {
  // 病区id
  partition_id: number;
  // 所属人群 1医疗人员   2护理人员
  scheduling_population: number;
  // 排版数据二维数组
  scheduling: Array<Array<any>>;
}

/**
 * todo
 * @description: 排班-批量导入-上传模板的参数
 */
export interface UploadTemplateData {
  partition_id: number;
  path: string;
}
