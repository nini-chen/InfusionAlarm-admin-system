<template>
  <div class="pb-6 enter-x">
    <div class="flex items-center justify-center">
      <img class="h-34px" src="../../../assets/images/login-logo.png" />
      <div class="ml-4 text-2xl system-title">
        {{ title }}
      </div>
    </div>
    <h2 class="enter-x pt-12">
      <span class="text-blue-500 border-b-2 pb-2 border-b-blue-500 font-PingFangSCMedium font-base">
        {{ t('sys.login.signInFormTitle') }}
      </span>
    </h2>
  </div>
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        class="fix-auto-fill"
        size="large"
        allowClear
        v-model:value="formData.account"
        :placeholder="t('sys.login.accountPlaceholder')"
        :maxlength="20"
        @change="changeAccount"
      >
        <template #prefix>
          <SvgIcon size="16" name="login-user" />
        </template>
      </Input>
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.passwordPlaceholder')"
        :maxlength="100"
      >
        <template #prefix>
          <SvgIcon size="16" name="login-pwd" />
        </template>
      </InputPassword>
    </FormItem>
    <FormItem class="enter-x">
      <Button
        class="mt-7"
        type="primary"
        size="large"
        block
        @click="handleLogin"
        :disabled="disabledLoginBtn"
        :loading="loading"
      >
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
  </Form>
  <!-- 第一次登录时的修改密码弹窗 -->
  <ResetPasswordModal
    :width="520"
    :canFullscreen="false"
    @register="registerResetPwdModal"
    @success="resetPwdSuccess"
  />
</template>
<script lang="ts" setup>
  import { reactive, ref, computed } from 'vue';
  import { SvgIcon } from '/@/components/Icon';
  import { Form, Input, Button } from 'ant-design-vue';
  import { useModal } from '/@/components/Modal';
  import ResetPasswordModal from './ResetPasswordModal.vue';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { useUserStore } from '/@/store/modules/user';
  import { useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useGlobSetting } from '/@/hooks/setting';
  import { oneStepGetUserInfo } from '/@/api/sys/user';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();
  const { title } = useGlobSetting();

  const { getFormRules } = useFormRules();
  const [registerResetPwdModal, { openModal: openResetPwdModal }] = useModal();
  const formRef = ref();
  const loading = ref(false);

  const formData = reactive({
    account: '',
    password: '',
  });

  const { validForm } = useFormValid(formRef);

  const disabledLoginBtn = computed(() => !formData.account || !formData.password);

  function changeAccount(e) {
    if (e.target.value === '') {
      formData.password = '';
    }
  }

  // 判断是否是第一次登录
  async function checkFirstLogin(params): boolean {
    // 获取用户信息
    const userInfo = await oneStepGetUserInfo(params);
    // 如果is_signin：0 说明是第一次登录，此时弹窗弹窗
    if (userInfo?.is_signin === 0) {
      // 弹出弹窗
      openResetPwdModal(true, { record: userInfo, account: params.number });
      return true;
    }
    return false;
  }

  // 非第一次登录，走正常登录操作
  async function goLogin(params): void {
    try {
      loading.value = true;
      const userInfo = await userStore.login(params);
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }

  // 点击登录按钮
  async function handleLogin() {
    // 如果账号、密码内容都没输入(此时登录按钮是淡蓝色处于禁止状态)
    if (disabledLoginBtn.value) return;
    // 如果有输入内容，验证表单
    const data = await validForm();
    if (!data) return;
    // 后端接口接口参数
    const params = {
      password: data.password,
      number: data.account,
      mode: 'none', //不要默认的错误提示
    };
    // 2种情况：
    // 1. 如果第一次登录，则弹窗重置密码弹窗
    const isFirstLogin = await checkFirstLogin(params);
    if (isFirstLogin) return;
    // 2. 如果不是第一次登录，则存起登录信息，筛选出权限路由，并跳转到首页
    goLogin(params);
  }

  // 如果重置了密码，再从新走登录流程
  function resetPwdSuccess(data) {
    goLogin(data);
  }
</script>
<style lang="less" scoped>
  :deep(.ant-input-affix-wrapper) {
    padding: 0 11px 0 0;
    border: 1px solid #d6d6d6;
    .ant-input-prefix {
      margin-right: 12px;
      padding: 12px;
      background-color: #f7f7f7;
    }
    .ant-input {
      min-width: 300px;
      &::-webkit-input-placeholder {
        color: #d6d6d6;
      }
    }
  }

  :deep(.ant-btn-primary, .ant-btn-primary:hover, .ant-btn-primary:focus, .ant-btn-primary:active) {
    color: #fff;
    border-color: #4879fb;
    background-color: #4879fb;
  }
  :deep(
      .ant-btn-primary[disabled],
      .ant-btn-primary[disabled]:hover,
      .ant-btn-primary[disabled]:focus,
      .ant-btn-primary[disabled]:active
    ) {
    color: #fff;
    border-color: rgba(72, 121, 251, 0.7);
    background-color: rgba(72, 121, 251, 0.7);
    text-shadow: none;
    box-shadow: none;
  }

  .system-title {
    color: #4879fb;
    font-size: 30px;
    line-height: initial;
    font-family: 'PingFangSCMedium, sans-serif';
  }
</style>
