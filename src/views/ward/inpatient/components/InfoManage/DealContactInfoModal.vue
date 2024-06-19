<template>
  <div>
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      @ok="handleSubmit"
      @visible-change="handlecancel"
    >
      <div class="w-full">
        <BasicForm @register="register" />
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { editPartitionInfo, addPartitionInfo } from '/@/api/ward/patient';
  import { useUserStore } from '/@/store/modules/user';
  import { verificationNull, verificationIphoneCode } from '/@/views/ward/wardRules';

  const emit = defineEmits(['success', 'register']);
  const modalFormSchemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 24,
      },
      show: false,
    },
    {
      field: 'duties',
      component: 'Input',
      label: '职务/机构',
      colProps: {
        span: 24,
      },
      componentProps: {
        placeholder: '请输入职务/机构',
        maxlength: 10,
      },
      dynamicRules: verificationNull,
      required: true,
    },
    {
      field: 'contacts',
      component: 'Input',
      label: '联系人',
      componentProps: {
        placeholder: '请输入联系人',
        maxlength: 20,
      },
      rules: [{ pattern: /^\S+$/, message: '不能输入空格' }],
      colProps: {
        span: 24,
      },
    },
    {
      field: 'pattern',
      component: 'Input',
      label: '联系方式',
      colProps: {
        span: 24,
      },
      componentProps: {
        placeholder: '请输入联系方式',
      },
      dynamicRules: verificationIphoneCode,
      required: true,
    },
  ];

  const infoType = ref(false);

  const [register, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 80,
    schemas: modalFormSchemas,
    colon: true,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    infoType.value = JSON.stringify(data) == '{}' ? true : false;
    setModalProps({
      title: infoType.value ? '添加病区联系信息' : '编辑病区联系信息',
    });
    if (!infoType.value) {
      setFieldsValue({
        id: data.data?.id,
        duties: data.data.duties,
        contacts: data.data.contacts,
        pattern: data.data.pattern,
      });
    }
  });

  async function handleSubmit() {
    const { pattern, contacts, duties, id } = getFieldsValue();
    await validate();
    let params = {};

    //编辑
    if (!infoType.value) {
      params = {
        id,
        pattern,
        contacts,
        duties,
      };
      const res: any = await editPartitionInfo(params);
      if (res) {
        resetFields();
        closeModal();
        emit('success', 'edit');
      }
    } else {
      const userStore = useUserStore();
      // 当前用户所处的病区的id
      let partitionId = computed(() => userStore.getCurrentPartition.id);
      params = {
        id,
        pattern,
        contacts,
        duties,
        partition_id: partitionId.value,
      };
      const res: any = await addPartitionInfo(params);
      if (res) {
        resetFields();
        closeModal();
        emit('success', 'add');
      }
    }
  }

  function handlecancel(val) {
    !val && resetFields();
  }
</script>
