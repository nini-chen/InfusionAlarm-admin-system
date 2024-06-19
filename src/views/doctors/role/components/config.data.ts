import { BasicColumn, FormSchema } from '/@/components/Table';
import { tableEmptyRender } from '/@/utils/tableRender';

export const columns: BasicColumn[] = [
  {
    title: '角色名称',
    dataIndex: 'role_name',
  },
  {
    title: '角色描述',
    dataIndex: 'role_remarks',
    customRender: tableEmptyRender,
  },
];

export const dealModalSchemas: FormSchema[] = [
  {
    field: 'role_name',
    component: 'Input',
    label: '角色名称',
    required: true,
    componentProps: {
      maxlength: 10,
      allowClear: true,
      placeholder: '请输入角色名称',
    },
  },
  {
    field: 'role_remarks',
    component: 'InputTextArea',
    label: '角色描述',
    componentProps: {
      placeholder: '请输入角色描述',
      allowClear: true,
      showCount: true,
      maxlength: 100,
    },
  },
  {
    field: 'node_id',
    component: 'Select',
    label: '权限管理',
    slot: 'roleTree',
    required: true,
    itemProps: {
      wrapperCol: {
        prefixCls: 'auth-control',
      },
    },
  },
];
