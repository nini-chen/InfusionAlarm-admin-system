import { defHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';

enum Api {
  SAVE_NOTICE_LIST = '/api/v2/notice/lists',
  GET_NOTICE_ONE = '/api/v2/notice/one',
  GET_ONE_STATUS = '/api/v2/urgentnotice/one',
  GET_SLOGAN_LIST = '/api/v2/slogan/lists',
  SAVE_SLOGAN_LIST = '/api/v2/slogan/lists',
  RELEASE_ONE = '/api/v2/urgentnotice/one',
}

/**
 * @description: 紧急通知-获取当前播放的(可用作状态，有数据时就是紧急发布)
 */
export const getOneStatus = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_ONE_STATUS,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/************ 通知提示 start ***************/
/**
 * @description: 通知提示列表也保存
 */
export const saveNoticeList = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.SAVE_NOTICE_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 获取通知提示列表
 */
export const getNoticeList = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.SAVE_NOTICE_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 获取单个通知提示
 */
export const getNoticeOne = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_NOTICE_ONE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/************ 通知提示 end ***************/

/************ 病区标语 start ***************/

/**
 * @description: 病区标语-列表
 */
export const getSloganList = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.get(
    {
      url: Api.GET_SLOGAN_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 病区标语-保存
 */
export const saveSloganList = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.SAVE_SLOGAN_LIST,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/************ 病区标语 end ***************/

/************ 紧急发布 start ***************/

/**
 * @description: 紧急通知-发布
 */
export const releaseOne = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.post(
    {
      url: Api.RELEASE_ONE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/**
 * @description: 紧急通知-取消发布
 */
export const closeRelease = (params, mode: ErrorMessageMode = 'message') => {
  return defHttp.delete(
    {
      url: Api.RELEASE_ONE,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
};

/************ 紧急发布 end ***************/
