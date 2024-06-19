// 表格自定义选项方法：

// table 组件某一行 或者 form 表单某一项 进行自定义

import { h } from 'vue';
import { formatToDateTime } from '/@/utils/dateUtil';
import { isNullAndUnDef } from '/@/utils/is';

/**
 * @description table选项-时间格式化
 */
export const tableTimeRender = ({ text }) => formatToDateTime(text);

/**
 * @description table选项-状态自定义展示
 * @param Array states
 */
export const tableStateRender =
  (states: LabelValueOptions) =>
  ({ text }) => {
    if (isNullAndUnDef(text)) return;
    const match = states.find((x) => x.value == text);
    if (!match) return;
    const { key, label } = match;
    const color = key ? key : 'black';
    return h(
      'span',
      {
        style: `color: ${color};`,
      },
      label,
    );
  };

/**
 * @description table选项-针对空数据的选项 使用占位符 -- 替代
 */
export const tableEmptyRender = ({ text }) => (text ? text : '--');
