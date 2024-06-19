// 医护管理-用户管理模块

import { defHttp } from '/@/utils/http/axios';
import {
  UserListSearch,
  UserListRecord,
  AddUserParams,
  EditUserParams,
  DeleteUserParams,
  StopOrStartUserParams,
  ResetUserPwdParams,
} from './model/userModel';

enum Api {
  USER_LIST = '/api/v2/user/getUserList',
  USER_ADD = '/api/v2/user/adduser',
  USER_EDIT = '/api/v2/user/saveUser',
  USER_DELETE = '/api/v2/user/delUser',
  USER_STOP_OR_START = '/api/v2/user/enableUser',
  USER_RESET_PWD = '/api/v2/login/resetLogin',
}

/**
 * @description: 用户管理-获取用户列表
 */
export const getUserListApi = (params: UserListSearch) =>
  defHttp.get<UserListRecord[]>({ url: Api.USER_LIST, params });

/**
 * @description: 用户管理-添加用户
 */
export const addUserApi = (data: AddUserParams) => defHttp.post({ url: Api.USER_ADD, data });

/**
 * @description: 用户管理-编辑用户
 */
export const editUserApi = (data: EditUserParams) => defHttp.put({ url: Api.USER_EDIT, data });

/**
 * @description: 用户管理-删除用户
 */
export const deleteUserApi = (params: DeleteUserParams) =>
  defHttp.delete({ url: Api.USER_DELETE, params });

/**
 * @description: 用户管理-启用停用用户账号
 */
export const stopOrStartUserApi = (data: StopOrStartUserParams) =>
  defHttp.put({ url: Api.USER_STOP_OR_START, data });

/**
 * @description: 用户管理-超级管理员或管理, 进行重置用户密码操作
 */
export const managerResetPasswordApi = (data: ResetUserPwdParams) =>
  defHttp.put({ url: Api.USER_RESET_PWD, data });
