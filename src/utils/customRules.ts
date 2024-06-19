// 公用表单验证相关

import type { Rule } from '/@/components/Form/src/types/form';

/**
 * @description 验证IP地址
 */
export const ipRules = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('内容不能为空');
        } else if (!/^\S+$/.test(value)) {
          return Promise.reject('不能输入空格');
        } else if (
          !/^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/.test(
            value,
          )
        ) {
          return Promise.reject('请输入正确的IP地址');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};

/**
 * @description 验证MAC地址
 */
export const macRules = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('内容不能为空');
        } else if (!/^\S+$/.test(value)) {
          return Promise.reject('不能输入空格');
        } else if (
          !/[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}-[A-F\d]{2}/.test(
            value.toUpperCase(),
          )
        ) {
          return Promise.reject('请输入正确的MAC地址');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};

/**
 * @description 验证子网掩码
 */
export const maskRules = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('内容不能为空');
        } else if (!/^\S+$/.test(value)) {
          return Promise.reject('不能输入空格');
        } else if (
          !/^(254|252|248|240|224|192|128|0)\.0\.0\.0|255\.(254|252|248|240|224|192|128|0)\.0\.0|255\.255\.(254|252|248|240|224|192|128|0)\.0|255\.255\.255\.(254|252|248|240|224|192|128|0)$/.test(
            value,
          )
        ) {
          return Promise.reject('请输入正确的子网掩码');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};

/**
 * @description 验证网关
 */
export const gatewayRules = (): Rule[] => {
  return [
    {
      required: true,
      validator: async (_, value) => {
        if (!value) {
          return Promise.reject('内容不能为空');
        } else if (!/^\S+$/.test(value)) {
          return Promise.reject('不能输入空格');
        } else if (
          !/^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[0-9]))$/.test(
            value,
          )
        ) {
          return Promise.reject('请输入正确的网关');
        }
        return Promise.resolve();
      },
      trigger: 'change',
    },
  ];
};

// =================================
// ==============手机号==========
// =================================

/**
 * @description 手机号的正则
 */
export const phonePattern = /^1[3|4|5|7|8]\d{9}$/;

/**
 * @description 非必选-手机号格式验证
 */
export const phoneRules = [{ pattern: phonePattern, message: '手机号格式不正确' }]; /**

/**
 * 必选-手机号验证
 * @description  注意：vben表单必选项，使用dynamicRules属性，必须同级加上 required: true，才会验证非空，否则仅会验证正则部分
 * import { phoneDynamicRules } from '/@/utils/customRules';
 * {
    field: 'phone',
    label: '手机号',
    component: 'Input',
    required: true,
    dynamicRules: phoneDynamicRules,
    componentProps: {
      placeholder: '请输入手机号',
    },
  },
 */
export const phoneDynamicRules = (): Rule[] => {
  return [{ required: true, message: '请输入手机号' }, ...phoneRules];
};

// =================================
// ==============邮箱==========
// =================================

/**
 * @description 邮箱验证的正则
 */
export const emailPattern =
  /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;

/**
 * @description 非必选-邮箱验证
 */
export const emailRules = [
  {
    pattern: emailPattern,
    message: '邮箱格式不正确',
  },
];

/**
 * 必选-邮箱验证
 * @description  注意：vben表单必选项，使用dynamicRules属性，必须同级加上 required: true，才会验证非空，否则仅会验证正则部分
 * import { emailDynamicRules } from '/@/utils/customRules';
 * {
    field: 'email',
    label: '邮箱',
    component: 'Input',
    required: true,
    dynamicRules: emailDynamicRules,
    componentProps: {
      placeholder: '请输入邮箱',
    },
  },
 */
export const emailDynamicRules = (): Rule[] => {
  return [{ required: true, message: '请输入邮箱' }, ...emailRules];
};

// =================================
// ==============密码==========
// =================================

// 特殊字符有~`!@#$￥%^&*()_-[]{}|\;:'"<>,./?+=

/**
 * 严格密码验证的正则
 * @description 密码必须包含数字、小写字母、大写字母和特殊字符中的至少3种，且长度在8到16之间。
 *
 */
export const strictPwdPattern =
  // /(?=.*[\d])(?=.*[a-z])(?=.*[A-Z\W_])[\dA-Za-z\W_]{8,16}/;
  /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,16}$/;

/**
 * @description 非必选-严格密码验证
 * @example  
 * import { strictPwdRules } from '/@/utils/customRules';
 * {
    field: 'user_password',
    label: '密码',
    component: 'InputPassword',
    rules: strictPwdRules,
    componentProps: {
      placeholder: '输入可更新密码',
    },
  },
 */
export const strictPwdRules = [
  {
    pattern: strictPwdPattern,
    message: '长度不得少于8位，由数字、大&小写字母、符号组成（至少4选3）',
  },
];

/**
 * 必选-严格密码验证
 * @description 注意：vben表单必选项，使用dynamicRules属性，必须同级加上 required: true，才会验证非空，否则仅会验证正则部分
 * @example  
 * import { strictPwdDynamicRules } from '/@/utils/customRules';
 * {
    field: 'user_password',
    label: '密码',
    component: 'InputPassword',
    required: true,
    dynamicRules: strictPwdDynamicRules,
    componentProps: {
      placeholder: '输入可更新密码',
    },
  },
 */
export const strictPwdDynamicRules = (): Rule[] => {
  return [{ required: true, message: '请输入密码' }, ...strictPwdRules];
};

/**
 * @description 简单密码验证的正则
 */
export const simplePwdPattern =
  // /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{6,16}$/;
  /^[a-zA-Z0-9\W_!@#$%^&*`~()-+=]{6,16}$/;
/**
 * @description 非必选-简单密码验证
 */
export const simplePwdRules = [
  {
    pattern: simplePwdPattern,
    message: '密码长度不得少于6位，由任意数字、字母、符号或其组合组成',
  },
];

/**
 * @description 必选-简单密码验证
 */
export const simplePwdDynamicRules = (): Rule[] => {
  return [{ required: true, message: '请输入密码' }, ...simplePwdRules];
};

/**
 * @description 再次确认密码
 * @param {string} passwordKeyName 密码字段的名称
 */
export const verifyPwdDynamicRules =
  (passwordKeyName: string) =>
  ({ values }): Rule[] => {
    return [
      {
        required: true,
        validator: (_, value) => {
          if (!value) {
            return Promise.reject('请输入密码');
          }
          if (value !== values[passwordKeyName] && values[passwordKeyName]) {
            return Promise.reject('密码不一致!');
          }
          return Promise.resolve();
        },
      },
    ];
  };

// =================================
// ==============身份证号码==========
// =================================

/**
 * @description 身份证号验证的正则
 */
// export const identifyPattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
export const identifyPattern = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

/**
 * @description 非必选-身份证号验证
 */
export const identifyRules = [
  {
    pattern: identifyPattern,
    message: '身份证号码格式错误',
  },
];
