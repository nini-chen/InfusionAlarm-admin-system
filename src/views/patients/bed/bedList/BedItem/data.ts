import { FormSchema } from '/@/components/Form/index';
import { formTextRender, oninputDeal, onlyCodeNumber } from '/@/utils/formRender';
import { phoneRules, identifyRules } from '/@/utils/customRules';

import moment, { Moment } from 'moment';
import { getPopupContainer } from '/@/utils';

import { useUserStore } from '/@/store/modules/user';
import { infoConfigSelectApi } from '/@/api/patients/bed';

const userStore = useUserStore();

// 用户禁止选中大于今天的日期
const disabledDate = (current: Moment) => {
  return current && current > moment().endOf('day');
};

export const sexOptions: LabelValueOptions = [
  {
    value: '1',
    label: '男',
  },
  {
    value: '2',
    label: '女',
  },
  // {
  //   value: '3',
  //   label: '其他',
  // },
];

export const bloodLabels = [
  '无',
  'A型',
  'B型',
  'AB型',
  'O型',
  'Rh阴性(A型)',
  'Rh阴性(B型)',
  'Rh阴性(AB型)',
  'Rh阴性(O型)',
];
// 血型  1：A型  2：B型  3：AB型   4：O型   5:Rh阴性(A型)  6:Rh阴性(B型)  7:Rh阴性(AB型)   8:Rh阴性(O型)
export const bloodTypeOptions = [
  {
    key: '1',
    value: '1',
    title: 'A型',
    label: 'A型',
  },
  {
    key: '2',
    value: '2',
    title: 'B型',
    label: 'B型',
  },
  {
    key: '3',
    value: '3',
    title: 'AB型',
    label: 'AB型',
  },
  {
    key: '4',
    value: '4',
    title: 'O型',
    label: 'O型',
  },
  {
    key: 'rh',
    value: 'rh',
    title: 'Rh阴性',
    label: 'Rh阴性',
    disabled: true,
    children: [
      {
        key: '5',
        value: '5',
        title: 'A型',
        label: 'Rh阴性（A型）',
      },
      {
        key: '6',
        value: '6',
        title: 'B型',
        label: 'Rh阴性（B型）',
      },
      {
        key: '7',
        value: '7',
        title: 'AB型',
        label: 'Rh阴性（AB型）',
      },
      {
        key: '8',
        value: '8',
        title: 'O型',
        label: 'Rh阴性（O型）',
      },
    ],
  },
];

export const sickOptions: LabelValueOptions = [
  {
    value: '1',
    label: '正常',
  },
  {
    value: '2',
    label: '病危',
  },
  {
    value: '3',
    label: '病重',
  },
];

export const adviceTypeOptions: LabelValueOptions = [
  {
    value: '1',
    label: '检查',
  },
  {
    value: '2',
    label: '检验',
  },
  {
    value: '3',
    label: '手术',
  },
  {
    value: '4',
    label: '护理',
  },
  {
    value: '5',
    label: '嘱托',
  },
  {
    value: '6',
    label: '用药',
  },
  {
    value: '7',
    label: '其他',
  },
];

export const longAdviceOptions: LabelValueOptions = [
  {
    value: '1',
    label: '长期',
  },
  {
    value: '2',
    label: '临时',
  },
];

export const rateOptions: LabelValueOptions = [
  {
    value: '1',
    label: 'q1h',
  },
  {
    value: '2',
    label: 'q2h',
  },
  {
    value: '3',
    label: 'q4h',
  },
  {
    value: '4',
    label: 'q6h',
  },
  {
    value: '5',
    label: 'q8h',
  },
  {
    value: '6',
    label: 'q12h',
  },
  {
    value: '7',
    label: 'qd',
  },
  {
    value: '8',
    label: 'qod',
  },
  {
    value: '9',
    label: 'bid',
  },
  {
    value: '10',
    label: 'bidac',
  },
  {
    value: '11',
    label: 'tidac',
  },
  {
    value: '12',
    label: 'tid',
  },
  {
    value: '13',
    label: 'qm',
  },
  {
    value: '14',
    label: 'qn',
  },
  {
    value: '15',
    label: 'hs',
  },
  {
    value: '16',
    label: 'qid',
  },
];
export const useOptions: LabelValueOptions = [
  {
    value: '1',
    label: 'Gtt',
  },
  {
    value: '2',
    label: 'Po',
  },
  {
    value: '3',
    label: 'H',
  },
  {
    value: '4',
    label: 'Iv',
  },
  {
    value: '5',
    label: 'Im',
  },
];
/**
 * @description: 表单中的选项上下之间的分隔线
 */
