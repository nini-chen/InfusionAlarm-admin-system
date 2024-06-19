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
        <BasicForm @register="register" />
      </div>
    </BasicModal>
  </div>
</template>

<script lang="ts" setup>
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { setFacilityNameApi } from '/@/api/ward/facility.ts';
  import { verificationNull } from '/@/views/ward/wardRules';

  const emit = defineEmits(['success', 'register']);
  const modalFormSchemas: FormSchema[] = [
    {
      field: 'name',
      component: 'Input',
      label: '院区名称',
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
  ];

  const bodyStyle = {
    height: '154px',
  };

  const [register, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 80,
    schemas: modalFormSchemas,
    colon: true,
    showActionButtonGroup: false,
    hideRequiredMark: true,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    console.log('编辑院区信息----', data);
    setFieldsValue({ name: data.name });
    setModalProps({ title: '编辑院区信息' });
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
