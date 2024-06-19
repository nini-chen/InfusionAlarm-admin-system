/** 
 * 使用方式：
引入： import { phoneRules } from '/@/views/ward/wardRules';
表单配置项：
{ field: 'phone',
   label: '手机号',
   component: 'Input',
   dynamicRules: phoneRules,
 },
*/

import type { Rule } from '/@/components/Form/src/types/form';

/**
 * @description 验证跑是否为8的倍数
 */
export const verificationSize = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('不能为空');
        } else if (!/^[0-9]*$/.test(value)) {
          return Promise.reject('只能输入数字');
        } else if (value % 8) {
          return Promise.reject('请按格式输入');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};

/**
 * @description 验证不能为空且不能输入空格
 */
export const verificationNull = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('内容不能为空');
        } else if (!/^\S+$/.test(value)) {
          return Promise.reject('不能输入空格');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};

/**
 * @description 验证病区编号
 */
export const verificationWardCode = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('请输入病区编号');
        } else if (!/^\S+$/.test(value)) {
          return Promise.reject('不能输入空格');
        } else if (!/^[0-9]*$/.test(value)) {
          return Promise.reject('只能输入数字');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};

/**
 * @description 验证病区名称
 */
export const verificationWardName = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('请输入病区名称');
        } else if (!/^[\u4e00-\u9fa5_a-zA-Z0-9_(_（_)_）_,_，_:_：_—_\-_/_\n]+$/.test(value)) {
          return Promise.reject('不能输入空格或者特殊字符');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};

/**
 * @description 验证病区唯一编码
 */
export const verificationAreaCode = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('请输入病区唯一编码');
        } else if (!/^[0-9a-zA-Z_]{1,}$/.test(value)) {
          return Promise.reject('由20位以内数字、字母组成，区分大小写，不能输入空格或特殊字符');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};

/**
 * @description 手机或者座机号码验证
 */
export const verificationIphoneCode = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('请输入联系方式');
        } else if (!/^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/.test(value)) {
          return Promise.reject('输入手机号码或座机号码');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};

/**
 * @description 验证设备编号
 */
export const verificationDeviceCode = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('请输入设备编号');
        } else if (!/^\S+$/.test(value)) {
          return Promise.reject('不能输入空格');
        } else if (!/^[0-9]*$/.test(value)) {
          return Promise.reject('只能输入数字');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};

/**
 * @description 验证UID
 */
export const verificationUid = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('请输入uId');
        } else if (!/^\S+$/.test(value)) {
          return Promise.reject('不能输入空格');
        } else if (!/^[0-9]*$/.test(value)) {
          return Promise.reject('只能输入数字');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};
