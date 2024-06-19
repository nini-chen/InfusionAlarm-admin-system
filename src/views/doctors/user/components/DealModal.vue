<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    destroyOnClose
    @visible-change="handleVisibleChange"
    @ok="validateForm"
  >
    <div class="pt-3px pr-4 pb-25 user-edit-form">
      <BasicForm @register="registerForm">
        <!-- 自定义密码选项 -->
        <template #pwdSlot>
          <!-- 编辑 -->
          <div v-if="editId" class="flex items-center">
            <!-- 重置密码成功 -->
            <template v-if="resetSuccess">
              <Icon icon="ant-design:check-circle-outlined" color="#2da641" size="23" />
              <span class="ml-2 text-gray-500">{{
                `已成功恢复当前用户的默认密码：${pwdTip}，再次登录时需修改新密码`
              }}</span>
            </template>
            <!-- 未点击重置 -->
            <template v-else>
              <Button type="primary" ghost @click="handleResetPwd">密码重置</Button>
              <span class="ml-2 text-gray-500">{{
                `点击重置会恢复默认密码：${pwdTip}，再次登录时需修改新密码`
              }}</span>
            </template>
          </div>
          <!-- 新增 -->
          <div v-else>
            <span class="text-gray-500"> 默认密码：123456 </span>
          </div>
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, reactive, computed } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { Button } from '/@/components/Button';
  import { Icon } from '/@/components/Icon';

  import { dealModalSchemas, editAdminSchemas } from './config.data';
  import { addUserApi, editUserApi, managerResetPasswordApi } from '/@/api/doctors/user';

  // import { strictPwdRules, simplePwdRules } from '/@/utils/customRules';

  const editId = ref<string>('');
  const resetSuccess = ref<boolean>(false);
  const emit = defineEmits(['success', 'register']);
  const { createMessage } = useMessage();

  const [registerForm, { setFieldsValue, updateSchema, validateFields, resetFields, setProps }] =
    useForm({
      schemas: dealModalSchemas,
      labelWidth: 86,
      baseColProps: {
        span: 11,
      },
      colon: true,
      showActionButtonGroup: false,
    });

  // 密码提示（不同角色默认密码不一样）
  const pwdTip = computed(() => {
    return formOperations.operateType === 'editAdmin' ? 'Ad666666' : '123456';
  });

  function setEditAdminProps(record: Recordable) {
    setModalProps({
      title: '编辑管理员信息',
    });
    setProps({
      schemas: editAdminSchemas,
    });
    // updateSchema([
    //   {
    //     field: 'user_password',
    //     rules: strictPwdRules,
    //     suffix: '',
    //   },
    // ]);
    // 添加密码选项：重置密码按钮
    setFieldsValue(record);
  }

  function setEditUserProps(record: Recordable) {
    setModalProps({
      title: '编辑用户信息',
    });
    setProps({
      schemas: dealModalSchemas,
    });
    updateSchema([
      // {
      //   field: 'user_password',
      //   rules: simplePwdRules,
      //   suffix: '',
      // },
      {
        field: 'user_number',
        dynamicDisabled: true,
      },
    ]);
    setFieldsValue(record);
  }

  function setDefaultProps() {
    editId.value = '';
    setModalProps({
      title: '添加用户',
    });
    setProps({
      schemas: dealModalSchemas,
    });
    updateSchema([
      // {
      //   field: 'user_password',
      //   rules: simplePwdRules,
      //   suffix: '默认密码：123456',
      // },
      {
        field: 'user_number',
        dynamicDisabled: false,
      },
    ]);
  }

  const formOperations = reactive({
    operateType: 'default',
    editAdmin: setEditAdminProps,
    editUser: setEditUserProps,
    default: setDefaultProps,
  });

  const setFormConfig = (operateType: 'editAdmin' | 'editUser' | 'default', data: Recordable) => {
    formOperations.operateType = operateType;
    return formOperations[operateType](data);
  };

  const [register, { setModalProps }] = useModalInner((data) => {
    const { id, user_role } = data.record;
    const type = !data.isUpdate ? 'default' : user_role == '1' ? 'editAdmin' : 'editUser';
    editId.value = id || '';
    // 针对不同的情况，设置表单项
    setFormConfig(type, data.record);
  });

  function handleVisibleChange(v) {
    resetSuccess.value = false;
    !v && resetFields();
  }

  async function handleSubmit(formValues) {
    try {
      if (editId.value) {
        formValues = {
          ...formValues,
          id: editId.value,
          user_password: formValues.user_password,
        };
        await editUserApi(formValues);
      } else {
        await addUserApi(formValues);
      }
      createMessage.success('操作成功');
      setModalProps({
        confirmLoading: false,
        visible: false,
      });
      emit('success');
    } catch (error) {
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

  // 超级管理员/管理员编辑操作,重置别人密码
  async function handleResetPwd() {
    try {
      const res = await managerResetPasswordApi({
        id: editId.value,
      });
      if (res === true) {
        createMessage.success('操作成功!');
        resetSuccess.value = true;
      } else {
        createMessage.error('操作失败!');
      }
    } catch (error) {}
  }
</script>
<style lang="less">
  .user-edit-form {
    .ant-divider {
      margin-top: 8px;
    }

    // 当新增用户时，此处改一下默认密码提示语的样式
    #user_password {
      flex-direction: column;
      .suffix {
        padding: 10px 0 0 0;
        color: #999;
      }
    }

    // 解决select文本超长时顶出界
    .ant-form-item-control-input-content > div {
      display: inherit !important;
    }
  }
</style>
