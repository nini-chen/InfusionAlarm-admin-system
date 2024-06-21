<template>
  <div class="editInfo">
    <!-- 院区信息-编辑弹窗 -->
    <BasicModal
      destroyOnClose
      v-bind="$attrs"
      @register="registerModal"
      @ok="handleSubmit"
      :body-style="bodyStyle"
    >
      <div class="p-30px pl-0 w-full">
        <BasicForm @register="register">
          <template #uploadItem="{ model, field }">
            <UploadImg v-model:value="model[field]" />
          </template>
        </BasicForm>
      </div>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { setFacilityNameApi } from '/@/api/ward/facility.ts';
  import { verificationNull } from '/@/views/ward/wardRules';
  import UploadImg from './UploadImg.vue';

  const emit = defineEmits(['success', 'register']);
  const modalFormSchemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: '单位名称',
      colProps: {
        span: 24,
      },
      required: true,
      componentProps: {
        placeholder: '请输入名称',
        maxlength: 20,
      },
      dynamicRules: verificationNull,
    },
    {
      field: 'staff_avatar',
      component: 'Input',
      label: '单位logo',
      slot: 'uploadItem',
    },
  ];

  const bodyStyle = {
    height: '230px',
  };

  const [register, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 80,
    schemas: modalFormSchemas,
    colon: true,
    showActionButtonGroup: false,
    hideRequiredMark: true,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    setFieldsValue({ name: data.name });
    setModalProps({ title: '编辑单位信息' });
  });

  async function handleSubmit() {
    await validate();
    const { name } = getFieldsValue();
    let params = {
      hospital_name: name,
    };

    const res: any = await setFacilityNameApi(params);
    if (res) {
      resetFields();
      closeModal();
      emit('success');
    }
  }
</script>

<style lang="less" scoped>
  :deep(.ant-modal-header) {
    background: #dae6f5;
  }

  :deep(.ant-modal-body) {
    height: 154px;
  }
</style>
