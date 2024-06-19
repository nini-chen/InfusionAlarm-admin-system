<template>
  <BasicModal v-bind="$attrs" @register="registerModal" @ok="handleSubmit" @cancel="handleCancel">
    <div class="pt-16">
      <a-form
        ref="formRef"
        :model="recordForm"
        name="basic"
        :label-col="{ span: 4 }"
        autocomplete="off"
        :rules="rules"
      >
        <a-form-item label="卡号">
          <a-input v-model:value="recordForm.code" disabled />
        </a-form-item>
        <a-form-item label="姓名" name="name">
          <a-input :maxlength="10" v-model:value="recordForm.name" placeholder="请输入用户姓名" />
        </a-form-item>
        <a-form-item label="手机号" name="phone">
          <a-input
            v-model:value="recordForm.phone"
            :maxlength="11"
            placeholder="请输入11位手机号"
            @input="(e) => (recordForm.phone = e.target.value.replace(/[^\d]/g, ''))"
          />
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { editICStatus } from '/@/api/system/iccard';
  import { message } from 'ant-design-vue';
  import { phoneRules } from '/@/utils/customRules';

  /*emits*/
  const emit = defineEmits(['success']);

  const rules = {
    phone: [
      {
        message: '请输入手机号',
        trigger: 'blur',
      },
      ...phoneRules,
    ],
    name: [
      {
        message: '请输入用户姓名',
        trigger: 'blur',
      },
    ],
  };

  /*params*/
  const params = ref({
    card_code: '',
    code_sign: '',
    card_name: '',
    phone: '',
  });

  const recordForm = ref<any>({});

  const [registerModal, { setModalProps, closeModal }] = useModalInner(({ record }) => {
    recordForm.value = { ...record };
    setModalProps({
      title: '编辑IC卡信息',
    });
  });

  /*数据提交*/
  const formRef = ref<any>(null);
  async function handleSubmit() {
    params.value.card_code = recordForm.value.code;
    params.value.code_sign = recordForm.value.code_sign;
    params.value.card_name = recordForm.value.name;
    params.value.phone = recordForm.value.phone;
    // 表单校验
    if (!(await formRef.value.validate())) return;
    await editICStatus(params.value);
    emit('success');
    handleCancel();
    message.success('操作成功');
  }

  function handleCancel() {
    formRef.value.resetFields();
    closeModal();
  }

  /*关闭弹框*/
</script>

<style scoped>
  .box-message {
    height: 100%;
    display: flex;
    align-items: center;
    font-size: 0.9rem;
    font-weight: 600;
  }
</style>
