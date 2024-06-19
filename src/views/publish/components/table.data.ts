import { BasicColumn } from '/@/components/Table';
import { FormSchema } from '/@/components/Form/index';

export const listColumns: BasicColumn[] = [
  {
    title: '内容',
    dataIndex: 'content',
  },

  {
    title: '当前状态',
    dataIndex: 'play_status',
    width: '150px',
    slots: { customRender: 'play_status' },
  },
];

export const modalFormSchemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 24,
    },
    show: false,
  },
  {
    field: 'index',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 24,
    },
    show: false,
  },
  {
    field: 'remarks',
    component: 'InputTextArea',
    label: '信息内容',
    colProps: {
      span: 24,
    },
    componentProps: {
      placeholder: '请输入通知提示',
      rows: 6,
      maxlength: 150,
      showCount: true,
    },
    rules: [{ required: true, message: '请输入通知提示' }],
  },
];

export const sloganFormSchemas: FormSchema[] = [
  {
    field: 'id',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 24,
    },
    show: false,
  },
  {
    field: 'index',
    component: 'Input',
    label: ' ',
    colProps: {
      span: 24,
    },
    show: false,
  },
  {
    field: 'remarks',
    component: 'InputTextArea',
    label: '信息内容',
    colProps: {
      span: 24,
    },
    componentProps: ({ formModel }) => {
      return {
        placeholder: '请输入病区标语',
        rows: 6,
        maxlength: 60,
        showCount: true,
        onInput: (e) => {
          // 限制部分在走廊屏无法显示的特殊字符
          formModel.remarks = e.target?.value?.replace(/[`#=|{}':;',\\\[\]\/\s]/g, '');
        },
      };
    },
    rules: [{ required: true, message: '请输入病区标语' }],
  },
];
