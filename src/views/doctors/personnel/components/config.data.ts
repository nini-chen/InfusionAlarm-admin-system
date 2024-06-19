import { computed } from 'vue';

import { BasicColumn, FormSchema, FormProps } from '/@/components/Table';
import { tableStateRender, tableEmptyRender } from '/@/utils/tableRender';
import { phoneRules } from '/@/utils/customRules';
import { oninputDeal } from '/@/utils/formRender';

import { useUserStore } from '/@/store/modules/user';
const userStore = useUserStore();
const partitionOptions = computed(() => userStore?.getSelectPartitions);
/**
 * 病区选项框：用户是非超级管理员，要禁用且赋值默认值
 */
// 病区选项框-设置禁用
const partitionDisabled = computed(() => (userStore.getUserInfo.roleId == '1' ? false : true));
// 病区选项框-设置默认值
const partitionSelectVal = computed(() =>
  userStore.getUserInfo.roleId == '1' ? null : partitionOptions.value[0].value,
);

// 图片路径，是名称路径是固定的
export const defaultAvatars = [
  '/static_field/default/icon_1_1.png',
  '/static_field/default/icon_1_2.png',
  '/static_field/default/icon_2_1.png',
  '/static_field/default/icon_2_2.png',
];

export const maleOptions: LabelValueOptions = [
  { label: '男', value: 1 },
  { label: '女', value: 2 },
  // { label: '其他', value: 3 },
];

export const personTypeOptions: LabelValueOptions = [
  { label: '医疗人员', value: 1 },
  { label: '护理人员', value: 2 },
];

export const columns: BasicColumn[] = [
  {
    title: '姓名',
    dataIndex: 'staff_name',
  },
  {
    title: '工号',
    dataIndex: 'staff_number',
  },

  {
    title: '职级',
    dataIndex: 'position_name',
  },
  {
    title: '类型',
    dataIndex: 'staff_type',
    customRender: tableStateRender(personTypeOptions),
  },
  {
    title: '病区',
    dataIndex: 'partition_name',
  },
  {
    title: '性别',
    dataIndex: 'staff_sex',
    customRender: tableStateRender(maleOptions),
  },
  {
    title: '年龄',
    dataIndex: 'staff_age',
    customRender: tableEmptyRender,
  },
  {
    title: '民族',
    dataIndex: 'staff_nation',
    customRender: tableEmptyRender,
  },
  {
    title: '电话',
    dataIndex: 'staff_telphone',
    customRender: tableEmptyRender,
  },
  {
    title: '居住地址',
    dataIndex: 'staff_address',
    customRender: tableEmptyRender,
  },
];

/**
 * @description: 列表页table搜索表单
 */
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 10,
    actionColOptions: {
      lg: 6,
      xl: 8,
      xxl: 3,
    },
    schemas: [
      {
        field: 'keyword',
        label: ' ',
        component: 'Input',
        slot: 'keywordSlot',
        colProps: {
          xs: 5,
          md: 4,
        },
      },
      {
        field: 'user_partition',
        component: 'Select',
        label: ' ',
        ifShow: userStore.getUserInfo.roleId == '1',
        componentProps: {
          placeholder: '请选择病区',
          fieldNames: { label: 'partition_name', value: 'id' },
          options: partitionOptions,
        },
        colProps: {
          xs: 5,
          md: 4,
        },
        itemProps: {
          wrapperCol: {
            prefixCls: 'form-item-fit-width', // 添加个类的样式，解决内容过多超出表单的问题
          },
        },
      },
    ],
  };
}

export const dealModalSchemas: FormSchema[] = [
  {
    field: 'staff_avatar',
    component: 'Input',
    label: '照片',
    slot: 'uploadItem',
  },
  {
    field: 'staff_partition_id',
    component: 'Select',
    label: '病区',
    defaultValue: partitionSelectVal,
    componentProps: {
      placeholder: '请选择病区',
      fieldNames: { label: 'partition_name', value: 'id' },
      options: partitionOptions,
      disabled: partitionDisabled,
    },
    required: true,
  },
  {
    field: 'staff_name',
    label: '姓名',
    component: 'Input',
    componentProps: {
      maxLength: 20,
      allowClear: true,
      placeholder: '请输入姓名',
    },
    required: true,
  },
  {
    field: 'staff_type',
    component: 'Input',
    label: '人员类型',
    slot: 'staffTypeItem',
    componentProps: {
      allowClear: true,
      placeholder: '请选择人员类型',
    },
  },
  {
    field: 'staff_position_id',
    label: '职级',
    component: 'Input',
    slot: 'positionItem',
    componentProps: {
      allowClear: true,
      placeholder: '请输入职级',
    },
    required: true,
  },
  {
    field: 'staff_sex',
    component: 'Select',
    label: '性别',
    slot: 'sexItem',
    componentProps: {
      allowClear: true,
      placeholder: '请选择性别',
    },
    required: true,
  },
  {
    field: 'staff_number',
    component: 'InputNumber',
    label: '工号',
    required: true,
    componentProps: {
      min: 1,
      maxlength: 20,
      allowClear: true,
      placeholder: '请输入工号',
    },
  },
  {
    field: 'staff_age',
    component: 'InputNumber',
    label: '年龄',
    componentProps: {
      min: 1,
      maxlength: 5,
      placeholder: '请输入年龄',
    },
  },
  {
    field: 'staff_nation',
    component: 'Input',
    label: '民族',
    componentProps: {
      maxLength: 20,
      allowClear: true,
      placeholder: '请输入民族',
    },
  },
  {
    field: 'staff_telphone',
    component: 'Input',
    label: '手机号码',
    rules: phoneRules,
    componentProps: ({ formModel }) => {
      return {
        min: 0,
        maxLength: 11,
        allowClear: true,
        placeholder: '请输入手机号码',
        onInput: (e) => {
          const val = oninputDeal(e);
          formModel.staff_telphone = val;
        },
      };
    },
  },
  {
    field: 'staff_address',
    component: 'Input',
    label: '居住地址',
    componentProps: {
      maxLength: 50,
      allowClear: true,
      placeholder: '请输入居住地址',
    },
    colProps: {
      span: 24,
    },
  },
  {
    field: 'remarks',
    component: 'InputTextArea',
    label: '备注',
    componentProps: {
      placeholder: '请输入备注',
      allowClear: true,
      showCount: true,
      maxlength: 100,
    },
    colProps: {
      span: 24,
    },
  },
];
