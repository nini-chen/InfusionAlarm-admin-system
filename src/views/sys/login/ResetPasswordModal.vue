<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    destroyOnClose
    title="请设置新密码"
    :closable="false"
    :showCancelBtn="false"
    @ok="validateForm"
  >
    <div class="pt-8 pr-2">
      <BasicForm @register="registerForm" />
      <div>
        <span class="text-gray-500">{{ pwdTip }}</span></div
      >
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { getPopupContainer as getParentContainer } from '/@/utils';
  import { useI18n } from '/@/hooks/web/useI18n';
  import { simplePwdRules, strictPwdRules } from '/@/utils/customRules';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { oninputSpaceDeal } from '/@/utils/formRender';

  import { firstResetPasswordApi } from '/@/api/sys/user';

  const isAdmin = ref(false);
  const account = ref('');
  const token = ref('');
  const { t } = useI18n();
  const { createMessage, createErrorModal } = useMessage();
  const theRules = computed(() => (isAdmin.value ? strictPwdRules : simplePwdRules));
  const emit = defineEmits(['success', 'register']);
  const newPwdRules = () => {
    return [{ required: true, message: '请输入新密码' }, ...theRules.value];
  };

  const schemas = [
    {
      field: 'user_password',
      label: '密码',
      component: 'InputPassword',
      dynamicRules: newPwdRules,
      required: true,
      componentProps: ({ formModel }) => {
        return {
          placeholder: '请输入可更新密码',
          autocomplete: 'off',
          maxLength: 16,
          onInput: (e) => {
            formModel.user_password = oninputSpaceDeal(e);
          },
        };
      },
    },
    {
      field: 'verifyPwd',
      label: '确认密码',
      component: 'InputPassword',
      required: true,
      dynamicRules: ({ values }) => {
        return [
          {
            required: true,
            validator: (_, value) => {
              if (!value.trim()) {
                return Promise.reject('请再次输入新密码');
              }
              if (value !== values.user_password) {
                return Promise.reject('新密码不一致');
              }
              return Promise.resolve();
            },
          },
        ];
      },
      componentProps: ({ formModel }) => {
        return {
          placeholder: '请再次输入新密码',
          autocomplete: 'off',
          maxLength: 16,
          onInput: (e) => {
            formModel.verifyPwd = oninputSpaceDeal(e);
          },
        };
      },
    },
  ];

  const [registerForm, { validateFields, setProps }] = useForm({
    schemas: [],
    labelWidth: 86,
    baseColProps: {
      span: 22,
    },
    colon: true,
    showActionButtonGroup: false,
  });

  // 密码提示（不同角色默认密码不一样）
  const pwdTip = computed(() => {
    return isAdmin.value
      ? '长度不得少于8位，由数字、大&小写字母、符号组成（至少4选3）'
      : '密码长度不得少于6位，由任意数字、字母、符号或其组合组成';
  });

  const [register, { setModalProps }] = useModalInner((data) => {
    account.value = data.account;
    isAdmin.value = data.record.userinfo.user_role == '1';
    token.value = data.record.token;
    setProps({
      schemas,
    });
  });

  async function handleSubmit(formValues) {
    try {
      await firstResetPasswordApi({ ...formValues, token: token.value });
      createMessage.success('设置成功');
      setModalProps({
        confirmLoading: false,
        visible: false,
      });
      // 重新走登录流程
      emit('success', {
        password: formValues.user_password,
        number: account.value,
        mode: 'none',
      });
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: getParentContainer,
      });
    } finally {
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
