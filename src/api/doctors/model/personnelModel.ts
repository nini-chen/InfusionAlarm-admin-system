/**
 * @description: 医护人员管理-医护人员列表搜索参数
 */
export interface PersonListSearch {
  keyword?: string;
  partition_id?: number;
  staff_type?: number;
  page_index: number;
  page_size: number;
}

/**
 * @description: 医护人员管理-医护人员列表返回值
 */
export interface PersonListRecord {
  id: number;
  partition_name: string;
  position_name: string;
  remarks: string;
  staff_address: string;
  staff_age: number;
  staff_avatar: string;
  staff_name: string;
  staff_nation: string;
  staff_number: string;
  staff_partition_id: number;
  staff_position_id: number;
  staff_sex: number;
  staff_telphone: string;
  staff_type: number;
}

/**
 * @description: 医护人员管理-新增医护人员的参数
 */
export interface AddPersonParams {
  // 所属病区id
  staff_partition_id: string;
  // 名字
  staff_name: string;
  // 职级id
  staff_position_id: string;
  // 工号
  staff_number: string;
  // 性别  1：男   2：女   3：其他
  staff_sex: string;
  // 民族
  staff_nation?: string;
  // 人员类型  1医疗人员    2护理人员 ， 编辑功能中，此字段不能修改
  staff_type: number;
  // 年龄
  staff_age?: string;
  // 手机号码
  staff_telphone?: string;
  // 地址
  staff_address?: string;
  // 备注
  remarks?: string;
  // 头像地址
  staff_avatar?: string;
}

/**
 * @description: 医护人员管理-修改医护人员的参数
 */
export interface EditPersonParams {
  id: string;
  staff_name: string;
  staff_position_id: string;
  staff_number: string;
  staff_sex: string;
  staff_nation?: string;
  staff_age?: string;
  staff_telphone?: string;
  staff_address?: string;
  remarks?: string;
  staff_avatar?: string;
}

/**
 * @description: 医护人员管理-删除医护人员的参数
 */
export interface DeletePersonParams {
  // 医护人员id  可多选  兼容字符（以逗号隔开） 和数组
  ids: string | number | number[];
}

/**
 * @description: 医护人员管理-医护人员管理-获取所有医护人员 （仅id和名字 用于筛选）
 */
export interface PersonOptionParams {
  // 病区id
  partition_id: number;
  // 人员类型  1医疗人员    2护理人员
  staff_type: number;
}

/**
 * @description: 医护人员管理-select框职级
 */
export interface PositionSelectOption {
  id: number;
  position_name: string;
}

/**
 * @description: 医护人员管理-批量导入-上传模板的参数
 */
export interface UploadTemplateData {
  partition_id: number;
  path: string;
}
