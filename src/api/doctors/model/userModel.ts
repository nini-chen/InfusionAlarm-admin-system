/**
 * @description: 用户管理-用户列表搜索参数
 */
export interface UserListSearch {
  keyword?: string;
  user_partition?: number;
  user_role?: number;
  page_index: number;
  page_size: number;
}

/**
 * @description: 用户管理-用户列表返回值
 */
export interface UserListRecord {
  id: number;
  partition_name: string;
  power: true;
  role_name: string;
  user_email: string;
  user_name: string;
  user_number: string;
  user_role: string;
  user_status: number;
  user_telphone: string;
}

/**
 * @description: 用户管理-新增用户的参数
 */
export interface AddUserParams {
  user_number: string;
  user_password: string;
  user_name: string;
  user_role?: string;
  user_partition?: string;
  user_telphone?: string;
  user_email?: string;
  remarks?: string;
}

/**
 * @description: 用户管理-修改用户的参数
 */
export interface EditUserParams {
  id: string | number;
  user_password: string;
  oldpassword?: string;
  user_name: string;
  user_role?: string;
  user_partition?: number;
  user_telphone?: string;
  user_email?: string;
  remarks?: string;
}

/**
 * @description: 用户管理-删除用户的参数
 */
export interface DeleteUserParams {
  // 用户id  可多选  兼容字符（以逗号隔开） 和数组
  ids: string | number | number[];
}

/**
 * @description: 用户管理-启用禁用用户的参数
 */
export interface StopOrStartUserParams {
  // 用户id  可多选  兼容字符（以逗号隔开） 和数组
  ids: string | number | number[];
  // 1:启用  2：禁用
  user_status: number;
}

/**
 * @description: 用户管理-重置用户密码
 */
export interface ResetUserPwdParams {
  // 用户id
  id: string | number;
}
