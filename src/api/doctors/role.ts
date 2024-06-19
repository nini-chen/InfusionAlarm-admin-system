// 医护管理-角色管理模块

import { defHttp } from '/@/utils/http/axios';
import { RoleListResult, AddRoleParams, EditRoleParams, DeleteRoleParams } from './model/roleModel';
enum Api {
  ROLE_LIST = '/api/v2/role/getRoleList',
  ROLE_ADD = '/api/v2/role/addRole',
  ROLE_EDIT = '/api/v2/role/setRole',
  ROLE_DELETE = '/api/v2/role/delRole',
}
/**
 * @description: 角色管理-获取角色列表
 */
export const getRoleListApi = () => defHttp.get<RoleListResult>({ url: Api.ROLE_LIST });

/**
 * @description: 角色管理-添加角色
 */
export const addRoleApi = (data: AddRoleParams) => defHttp.post({ url: Api.ROLE_ADD, data });

/**
 * @description: 角色管理-编辑角色
 */
export const editRoleApi = (data: EditRoleParams) => defHttp.put({ url: Api.ROLE_EDIT, data });

/**
 * @description: 角色管理-删除角色
 */
export const deleteRoleApi = (params: DeleteRoleParams) =>
  defHttp.delete({ url: Api.ROLE_DELETE, params });