const dividerLine: FormSchema = {
  field: 'divider-basic',
  component: 'Divider',
  label: '',
  colProps: {
    span: 24,
  },
};

/**
 * @description: 换床位弹窗-表单选项配置
 */
export const changeBedSchemas: FormSchema[] = [
  {
    field: 'bedName',
    component: 'Input',
    label: '当前床号',
    render: formTextRender,
  },
  {
    field: 'patient_name',
    component: 'Input',
    label: '患者姓名',
    render: formTextRender,
  },
  {
    field: 'bed_id',
    component: 'Select',
    label: '目标床号',
    slot: 'bedSlot',
    required: true,
  },
];

/**
 * @description: 金钱支付，限制保留小数点后2位
 */
export const moneyReder = {
  min: 0,
  maxlength: 20,
  // decimalSeparator: 0.01,
  formatter: (value: string) =>
    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'),
  parser: (value: string) =>
    value.replace(/[^\.\d]/g, '').replace(/^(-)*(\d+)\.(\d\d).*$/, '$1$2.$3'),
};

/**
 * @description: 添加入院登记信息弹窗-表单选项配置
 */
export const patientInfoSchemas: FormSchema[] = [
  {
    field: 'patient_number',
    label: '住院号',
    required: true,
    component: 'Input',
    componentProps: ({ formModel }) => {
      return {
        maxlength: 20,
        min: 1,
        allowClear: true,
        placeholder: '请输入住院号',
        onInput: (e) => {
          formModel.patient_number = onlyCodeNumber(e);
        },
      };
    },
  },
  {
    field: 'patient_id',
    component: 'Input',
    label: '病人ID',
    required: true,
    componentProps: ({ formModel }) => {
      return {
        maxlength: 20,
        min: 1,
        allowClear: true,
        placeholder: '请输入病人ID',
        onInput: (e) => {
          formModel.patient_id = onlyCodeNumber(e);
        },
      };
    },
  },
  {
    field: 'patient_livedate',
    component: 'DatePicker',
    label: '入院时间',
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      getCalendarContainer: getPopupContainer,
    },
    required: true,
  },
  dividerLine,
  {
    field: 'patient_name',
    component: 'Input',
    label: '姓名',
    required: true,
    componentProps: ({ formModel }) => {
      return {
        maxLength: 5,
        allowClear: true,
        placeholder: '请输入姓名',
        onInput: (e) => {
          formModel.patient_name = oninputDeal(e);
        },
      };
    },
  },
  {
    field: 'bedName',
    component: 'Input',
    label: '病床号',
    componentProps: {
      placeholder: '请输入病床号',
    },
    dynamicDisabled: true,
  },
  {
    field: 'patient_phone_number',
    label: '电话号码',
    component: 'Input',
    rules: phoneRules,
    componentProps: ({ formModel }) => {
      return {
        min: 0,
        maxlength: 11,
        allowClear: true,
        placeholder: '请输入电话号码',
        onInput: (e) => {
          formModel.patient_phone_number = oninputDeal(e);
        },
      };
    },
  },
  {
    field: 'patient_sex',
    component: 'Select',
    label: '性别',
    componentProps: {
      options: sexOptions,
    },
    required: true,
  },
  {
    field: 'patient_age',
    component: 'InputNumber',
    label: '年龄',
    componentProps: ({ formModel }) => {
      return {
        min: 1,
        maxlength: 5,
        allowClear: true,
        placeholder: '请输入年龄',
        onInput: (e) => {
          formModel.patient_age = oninputDeal(e);
        },
      };
    },
    required: true,
  },
  {
    field: 'patient_birthday',
    component: 'DatePicker',
    label: '生日',
    componentProps: () => {
      return {
        format: 'YYYY-MM-DD',
        valueFormat: 'YYYY-MM-DD',
        disabledDate,
        getCalendarContainer: getPopupContainer,
      };
    },
  },
  {
    field: 'patient_blood',
    label: '血型',
    component: 'Input',
    slot: 'bloodSlot',
  },
  {
    field: 'patient_nativeplace',
    component: 'Input',
    label: '籍贯',
    componentProps: ({ formModel }) => {
      return {
        maxLength: 5,
        allowClear: true,
        placeholder: '请输入籍贯',
        onInput: (e) => {
          formModel.patient_nativeplace = oninputDeal(e);
        },
      };
    },
  },
  {
    field: 'patient_patient_responce',
    component: 'Input',
    label: '病人身份',
    componentProps: ({ formModel }) => {
      return {
        maxLength: 5,
        allowClear: true,
        placeholder: '请输入病人身份',
        onInput: (e) => {
          formModel.patient_patient_responce = oninputDeal(e);
        },
      };
    },
  },
  {
    field: 'patient_idcard',
    component: 'Input',
    label: '身份证号',
    rules: identifyRules,
    componentProps: ({ formModel }) => {
      return {
        maxLength: 18,
        allowClear: true,
        placeholder: '请输入身份证号',
        onInput: (e) => {
          const isNum18 = formModel.patient_idcard.length === 18;
          // 第18位仅能输入正整数或字母X；
          if (isNum18) {
            const codePattern = new RegExp('[0-9]+');
            const replaceVal = codePattern.test(e.data) ? e.data : 'X';
            // 第十八位，如果不是数字，都替换成大写字母X
            formModel.patient_idcard = e.target?.value?.substring(0, 17) + replaceVal;
            return;
          }
          // 前面17位仅能输入正整数；
          formModel.patient_idcard = e.target?.value?.replace(/\D/g, '');
        },
      };
    },
  },
  {
    field: 'patient_address',
    component: 'Input',
    label: '地址',
    colProps: {
      span: 16,
    },
    componentProps: ({ formModel }) => {
      return {
        maxLength: 50,
        allowClear: true,
        placeholder: '请输入地址',
        onInput: (e) => {
          formModel.patient_address = oninputDeal(e);
        },
      };
    },
  },
  {
    field: 'patient_emergency_contact',
    component: 'Input',
    label: '紧急联系人',
    componentProps: ({ formModel }) => {
      return {
        maxLength: 5,
        allowClear: true,
        placeholder: '请输入紧急联系人',
        onInput: (e) => {
          formModel.patient_emergency_contact = oninputDeal(e);
        },
      };
    },
  },
  {
    field: 'patient_emergency_contact_phone_number',
    label: '联系人电话',
    component: 'Input',
    rules: phoneRules,
    componentProps: ({ formModel }) => {
      return {
        min: 0,
        maxlength: 11,
        allowClear: true,
        placeholder: '请输入联系人电话',
        onInput: (e) => {
          formModel.patient_emergency_contact_phone_number = oninputDeal(e);
        },
      };
    },
  },
  dividerLine,
  {
    field: 'project',
    component: 'Input',
    defaultValue: null,
    label: '科室（病区）',
    render: () => {
      return userStore.getCurrentPartition.partition_name;
    },
  },
  {
    field: 'inconfig_1',
    label: '护理级别',
    component: 'Input',
    slot: 'careSlot',
    required: true,
  },
  {
    field: 'num',
    component: 'InputNumber',
    label: '住院次数',
    defaultValue: 0,
    componentProps: ({ formModel }) => {
      return {
        min: 0,
        maxlength: 5,
        allowClear: true,
        placeholder: '请输入住院次数',
        onInput: (e) => {
          formModel.InputNumber = oninputDeal(e);
        },
      };
    },
  },
  {
    field: 'patient_illness',
    label: '病情',
    component: 'Select',
    componentProps: {
      options: sickOptions,
    },
  },
  {
    field: 'diagnosis',
    component: 'Input',
    label: '诊断',
    colProps: {
      span: 16,
    },
    required: true,
    componentProps: ({ formModel }) => {
      return {
        maxlength: 50,
        allowClear: true,
        whitespace: true,
        placeholder: '请输入诊断',
        onInput: (e) => {
          // 限制输入纯空格 (文本中间有空格则允许)
          const currentVal = e.target.value.trim();
          if (currentVal === '') {
            formModel.diagnosis = currentVal;
          }
        },
      };
    },
  },
  {
    field: 'patient_doctor',
    label: '责任医生',
    slot: 'doctorSlot',
    component: 'Input',
    required: true,
  },
  {
    field: 'patient_nurse',
    label: '责任护士',
    component: 'Input',
    slot: 'nurseSlot',
  },
  {
    field: 'operation_time',
    component: 'DatePicker',
    label: '手术时间',
    componentProps: {
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
      getCalendarContainer: getPopupContainer,
    },
  },
  dividerLine,
  {
    field: 'inconfig_6',
    label: '医保类型',
    component: 'ApiSelect',
    required: true,
    componentProps: {
      api: infoConfigSelectApi,
      params: {
        type: 6,
        page: 0,
      },
      labelField: 'name',
      valueField: 'id',
      immediate: true,
    },
  },
  {
    field: 'before_money',
    component: 'InputNumber',
    label: '预交金额',
    componentProps: moneyReder,
  },
  {
    field: 'after_money',
    component: 'InputNumber',
    label: '未结算金额',
    componentProps: moneyReder,
  },
  dividerLine,
  {
    field: 'inconfig_5',
    label: '隔离类别',
    component: 'Select',
    slot: 'config5Slot',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'inconfig_3',
    label: '饮食类别',
    component: 'Select',
    slot: 'config3Slot',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'inconfig_4',
    label: '药物反应',
    component: 'Select',
    slot: 'config4Slot',
    colProps: {
      span: 24,
    },
  },
  {
    field: 'inconfig_2',
    label: '安全防范',
    component: 'Select',
    slot: 'config2Slot',
    colProps: {
      span: 24,
    },
    itemProps: {
      wrapperCol: {
        prefixCls: 'last-row-height',
      },
    },
  },
];

