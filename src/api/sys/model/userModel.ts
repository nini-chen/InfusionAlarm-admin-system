// /**
//  * @description: Login interface parameters
//  */
// export interface LoginParams {
//   username: string;
//   password: string;
// }

// export interface RoleInfo {
//   roleName: string;
//   value: string;
// }

// /**
//  * @description: Login interface return value
//  */
// export interface LoginResultModel {
//   userId: string | number;
//   token: string;
//   role: RoleInfo;
// }

// /**
//  * @description: Get user information return value
//  */
// export interface GetUserInfoModel {
//   roles: RoleInfo[];
//   // 用户id
//   userId: string | number;
//   // 用户名
//   username: string;
//   // 真实名字
//   realName: string;
//   // 头像
//   avatar: string;
//   // 介绍
//   desc?: string;
// }

/**
 * @description: AccessToken interface parameters
 */
export interface AccessTokenModel {
  access_token: string;
  expires: number;
}

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  number: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

// /**
//  * @description: Login interface return value
//  */
// export interface LoginResultModel {
//   // 此字段是token值
//   data: string;
//   status: string;
// }

/**
 * @description: 路由权限节点数据
 */
export interface RouterAuthNode {
  id: number;
  node_level: number;
  node_name: string;
  node_pid: number;
  node_status: number;
  node_title: string;
  children: RouterAuthNode[];
}

/**
 * @description: 用户详情
 */
export interface UserDetail {
  id: number;
  // 是否是默认用户
  is_default: number;
  // 用户身份名称
  role_name: string;
  user_role_name: string;
  user_create_time: string;
  user_email: string;
  // 用户名称
  user_name: string;
  // 用户账号
  user_number: string;
  // 用户身份id
  user_role: string;
  // 用户状态
  user_status: number;
  user_telphone: string;
  remarks: string;
}

/**
 * @description: 用户分区
 */
export interface UserPartition {
  // 病区id
  id: number;
  // 病区名称
  partition_name: string;
  // 医护主机总数
  host_num: number;
  // icu版本医护主机总数
  icu_host_num: number;
  // 是否是icu病区 1是 0不是
  is_icu: number;
}

/**
 * @description: 用户信息：路由权限 + token + 用户详情
 */
export interface GetUserInfoModel {
  node: RouterAuthNode[];
  token: string;
  userinfo: UserDetail;
  user_partition: UserPartition[];
  is_signin: number;
}

/**
 * @description: 用户身份id
 */
export interface RoleParams {
  role_id: number | string;
}

/**
 * @description: 版本号相关数据
 */
export interface VersionResult {
  version: string;
}

/**
 * @description: 重置密码
 */
export interface ResetUserPwdParams {
  user_password: string;
  token: string;
}
