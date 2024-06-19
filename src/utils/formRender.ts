// 表单自定义选项方法：
import { formatToDateTime } from '/@/utils/dateUtil';

/**
 * @description input框 改成 纯文本展示
 */
export const formTextRender = ({ model, field }) => model[field];

/**
 * @description form选项-时间格式化
 */
export const formTimeRender = ({ model, field }) => formatToDateTime(model[field]);

/**
 * @description 特殊字符的正则
 */
export const specialCodePattern =
  /[`~!@#%$^\-&*()=_+|{}':;',\\\[\]\.<>\/?~！@#%_+￥……&*（）——|{}【】'；：""'。，、？\s]/g;

/**
 * @description form选项-InputSearch组件输入框禁止输入空格和特殊字符，将字符和空格删掉处理
 */
export const oninputDeal = (e: ChangeEvent) => {
  return e.target?.value?.replace(specialCodePattern, '');
};

export const spaceCodePattern = /[\s]/g;
/**
 * @description form选项-InputSearch组件输入框禁止输入空格,空格删掉处理
 */
export const oninputSpaceDeal = (e: ChangeEvent) => {
  return e.target?.value?.replace(spaceCodePattern, '');
};

/**
 * @description form选项-仅能输入正整数
 */
export const onlyInputNumber = (e: ChangeEvent) => {
  return e.target?.value?.replace(/\D/g, '');
};

/**
 * @description form选项-仅能输入数字和字母
 */
export const onlyCodeNumber = (e: ChangeEvent) => {
  return e.target?.value?.replace(/[^\a-\z\A-\Z0-9]/g, '');
};