/**
 * @description: 添加医嘱信息弹窗-表单选项配置
 */
export const addAdviceSchemas: FormSchema[] = [
  {
    field: 'patient_number',
    component: 'Input',
    label: '住院号',
    render: formTextRender,
  },
  {
    field: 'patient_id',
    component: 'Input',
    label: '病人ID',
    colProps: {
      span: 11,
      offset: 1,
    },
    render: formTextRender,
  },
  {
    field: 'patient_name',
    component: 'Input',
    label: '姓名',
    render: formTextRender,
  },
  {
    field: 'num',
    component: 'InputNumber',
    label: '住院次数',
    colProps: {
      span: 11,
      offset: 1,
    },
    render: formTextRender,
  },
  {
    field: 'advice_type',
    component: 'Select',
    label: '医嘱类型',
    componentProps: {
      options: adviceTypeOptions,
    },
    colProps: {
      span: 13,
    },
    required: true,
  },
  {
    field: 'advice_content',
    component: 'InputTextArea',
    label: '医嘱内容',
    required: true,
    componentProps: {
      maxlength: 100,
      showCount: true,
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'advice_timetype',
    label: '长临嘱',
    component: 'Select',
    componentProps: {
      options: longAdviceOptions,
    },
    required: true,
    colProps: {
      span: 13,
    },
  },
  {
    field: 'advice_race',
    label: '频率',
    component: 'Select',
    componentProps: {
      options: rateOptions,
      getPopupContainer,
    },
    colProps: {
      span: 13,
    },
  },
  {
    field: 'advice_usage',
    label: '用法',
    component: 'Select',
    componentProps: {
      options: useOptions,
    },
    colProps: {
      span: 13,
    },
  },
  {
    field: 'dateRange',
    label: '时间范围',
    component: 'RangePicker',
    componentProps: {
      // showTime: true,
      format: 'YYYY-MM-DD',
      valueFormat: 'YYYY-MM-DD',
    },
    colProps: {
      span: 16,
    },
    required: true,
  },
];
