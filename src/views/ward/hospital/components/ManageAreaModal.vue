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
  import {
    verificationWardCode,
    verificationWardName,
    verificationAreaCode,
  } from '/@/views/ward/wardRules';

  const { createMessage } = useMessage();
  const emit = defineEmits(['success', 'register']);

  const areaOrderOptions = [
    {
      label: '房内顺序',
      value: 1,
    },
    {
      label: '区内顺序',
      value: 2,
    },
  ];

  // 1-60分钟，select框option属性配置
  // const secondsOptions = Array.from({ length: 60 }, (_, i) => {
  //   return {
  //     value: i + 1,
  //     label: i + 1,
  //   };
  // });

  // 表单选项，判断是否勾选了icu
  const ICUVisible = ({ values }) => values.is_icu === 1;

  // 温馨提醒选项文本框的默认提示文字
  const tipsPlaceholder =
    '请输入温馨提示如：\n1、每日可探视时间为15:00-17:00；\n2、探视过程中，请引导患者积极向上、乐观、豁达的生活态度；';

  const modalFormSchemas: FormSchema[] = [
    {
      field: 'partition_name',
      component: 'Input',
      label: '分区名称',
      required: true,
      componentProps: {
        placeholder: '请输入分区名称',
        maxlength: 20,
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
        maxlength: 10,
      },
      dynamicRules: verificationWardCode,
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
        field: 'area_code',
        dynamicDisabled: isEdit,
      },
      {
        field: 'partition_order',
        dynamicDisabled: isEdit,
      },
      {
        field: 'is_icu',
        dynamicDisabled: isEdit,
      },
      {
        field: 'checkedSwitch',
        dynamicDisabled: isEdit,
      },
      {
        field: 'partition_avoidnum',
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
