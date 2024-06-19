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
        <a-form-item label="服务器" name="ip">
          <a-input :maxlength="20" v-model:value="recordForm.ip" placehodler="请输入服务器ip" />
        </a-form-item>
        <a-form-item label="端口号" name="port">
          <a-input :maxlength="5" v-model:value="recordForm.port" placeholder="请输入端口号" />
        </a-form-item>
      </a-form>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { setServerConfig } from '/@/api/system/iccard';
  import { message } from 'ant-design-vue';

  /*emits*/
  const recordForm = ref<any>({});

  const rules = {
    ip: [
      {
        required: true,
        message: '请输入服务器IP',
        trigger: 'blur',
      },
    ],
    port: [
      {
        required: true,
        message: '请输入端口号',
        trigger: 'blur',
      },
      {
        pattern: /^[0-9]{1,5}$/,
        message: '请输入正确的端口号',
        trigger: 'blur',
      },
    ],
  };

  const [registerModal, { setModalProps, closeModal }] = useModalInner(({ record }) => {
    recordForm.value = { ...record };
    setModalProps({
      title: '人脸识别服务器配置',
    });
  });

  /*数据提交*/
  const formRef = ref<any>(null);
  async function handleSubmit() {
    if (!(await formRef.value.validate())) return;
    await setServerConfig(recordForm.value);
    handleCancel();
    message.success('修改成功');
  }

  function handleCancel() {
    formRef.value.resetFields();
    closeModal();
  }
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
