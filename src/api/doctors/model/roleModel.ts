/**
 * @description: 角色管理-角色列表返回值每一项
 */
export interface RoleListRecord {
  id: number;
  power: boolean;
  role_default: number;
  role_name: string;
  role_remarks: string;
}

/**
 * @description: 角色管理-角色列表返回值
 */
export interface RoleListResult {
  data_sum: number;
  page_index: number;
  page_size: number;
  data: RoleListRecord[];
}

/**
 * @description: 角色管理-新增角色的参数
 */
export interface AddRoleParams {
  role_name: string;
  role_remarks?: string;
  node_id?: string | number[];
}

/**
 * @description: 角色管理-修改角色的参数
 */
export interface EditRoleParams {
  role_id: number;
  role_name: string;
  role_remarks?: string;
  node_id?: string | number[];
}

/**
 * @description: 角色管理-删除角色的参数
 */
export interface DeleteRoleParams {
  role_id: number;
}
