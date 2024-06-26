<template>
  <div class="mange-area-modal">
    <!-- 此弹窗是公用弹窗：院区管理-新增和编辑、分区管理-信息管理-编辑-->
    <BasicModal
      destroyOnClose
      v-bind="$attrs"
      @register="registerModal"
      @ok="handleValidate"
      @visible-change="handleCancel"
    >
      <div class="w-full pb-4">
        <!-- <div class="text-base font-medium pt-0 pb-1">分区基础信息</div> -->
        <BasicForm class="manage-ward-area" @register="register" />
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { addFacilityApi, editFacilityApi } from '/@/api/ward/facility';
  import { verificationWardCode, verificationWardName } from '/@/views/ward/wardRules';

  const { createMessage } = useMessage();
  const emit = defineEmits(['success', 'register']);

  const modalFormSchemas: FormSchema[] = [
    {
      field: 'partition_name',
      component: 'Input',
      label: '分区名称',
      required: true,
      componentProps: {
        placeholder: '请输入分区名称',
        maxlength: 10,
      },
      dynamicRules: verificationWardName,
    },
    {
      field: 'partition_code',
      component: 'Input',
      label: '分区编号',
      required: true,
      componentProps: {
        placeholder: '请输入分区编号',
        maxlength: 20,
      },
      dynamicRules: verificationWardCode,
    },
    {
      field: 'partition_sudu',
      component: 'Select',
      label: '切页速度',
      required: true,
      componentProps: {
        options: [
          {
            label: '5s',
            value: '5s',
            key: '5s',
          },
          {
            label: '8s',
            value: '8s',
            key: '8s',
          },
          {
            label: '10s',
            value: '10s',
            key: '10s',
          },
          {
            label: '12s',
            value: '12s',
            key: '12s',
          },
          {
            label: '15s',
            value: '15s',
            key: '15s',
          },
          {
            label: '20s',
            value: '20s',
            key: '20s',
          },
          {
            label: '30s',
            value: '30s',
            key: '30s',
          },
          {
            label: '45s',
            value: '45s',
            key: '45s',
          },
          {
            label: '50s',
            value: '50s',
            key: '50s',
          },
          {
            label: '60s',
            value: '60s',
            key: '60s',
          },
        ],
      },
      suffix: '状态展示页面切页速度',
    },
  ];

  const [register, { setFieldsValue, resetFields, updateSchema, validateFields }] = useForm({
    labelWidth: 140,
    schemas: modalFormSchemas,
    showActionButtonGroup: false,
    baseColProps: {
      span: 24,
    },
    colon: true, // 统一在label后面加上冒号
  });

  const editId = ref<String>('');

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    const { isEdit, record } = data;
    const title = isEdit ? '编辑分区' : '添加分区';
    setModalProps({
      title,
    });
    editId.value = isEdit ? record.id : '';

    if (isEdit) {
      setFieldsValue({
        ...record,
        checkedSwitch: record.partition_avoidnum ? true : false,
      });
    }

    // 部分选项，在编辑的时候，是禁止的
    updateSchema([
      {
        field: 'partition_code',
        dynamicDisabled: isEdit,
      },
    ]);
  });

  // 验证表单
  async function handleValidate() {
    try {
      const fieldsValue = await validateFields();
      handleSubmit(fieldsValue);
    } catch (error) {
      createMessage.error('请检查表单选项是否填写正确');
    }
  }

  // 提交数据
  async function handleSubmit(fieldsValue) {
    let res = '';
    if (editId.value) {
      res = await editFacilityApi({
        ...fieldsValue,
        id: editId.value,
      });
    } else {
      res = await addFacilityApi({
        ...fieldsValue,
      });
    }
    if (res) {
      handlerSuccess();
    }
  }

  function handlerSuccess() {
    resetFields();
    closeModal();
    emit('success');
  }

  function handleCancel(val) {
    !val && resetFields();
  }
</script>

<style lang="less" scoped></style>
