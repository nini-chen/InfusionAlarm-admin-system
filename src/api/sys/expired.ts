// 平台使用到期页面

import { defHttp } from '/@/utils/http/axios';

export interface ExpiredRangeResult {
  startDate: Date;
  endDate: Date;
}

enum Api {
  MACHINE = '/api/v2/author/getUuid',
  ACTIVATE = '/api/v2/author/auto_pass',
  EXPIRED_RANGE = '/api/v2/author/getAuthorDate',
}

/**
 * @description: 获取机器码
 */
export const getMachineCodeApi = () => defHttp.get<string>({ url: Api.MACHINE });

/**
 * @description: 激活平台使用权限
 * @param {string} code 激活码
 */
export const activatePlatformApi = (code: string) =>
  defHttp.post<boolean>({
    url: Api.ACTIVATE,
    data: {
      passnum: code,
    },
  });

/**
 * @description: 获取平台使用范围日期（用于判断是否过期，注意：开始日期和结束日期相同时，说明可以永久使用本平台）
 */
export const getExpireDateRangeApi = () =>
  defHttp.get<ExpiredRangeResult>({ url: Api.EXPIRED_RANGE });
