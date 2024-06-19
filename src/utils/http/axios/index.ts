// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosResponse } from 'axios';
import type { RequestOptions, Result } from '/#/axios';
import type { AxiosTransform, CreateAxiosOptions } from './axiosTransform';
import { VAxios } from './Axios';
import { checkStatus } from './checkStatus';
import { useGlobSetting } from '/@/hooks/setting';
import { useMessage } from '/@/hooks/web/useMessage';
import { ResultEnum, RequestEnum, ContentTypeEnum } from '/@/enums/httpEnum';
import { isString } from '/@/utils/is';
import { getAccessToken, getToken } from '/@/utils/auth';
import { setObjToUrlParams, deepMerge } from '/@/utils';
import { useErrorLogStoreWithOut } from '/@/store/modules/errorLog';
import { useI18n } from '/@/hooks/web/useI18n';
import { joinTimestamp, formatRequestDate } from './helper';
import { useUserStoreWithOut } from '/@/store/modules/user';
import { AxiosRetry } from '/@/utils/http/axios/axiosRetry';
import { debug } from 'console';

const globSetting = useGlobSetting();
const urlPrefix = globSetting.urlPrefix;
const { createMessage, createErrorModal } = useMessage();

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据。如果数据不是预期格式，可直接抛出错误
   */
  transformRequestHook: (res: AxiosResponse<Result>, options: RequestOptions) => {
    if (!res) return;
    const { t } = useI18n();
    const { isTransformResponse, isReturnNativeResponse } = options;
    // 当需要返回整个请求的所有信息：包括请求头配置、响应数据等 的时候开启
    if (isReturnNativeResponse) {
      return res;
    }
    // 当需要返回响应的数据包含：data，result，return_message这些信息时开启
    if (!isTransformResponse) {
      return res.data;
    }
    // 大多数情况下，只需要拿到响应数据的最内层data
    const { data, result, return: returnCode, return_message } = res.data;
    if (result === 200 || returnCode === 200) {
      return data;
    } else if (result === 400) {
      return res.data;
    }
    // 此处处理异常的响应状态：判断result值
    let errorMsg = '';
    switch (result) {
      // 处理505
      case ResultEnum.LOGOUT:
        errorMsg = t('sys.api.errMsg505');
        useUserStoreWithOut().logout(true);
        break;
      default:
        if (return_message) {
          errorMsg = return_message;
        }
    }

    // errorMessageMode='message' 一般情况
    if (options.errorMessageMode === 'modal') {
      createErrorModal({ title: t('sys.api.errorTip'), content: errorMsg });
    }
    // errorMessageMode=‘modal’的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
    else if (options.errorMessageMode === 'message') {
      createMessage.error(errorMsg);
    }
    // 处理undefined或者null的情况
    else if (!options.errorMessageMode) {
      createMessage.error(errorMsg || t('sys.api.apiRequestFailed'));
    }

    throw new Error(errorMsg || t('sys.api.apiRequestFailed'));
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate, joinTime = true, urlPrefix } = options;

    if (joinPrefix) {
      config.url = `${urlPrefix}${config.url}`;
    }

    if (apiUrl && isString(apiUrl)) {
      config.url = `${apiUrl}${config.url}`;
    }
    // const params = config.params || {};
    // const data = config.data || false;
    const sign: string = useUserStoreWithOut().getAccessToken;
    const baseParams = {
      company: 'BL',
      device_name: 'TE-0600R',
      sign,
      // 如get请求api/aa/bbb, 则写成get_bbb
      actioncode: `${config.method?.toLowerCase()}_${config.url?.replace(/.*\//, '')}`,
    };
    const params = {
      ...baseParams,
      data: config.params || {},
    };
    const data = {
      ...baseParams,
      data: config.data || false,
    };

    formatDate && data && !isString(data) && formatRequestDate(data);
    if (config.method?.toUpperCase() === RequestEnum.GET) {
      if (!isString(params)) {
        // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
        config.params = Object.assign(params || {}, joinTimestamp(joinTime, false));
      } else {
        // 兼容restful风格
        config.url = config.url + params + `${joinTimestamp(joinTime, true)}`;
        config.params = undefined;
      }
    } else {
      if (!isString(params)) {
        formatDate && formatRequestDate(params);
        if (Reflect.has(config, 'data') && config.data && Object.keys(config.data).length > 0) {
          config.data = data;
          config.params = params;
        } else {
          // 非GET请求如果没有提供data，则将params视为data
          config.data = params;
          config.params = undefined;
        }
        if (joinParamsToUrl) {
          config.url = setObjToUrlParams(
            config.url as string,
            Object.assign({}, config.params, config.data),
          );
        }
      } else {
        // 兼容restful风格
        config.url = config.url + params;
        config.params = undefined;
      }
    }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config, options) => {
    const accessToken = getAccessToken();
    const token = getToken();
    if (accessToken) {
      (config as Recordable).headers.Authorization = options.authenticationScheme
        ? `${options.authenticationScheme} ${accessToken}`
        : accessToken;
    }
    if (token && (config as Recordable)?.requestOptions?.withToken !== false) {
      // jwt token
      (config as Recordable).headers.token = token || '';
    }
    return config;
  },

  /**
   * @description: 响应拦截器处理
   */
  responseInterceptors: (res: AxiosResponse<any>) => {
    return res;
  },

  /**
   * @description: 响应错误处理
   */
  // responseInterceptorsCatch: (error: any) => {
  responseInterceptorsCatch: (axiosInstance: AxiosResponse, error: any) => {
    const { t } = useI18n();
    const errorLogStore = useErrorLogStoreWithOut();
    errorLogStore.addAjaxErrorInfo(error);
    const { response, code, message, config } = error || {};
    const errorMessageMode = config?.requestOptions?.errorMessageMode || 'none';
    const msg: string = response?.message || response?.data?.message;
    const err: string = error?.toString?.() ?? '';
    let errMessage = '';

    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
        errMessage = t('sys.api.apiTimeoutMessage');
      }
      if (err?.includes('Network Error')) {
        errMessage = t('sys.api.networkExceptionMsg');
      }

      if (errMessage) {
        if (errorMessageMode === 'modal') {
          createErrorModal({ title: t('sys.api.errorTip'), content: errMessage });
        } else if (errorMessageMode === 'message') {
          createMessage.error(errMessage);
        }
        return Promise.reject(error);
      }
    } catch (error) {
      throw new Error(error as unknown as string);
    }

    // 区别处理错误状态
    checkStatus(error?.response?.status, msg, errorMessageMode);

    // 添加自动重试机制 保险起见 只针对非401、505的GET请求
    const retryRequest = new AxiosRetry();
    const { isOpenRetry } = config.requestOptions.retryRequest;
    if (
      config.method?.toUpperCase() === RequestEnum.GET &&
      isOpenRetry &&
      error?.response?.status != 505 &&
      error?.response?.status != 401
    ) {
      // @ts-ignore
      retryRequest.retry(axiosInstance, error);
    }

    return Promise.reject(error);
  },
};

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        authenticationScheme: 'Bearer',
        timeout: 10 * 1000,
        // 基础接口地址
        // baseURL: globSetting.apiUrl,
        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: globSetting.apiUrl,
          // 接口拼接地址
          urlPrefix: urlPrefix,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: true,
          // 接口报错后重试
          retryRequest: {
            isOpenRetry: true,
            count: 2,
            waitTime: 200,
          },
        },
      },
      opt || {},
    ),
  );
}
export const defHttp = createAxios();

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//     urlPrefix: 'xxx',
//   },
// });
