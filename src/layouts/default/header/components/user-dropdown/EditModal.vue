<template>
  <BasicModal
    :min-height="300"
    :title="modalTitle"
    v-bind="$attrs"
    :showOkBtn="false"
    :showCancelBtn="false"
    destroyOnClose
    @register="registerModal"
    @visible-change="handleVisibleChange"
  >
    <template #insertFooter>
      <div v-loading="loading">
        <template v-if="isEditPhone || showPwd">
          <Button @click="handleCancel" class="mr-4">取消</Button>
          <Button type="primary" @click="handleSubmit">确认</Button>
        </template>
        <template v-else>
          <Button class="mr-4" type="primary" @click="editPhone">编辑</Button>
        </template>
      </div>
    </template>
    <div class="px-10px">
      <Row class="readonly-info">
        <Col :span="12">
          <span class="label">姓名: </span>
          <span class="content">{{ userInfo.realName }}</span>
        </Col>
        <Col :span="12">
          <span class="label">账号: </span>
          <span class="content">{{ userInfo.username }}</span>
        </Col>
      </Row>
      <BasicForm v-if="showPwd" @register="registerForm1" />
      <Row v-else class="readonly-info">
        <Col :span="12" class="flex items-center">
          <span class="label">密码: </span>
          <span class="content mr-4">********</span>
          <Button type="link" @click="editPwd">修改密码</Button>
        </Col>
      </Row>

      <Divider style="margin: 0" />

      <Row class="readonly-info">
        <Col :span="12">
          <span class="label">所属病区: </span>
          <!-- bug：139842要求 管理员身份此处显示--，普通身份显示他所在的病区 -->
          <span class="content">{{ userInfo.roleId == '1' ? '--' : partition.partition_name }}</span>
        </Col>
        <Col :span="12">
          <span class="label">角色: </span>
          <span class="content">{{ userInfo.roleName }}</span>
        </Col>
      </Row>

      <Divider style="margin: 0" />

      <BasicForm v-if="isEditPhone" class="!mt-4" @register="registerForm2" />

      <Row v-else class="readonly-info">
        <Col :span="12">
          <span class="label">手机号码: </span>
          <span class="content">{{ userInfo.userTelphone }}</span>
        </Col>
        <Col :span="12">
          <span class="label">邮箱: </span>
          <span class="content">{{ userInfo.userEmail }}</span>
        </Col>
        <Col :span="24">
          <span class="label">备注: </span>
          <span class="content">{{ userInfo.remarks }}</span>
        </Col>
      </Row>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, nextTick, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Button, Divider, Row, Col } from 'ant-design-vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import {
    simplePwdRules,
    strictPwdRules,
    phoneRules,
    emailRules,
    // verifyPwdDynamicRules
  } from '/@/utils/customRules';

  import { editUserApi } from '/@/api/doctors/user';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();

  const showPwd = ref<boolean>(false);
  const isEditPhone = ref<boolean>(false);
  const loading = ref<boolean>(false);

  const partition = computed(() => userStore.getCurrentPartition);

  const userInfo = computed(() => userStore.getUserInfo || {});
  const modalTitle = computed(() =>
    isEditPhone.value || showPwd.value ? '编辑用户信息' : '用户信息',
  );

  const theRules = userStore.getUserInfo.roleId == '1' ? strictPwdRules : simplePwdRules;

  const oldPwdRules = (): Rule[] => {
    return [{ required: true, message: '请输入旧密码' }, ...theRules];
  };

  const newPwdRules = (): Rule[] => {
    return [{ required: true, message: '请输入新密码' }, ...theRules];
  };

  const schemas1: FormSchema[] = [
    {
      field: 'oldpassword',
      label: '密码',
      component: 'InputPassword',
      dynamicRules: oldPwdRules,
      required: true,
      componentProps: {
        placeholder: '请输入旧密码',
        autocomplete: 'off',
        maxLength: 16,
      },
    },
    {
      field: 'user_password',
      label: '新密码',
      component: 'InputPassword',
      dynamicRules: newPwdRules,
      required: true,
      componentProps: {
        placeholder: '请输入新密码',
        autocomplete: 'off',
        maxLength: 16,
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
              if (!value) {
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
      componentProps: {
        placeholder: '请再次输入新密码',
        autocomplete: 'off',
        maxLength: 16,
      },
    },
  ];

  const schemas2: FormSchema[] = [
    {
      field: 'user_telphone',
      component: 'Input',
      label: '手机号码',
      rules: phoneRules,
      componentProps: {
        maxLength: 20,
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

  const [registerForm1, { validateFields: validate1 }] = useForm({
    labelWidth: 80,
    schemas: schemas1,
    showActionButtonGroup: false,
    baseColProps: {
      span: 12,
    },
  });

  const [registerForm2, { validateFields: validate2, setFieldsValue: setFieldsValue2 }] = useForm({
    labelWidth: 80,
    schemas: schemas2,
    showActionButtonGroup: false,
    baseColProps: {
      span: 12,
    },
  });

  const [
    registerModal,
    {
      // closeModal
    },
  ] = useModalInner(() => {});

  function handleVisibleChange() {
    loading.value = false;
    showPwd.value = false;
    isEditPhone.value = false;
  }

  const handleCancel = () => {
    showPwd.value = false;
    isEditPhone.value = false;
  };

  async function handleSubmit() {
    let result = {};
    loading.value = true;
    try {
      if (showPwd.value) {
        result = await validate1();
        await editUserApi({ ...result, id: userInfo.value.userId });
        await userStore.logout(true);
      } else {
        result = await validate2();
        await editUserApi({ ...result, id: userInfo.value.userId });
        location.reload();
      }
    } finally {
      loading.value = false;
    }
  }

  function editPwd() {
    showPwd.value = true;
  }
  async function editPhone() {
    isEditPhone.value = true;
    await nextTick();
    await setFieldsValue2({
      user_telphone: userInfo.value.userTelphone,
      user_email: userInfo.value.userEmail,
      remarks: userInfo.value.remarks,
    });
  }
</script>
<style lang="less">
  .user-info-form {
    .ant-form-item {
      width: 50%;
      padding: 8px 0;
      margin-right: 0;
    }
  }

  .ant-row.readonly-info {
    .ant-col {
      padding: 14px 0;
      font-size: 14px;
      display: flex;
      .label {
        min-width: 77px;
        text-align: right;
        color: #333;
        padding-right: 14px;
        margin-right: 14px;
      }
      .content {
        color: rgba(0, 0, 0, 0.65);
      }
    }
  }
</style>
