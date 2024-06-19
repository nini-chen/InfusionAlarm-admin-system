<template>
  <BasicModal
    v-bind="$attrs"
    destroyOnClose
    @register="register"
    @ok="validateForm"
    @visible-change="handleVisibleChange"
  >
    <div class="pt-3px pr-4 min-h-200">
      <BasicForm class="set-role-form" @register="registerForm">
        <template #roleTree="{ model, field }">
          <!-- v-model:value="model[field]" -->
          <BasicTree
            v-if="treeData.length > 0"
            ref="roleTreeRef"
            class="role-auth-tree"
            checkable
            :treeData="treeData"
            :checkedKeys="checkedKeys"
            @check="handleTreeCheck"
            :replaceFields="{ key: 'id', title: 'node_title', children: 'children' }"
          />
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { filter, eachTree } from '/@/utils/helper/treeHelper';

  import { dealModalSchemas } from './config.data';
  import { getRoleMenuList } from '/@/api/sys/user';
  import { addRoleApi, editRoleApi } from '/@/api/doctors/role';

  const emit = defineEmits(['success', 'register']);
  const { createMessage } = useMessage();
  const editId = ref<string>('');
  const treeData = ref<TreeItem[]>([]);
  const roleTreeRef = ref<Nullable<TreeActionType>>(null);
  const checkedKeys = ref<Array<string | number>>([1, 2, 3, 28, 29]);

  // 新建的时候,将 后台用户配置\后台角色配置\院区管理\设备管理\信息交互设置\IC卡管理 这个几个路由页面的都禁用; 编辑的时候, role_id 不为1 的时候禁用
  const disabledRouteNames = [
    'DoctorsUser',
    'DoctorsRole',
    'WardHospital',
    'WardDevice',
    'SystemInteraction',
    'SystemVersion',
    'IcCard',
    'System',
  ];

  const [registerForm, { setFieldsValue, validateFields, clearValidate, resetFields }] = useForm({
    schemas: dealModalSchemas,
    labelWidth: 90,
    baseColProps: {
      span: 24,
    },
    colon: true,
    showActionButtonGroup: false,
  });

  const [register, { setModalProps }] = useModalInner((data) => {
    onDataReceive(data);
  });

  // 此处产品要求，患者管理（id:1）、床位一览（id:2）、病房一览（id:3）病床分机（id:28）家属分机（id:29）菜单要实现同步取消、同步勾选
  function handleTreeCheck(checked) {
    const patientsKeys = [1, 2, 3, 28, 29];
    // 验证选项值，目的是为了实时的消除或弹出红色警告
    validateFields(['node_id']);
    // 判断新值是否有值（至少有一个id或者3个id都没有）
    const newHasVal = patientsKeys.some((key) => checked.includes(key));
    const newAllChecked = patientsKeys.every((key) => checked.includes(key));
    // 判断旧值是否有值（只有2种情况：1、2、3同时存在；或同时不存在）
    const oldHasVal = checkedKeys.value.includes(1);
    if (!oldHasVal && newHasVal) {
      checkedKeys.value = [...new Set([...checked, ...patientsKeys])];
    } else if ((oldHasVal && !newHasVal) || (oldHasVal && newHasVal && !newAllChecked)) {
      checkedKeys.value = checked.filter((key) => !patientsKeys.includes(key));
    } else {
      checkedKeys.value = checked;
    }
    // debugger;
    roleTreeRef.value?.setCheckedKeys(checkedKeys.value);
    // 每次点击都验证一次
    setFieldsValue({
      node_id: checkedKeys.value || [],
    });
  }

  async function onDataReceive(data) {
    // 重置一些值
    editId.value = '';
    // checkedKeys.value = [];
    setModalProps({
      title: data.isUpdate ? '编辑角色' : '新增角色',
    });

    // 给角色权限 tree组件添加数据
    if (data?.treeData) {
      // 信息发布内容管理 这个模块目前v1版本不做，此处把菜单过滤掉
      treeData.value = filter(data?.treeData, (node) => {
        // 当新建的时候, 根据路由名称禁用某些菜单节点
        const DefaultDisabled = disabledRouteNames.includes(node.node_name);
        // 当编辑的时候, 根据role_id字段禁用某些菜单节点
        const editDisabled = data.isUpdate && data.record.role_id != 1 && DefaultDisabled;
        node.disabled = data.isUpdate ? editDisabled : DefaultDisabled;
        if (node.id != 11) {
          return node;
        }
      });
      console.log('treeData', treeData);
      // 将tree组件展开
      nextTick(() => {
        roleTreeRef.value?.expandAll(true);
      });
    }

    // 下面是给表单赋值
    if (data.isUpdate) {
      // 当编辑时
      const { id, role_name, role_remarks } = data.record;
      editId.value = id;
      // 获取当前角色之前勾选的权限菜单id
      const nodeIds = await getRoleMenuList({ role_id: id });
      let checkedParentIds = [];
      // 筛选出tree的父节点id
      eachTree(treeData.value, (_, parentNode) => {
        if (Object.keys(parentNode).length > 0) {
          // 患者管理除外 （由于患者管理模块下的所有菜单是同时选中、同时取消的，此处不需要处理）
          parentNode.id != 1 && checkedParentIds.push(parentNode.id);
        }
      });
      // 给tree设置勾选状态，只需要赋值子节点id即可
      checkedKeys.value = nodeIds.filter((x) => !checkedParentIds.includes(x));
      // debugger;
      // 给表单赋值
      setFieldsValue({
        role_name,
        role_remarks,
        node_id: checkedKeys.value || [],
        // node_id: [1, 2, 3],
      });
      // console.log('checkedKeys', checkedKeys.value);
      // validateFields(['node_id']);
    } else {
      // 当新建时
      setFieldsValue({
        role_name: '',
        role_remarks: '',
        node_id: checkedKeys.value || [],
      });
      clearValidate();
    }
  }

  function handleVisibleChange(v) {
    !v && resetFields();
  }

  async function handleSubmit(formValues) {
    // 子级已经勾选了，父级的id也要传给后端
    let checkedIds = [];
    eachTree(treeData.value, (node, parentNode) => {
      if (checkedKeys.value.includes(node.id)) {
        checkedIds.push(node.id);
        parentNode.id && checkedIds.push(parentNode.id);
      }
    });
    try {
      if (editId.value) {
        formValues = { ...formValues, node_id: [...new Set(checkedIds)], role_id: editId.value };
        await editRoleApi(formValues);
      } else {
        formValues = { ...formValues, node_id: [...new Set(checkedIds)] };
        await addRoleApi(formValues);
      }
      createMessage.success('操作成功');
      setModalProps({
        confirmLoading: false,
        visible: false,
      });
      emit('success');
    } catch (error) {
      createMessage.error(error.message || '操作失败');
      setModalProps({
        confirmLoading: false,
      });
    }
  }

  async function validateForm() {
    setModalProps({
      confirmLoading: true,
    });
    try {
      const res = await validateFields();
      handleSubmit(res);
    } catch (error) {
      console.log('not passing', error);
      setModalProps({
        confirmLoading: false,
      });
    }
  }
</script>
<style lang="less">
  .set-role-form {
    .role-auth-tree {
      min-height: 1000px;
      background-color: transparent;
    }

    .auth-control {
      flex-direction: column-reverse;

      .ant-form-item-explain.ant-form-item-explain-error {
        padding-top: 5px;
      }
    }
  }
</style>
