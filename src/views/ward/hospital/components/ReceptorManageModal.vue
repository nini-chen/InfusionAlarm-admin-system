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
        <BasicForm class="manage-ward-area" @register="register">
          <template #areaName="{ model, field }">
            <div class="flex items-center">
              {{ model[field] }}
            </div>
          </template>
        </BasicForm>
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
  import { verificationWardCode } from '/@/views/ward/wardRules';

  const { createMessage } = useMessage();
  const emit = defineEmits(['success', 'register']);

  const modalFormSchemas: FormSchema[] = [
    {
      field: 'partition_name',
      slot: 'areaName',
      component: 'Input',
      label: '分区名称',
    },
    {
      field: 'ip',
      component: 'Input',
      label: '1号接收器IP',
      required: true,
      componentProps: {
        placeholder: '请输入接收器IP',
        maxlength: 15,
      },
      colProps: {
        span: 12,
      },
      dynamicRules: verificationWardCode,
    },
    {
      field: 'duanko',
      component: 'Input',
      label: '1号接收器端口',
      required: true,
      componentProps: {
        placeholder: '请输入端口',
        maxlength: 4,
      },
      colProps: {
        span: 12,
      },
      dynamicRules: verificationWardCode,
    },
    {
      field: 'ip2',
      component: 'Input',
      label: '2号接收器IP',
      componentProps: {
        placeholder: '请输入接收器IP',
        maxlength: 15,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'duanko2',
      component: 'Input',
      label: '2号接收器端口',
      componentProps: {
        placeholder: '请输入端口',
        maxlength: 4,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ip3',
      component: 'Input',
      label: '3号接收器IP',
      componentProps: {
        placeholder: '请输入接收器IP',
        maxlength: 15,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'duanko3',
      component: 'Input',
      label: '3号接收器端口',
      componentProps: {
        placeholder: '请输入端口',
        maxlength: 4,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ip4',
      component: 'Input',
      label: '4号接收器IP',
      componentProps: {
        placeholder: '请输入接收器IP',
        maxlength: 15,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'duanko4',
      component: 'Input',
      label: '4号接收器端口',
      componentProps: {
        placeholder: '请输入端口',
        maxlength: 4,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'ip5',
      component: 'Input',
      label: '5号接收器IP',
      componentProps: {
        placeholder: '请输入接收器IP',
        maxlength: 15,
      },
      colProps: {
        span: 12,
      },
    },
    {
      field: 'duanko5',
      component: 'Input',
      label: '5号接收器端口',
      componentProps: {
        placeholder: '请输入端口',
        maxlength: 4,
      },
      colProps: {
        span: 12,
      },
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
    const title = '管理分区';
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
