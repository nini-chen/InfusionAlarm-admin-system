import { defHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  GetUserInfoModel,
  AccessTokenModel,
  RouterAuthNode,
  RoleParams,
  VersionResult,
  ResetUserPwdParams,
} from './model/userModel';

import { ErrorMessageMode } from '/#/axios';
import { useUserStore } from '/@/store/modules/user';

enum Api {
  AccessToken = '/accessToken',
  Login = '/api/v2/login/login',
  Logout = '/api/v2/login/logout',
  GetUserInfo = '/api/v2/login/login',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
  GetRoleNode = '/api/v2/node/getRoleNode',
  GetAllRole = '/api/v2/node/getAllNode',
  CheckRoleBind = '/api/v2/role/checkRoleUser',
  VERSION = '/api/v2/partition/getHospitalVersion',
  FIRST_RESET_PASSWORD = '/api/v2/login/editPassword',
}

/**
 * @description: 获取授权码
 */
export function getAccessTokenApi() {
  return defHttp.get<AccessTokenModel>(
    {
      url: Api.AccessToken,
      params: {
        client_id: '20882088',
        secret: 'nGk5R2wrnZqQ02bed29rjzax1QWRIu1O',
      },
    },
    {
      errorMessageMode: 'none',
    },
  );
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<string>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: 获取用户信息详情
 */
export function getUserInfoApi() {
  return defHttp.get<GetUserInfoModel>({ url: Api.GetUserInfo }, { errorMessageMode: 'none' });
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.delete<boolean>(
    { url: Api.Logout },
    {
      errorMessageMode: 'none',
    },
  );
}

/**
 * @description: 根据身份获取权限
 */
export const getRoleMenuList = (params: RoleParams) => {
  return defHttp.get<RouterAuthNode[]>({ url: Api.GetRoleNode, params });
};

/**
 * @description: 获取所有的权限
 */
export const getAllRoleApi = () => defHttp.get<RouterAuthNode[]>({ url: Api.GetAllRole });

/**
 * @description: 判断某个角色是否被用于用户绑定了
 * @returns yes / no
 */
export const checkRoleBindApi = (role_id: number) =>
  defHttp.get<string>({ url: Api.CheckRoleBind, params: { role_id } });

/**
 * @description: 获取web版本号相关数据
 */
export const getWebVersionApi = () => defHttp.get<VersionResult>({ url: Api.VERSION });

/**
 * @description: 重设密码（用户第一次登录 或 被管理员重置密码的第一次登录）
 */
export const firstResetPasswordApi = (data: ResetUserPwdParams) => {
  const userStore = useUserStore();
  const { token, ...args } = data;
  return defHttp.put({
    url: Api.FIRST_RESET_PASSWORD,
    data: args,
    headers: {
      Authorization: `Bearer ${userStore.getAccessToken}`,
      token,
    },
  });
};

/**
 * @description: 输入账号密码直接返回用户信息（集成3个步骤：获取access_token -> 获取token -> 返回用户信息）
 */
export const oneStepGetUserInfo = async (data: LoginParams) => {
  const userStore = useUserStore();
  const res = await getAccessTokenApi();
  if(res) {
    const { access_token, expires } = res;
    userStore.setAccessToken({ access_token, expires });
    const token = await defHttp.post<string>({
      url: Api.Login,
      data: {
        ...data,
        isFirst: 1,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return defHttp.get<any>({
      url: Api.GetUserInfo,
      headers: {
        Authorization: `Bearer ${access_token}`,
        token,
      },
    });
  }
};
