import { computed } from 'vue';
import { BasicColumn, FormSchema, FormProps } from '/@/components/Table';
import { tableStateRender } from '/@/utils/tableRender';
import {
  phoneRules,
  emailRules,
  // strictPwdRules
} from '/@/utils/customRules';
import { oninputDeal } from '/@/utils/formRender';

import { useUserStore } from '/@/store/modules/user';
import { getRoleListApi } from '/@/api/doctors/role';

const userStore = useUserStore();
const partitionOptions = computed(() => userStore?.getSelectPartitions);

/**
 * 角色数据过滤
 * @description: 如果角色选项power字段等于false， 说明 当前用户 无权操作次角色
 */
async function filterRoleOptions() {
  const data = await getRoleListApi();
  return data.data?.length > 0 ? data.data.filter((x) => x.power) : [];
}

/**
 * @description: 表单中的选项上下之间的分隔线
 */
const dividerLine: FormSchema = {
  field: 'divider-basic',
  component: 'Divider',
  label: '',
  colProps: {
    span: 23,
    offset: 1,
  },
};

const statusOptions: LabelValueOptions = [
  { label: '启用中', value: 1, key: '#2DA641' },
  { label: '已停用', value: 2, key: '#FF4D4F' },
];

export const columns: BasicColumn[] = [
  {
    title: '账号',
    dataIndex: 'user_number',
  },
  {
    title: '姓名',
    dataIndex: 'user_name',
  },
  {
    title: '病区',
    dataIndex: 'partition_name',
  },
  {
    title: '角色',
    dataIndex: 'role_name',
  },
  {
    title: '状态',
    dataIndex: 'user_status',
    customRender: tableStateRender(statusOptions),
  },
];

/**
 * @description: 列表页table搜索表单
 */
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 10,
    compact: true,
    showAdvancedButton: true,
    actionColOptions: {
      xl: 6,
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
          xl: 4,
        },
      },
      {
        field: 'user_partition',
        component: 'Select',
        label: ' ',
        componentProps: {
          placeholder: '请选择病区',
          fieldNames: { label: 'partition_name', value: 'id' },
          options: partitionOptions,
        },
        itemProps: {
          wrapperCol: {
            prefixCls: 'form-item-fit-width', // 添加个类的样式，解决内容过多超出表单的问题
          },
        },
        colProps: {
          xs: 5,
          xl: 4,
        },
      },
      {
        field: 'user_role',
        component: 'Input',
        label: ' ',
        slot: 'roleSlot',
        colProps: {
          xs: 5,
          xl: 4,
        },
      },
    ],
  };
}

const pwdItems: FormSchema[] = [
  {
    field: 'user_password',
    label: '密码',
    component: 'InputPassword',
    slot: 'pwdSlot',
    colProps: {
      span: 24,
    },
  },
  // {
  //   field: 'user_password',
  //   label: '密码',
  //   component: 'InputPassword',
  //   componentProps: {
  //     allowClear: true,
  //     placeholder: '输入可更新密码',
  //     autocomplete: 'off',
  //   },
  // },
  // {
  //   field: 'verifyPassword',
  //   label: '确认密码',
  //   component: 'InputPassword',
  //   dynamicRules: ({ values }) => {
  //     return [
  //       {
  //         validator: (_, value) => {
  //           if (value !== values.user_password && values.user_password) {
  //             return Promise.reject('密码不一致');
  //           }
  //           return Promise.resolve();
  //         },
  //       },
  //     ];
  //   },
  //   componentProps: {
  //     allowClear: true,
  //     placeholder: '再次输入新密码',
  //     autocomplete: 'off',
  //   },
  //   colProps: {
  //     offset: 2,
  //   },
  // },
];

// 新增和编辑普通用户、新增管理员
export const dealModalSchemas: FormSchema[] = [
  {
    field: 'user_name',
    component: 'Input',
    label: '姓名',
    required: true,
    componentProps: ({ formModel }) => {
      return {
        maxLength: 20,
        allowClear: true,
        placeholder: '请输入姓名',
        onInput: (e) => {
          formModel.user_name = oninputDeal(e);
        },
      };
    },
  },
  {
    field: 'user_number',
    component: 'Input',
    label: '账号',
    required: true,
    componentProps: {
      placeholder: '请输入账号',
    },
    rules: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      {
        min: 4,
        max: 20,
        pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]{4,20}$/,
        message:
          '账号4-20位，由数字、字母、下划线中的一种或多种组成，不区分大小写，不能输入空格或特殊字符',
        trigger: 'blur',
      },
    ],
    colProps: {
      offset: 2,
    },
  },
  ...pwdItems,
  dividerLine,
  {
    field: 'user_partition',
    component: 'Select',
    label: '所属病区',
    componentProps: {
      options: partitionOptions,
      fieldNames: { label: 'partition_name', value: 'id' },
      placeholder: '请选择所属病区',
    },
    required: true,
  },
  {
    field: 'user_role',
    component: 'ApiSelect',
    label: '角色',
    required: true,
    componentProps: {
      api: filterRoleOptions,
      resultField: 'data',
      labelField: 'role_name',
      valueField: 'id',
      placeholder: '请选择所属角色',
      notFoundContent: '无角色，请先添加角色',
    },
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'user_telphone',
    component: 'Input',
    label: '手机号码',
    rules: phoneRules,
    componentProps: {
      maxLength: 11,
      placeholder: '请输入手机号码',
    },
  },
  {
    field: 'user_email',
    component: 'Input',
    label: '邮箱',
    rules: emailRules,
    componentProps: {
      placeholder: '请输入邮箱',
    },
    colProps: {
      offset: 2,
    },
  },
  {
    field: 'remarks',
    component: 'InputTextArea',
    label: '备注',
    componentProps: {
      maxlength: 100,
      allowClear: true,
      showCount: true,
      placeholder: '请输入备注',
    },
    colProps: {
      span: 24,
    },
  },
];

// 编辑管理员（部分选项不可编辑，仅展示）
export const editAdminSchemas: FormSchema[] = [
  {
    field: 'user_name',
    component: 'Input',
    label: '姓名',
    required: true,
    componentProps: ({ formModel }) => {
      return {
        maxLength: 20,
        allowClear: true,
        placeholder: '请输入姓名',
        onInput: (e) => {
          formModel.user_name = oninputDeal(e);
        },
      };
    },
  },
  {
    field: 'user_number',
    component: 'Input',
    label: '账号',
    render: ({ model, field }) => model[field],
    colProps: {
      offset: 2,
    },
    componentProps: {
      placeholder: '请输入账号',
    },
  },
  ...pwdItems,
  dividerLine,
  {
    field: 'user_partition',
    component: 'Input',
    label: '所属病区',
    render: () => '全院',
  },
  {
    field: 'user_role',
    component: 'Input',
    label: '角色',
    render: () => '超级管理员',
    colProps: {
      offset: 2,
    },
  },
];
