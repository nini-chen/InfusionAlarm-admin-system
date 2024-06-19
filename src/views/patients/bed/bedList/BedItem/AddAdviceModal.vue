<template>
  <BasicModal
    title="添加医嘱信息"
    v-bind="$attrs"
    :destroy-on-close="true"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <div class="pr-2">
      <BasicForm @register="register" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { addDoctorAdviceApi } from '/@/api/patients/bed';
  import { addAdviceSchemas } from './data';

  const emit = defineEmits(['success', 'register']);
  const { createMessage } = useMessage();
  const bed_id = ref<number>(0);

  const [register, { validate, setFieldsValue, getFieldsValue }] = useForm({
    labelWidth: 90,
    baseColProps: {
      span: 12,
    },
    colon: true,
    schemas: addAdviceSchemas,
    showActionButtonGroup: false,
    fieldMapToTime: [['dateRange', ['advice_startdate', 'advice_enddate'], 'YYYY-MM-DD']],
  });

  const [registerModal, { setModalProps }] = useModalInner((data) => {
    bed_id.value = data.record.bed_id;
    data.record && setFieldsValue(data.record);
  });

  async function handleSubmit() {
    try {
      await validate();
      setModalProps({ confirmLoading: true });
      const formValues = getFieldsValue();
      const res = await addDoctorAdviceApi({
        ...formValues,
        bed_id: bed_id.value,
      });
      if (res) {
        emit('success');
        createMessage.success('添加成功');
      }
      setModalProps({ confirmLoading: false, visible: false });
    } catch (error) {
      setModalProps({ confirmLoading: false });
    }
  }
</script>
