<template>
  <div class="mange-area-modal">
    <!-- 此弹窗是公用弹窗：院区管理-新增和编辑、病区管理-信息管理-编辑-->
    <BasicModal
      destroyOnClose
      v-bind="$attrs"
      @register="registerModal"
      @ok="handleValidate"
      @visible-change="handleCancel"
    >
      <div class="w-full pb-4">
        <div class="text-base font-medium pt-0 pb-1">病区基础信息</div>
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
      field: 'partition_code',
      component: 'Input',
      label: '病区编号',
      required: true,
      componentProps: {
        placeholder: '请输入病区编号',
        maxlength: 10,
      },
      dynamicRules: verificationWardCode,
    },
    {
      field: 'partition_name',
      component: 'Input',
      label: '病区名称',
      required: true,
      componentProps: {
        placeholder: '请输入病区名称',
        maxlength: 20,
      },
      dynamicRules: verificationWardName,
    },
    {
      field: 'area_code',
      component: 'Input',
      label: '病区唯一编码',
      required: true,
      componentProps: {
        placeholder: '示例：XXGNK1',
        maxlength: 20,
        allowClear: true,
      },
      itemProps: {
        extra: '提示：请输入20位以内数字、字母，并区分大小写；唯一编码不可重复，用于对病区做出区分',
      },
      dynamicRules: verificationAreaCode,
    },
    {
      field: 'partition_order',
      component: 'Select',
      label: '病床号排序方式',
      required: true,
      defaultValue: 1,
      componentProps: {
        placeholder: '请选择病床顺序',
        allowClear: true,
        options: areaOrderOptions,
      },
      itemProps: {
        extra:
          '提示：房内顺序指房内床号都从1号开始；区内顺序指病区内所有床号按顺序排序，与所在病房无关',
      },
    },
    {
      field: 'checkedSwitch',
      component: 'Switch',
      label: '号码规避',
      componentProps: {
        onChange: (flag) => {
          setFieldsValue({
            partition_avoidnum: flag ? '4,14,24,34,44,43,42,41' : '',
          });
        },
      },
    },
    {
      field: 'partition_avoidnum',
      component: 'Input',
      label: ' ',
      rules: [{ pattern: /^[0-9,，]+$/, message: '只能输入数字和逗号' }],
      componentProps: ({ formModel }) => {
        return {
          placeholder: '请输入，多个以逗号隔开',
          allowClear: true,
          disabled: !formModel.checkedSwitch,
        };
      },
      itemProps: {
        colon: false,
        extra:
          '提示：开启号码规避后，病房、病床号默认规避4,14,24,34,44,43,42,41等数字，可自行更改，多个时以中文逗号“，”隔开',
      },
    },
    {
      field: 'remarks',
      component: 'InputTextArea',
      label: '科室（病区）简介',
      componentProps: {
        placeholder: '请输入简介',
        rows: 3,
        maxlength: 200,
        showCount: true,
        allowClear: true,
      },
    },
    {
      field: 'divider-basic',
      component: 'Divider',
      label: '',
      colProps: {
        span: 23,
        offset: 1,
      },
      componentProps: {
        class: '!mt-0 !mb-10px',
      },
    },
    {
      field: 'is_icu',
      component: 'Switch',
      label: '探视模块',
      defaultValue: 0,
      componentProps: {
        checkedValue: 1,
        unCheckedValue: 0,
      },
      itemProps: {
        extra:
          '提示：开启探视模块后，病区可绑定探视主机、探视家属分机、探视病床分机；对应屏蔽后台托管记录模块以及开放探视记录模块',
      },
    },
    {
      field: 'tips',
      component: 'InputTextArea',
      label: '温馨提示',
      componentProps: {
        placeholder: tipsPlaceholder,
        rows: 4,
        maxlength: 200,
        showCount: true,
        allowClear: true,
      },
      ifShow: ICUVisible,
    },
    {
      field: 'visit_time',
      component: 'Select',
      label: '探视时长',
      required: true,
      defaultValue: 10,
      componentProps: {
        placeholder: '请选择',
        fieldNames: { label: 'label', value: 'value' },
        options: [
          {
            value: 10,
            label: 10,
          },
          {
            value: 20,
            label: 20,
          },
          {
            value: 30,
            label: 30,
          },
        ],
      },
      suffix: '分钟',
      colProps: {
        span: 12,
      },
      ifShow: ICUVisible,
    },
    {
      field: 'apply_time',
      component: 'Select',
      label: '申请时长',
      required: true,
      defaultValue: 5,
      componentProps: {
        placeholder: '请选择',
        fieldNames: { label: 'label', value: 'value' },
        options: [
          {
            value: 5,
            label: 5,
          },
          {
            value: 10,
            label: 10,
          },
          {
            value: 15,
            label: 15,
          },
        ],
      },
      suffix: '分钟',
      colProps: {
        span: 12,
      },
      ifShow: ICUVisible,
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
    const title = isEdit ? '编辑病区' : '添加病区';
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
