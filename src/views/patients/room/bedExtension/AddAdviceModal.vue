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
  import { addAdviceSchemas } from './data';
  import { addDoctorAdviceApi } from '/@/api/patients/bedExtension';
  import { ICUBedListRecord } from '/@/api/patients/model/bedExtensionModel';

  const emit = defineEmits(['success', 'register']);
  const { createMessage } = useMessage();
  const record = ref({} as ICUBedListRecord);

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
    record.value = data.record;
    data.record && setFieldsValue(data.record);
  });

  async function handleSubmit() {
    try {
      await validate();
      const formValues = getFieldsValue()
      setModalProps({ confirmLoading: true });
      const res = await addDoctorAdviceApi({
        ...formValues,
        bed_id: record.value.bed_id,
        partition_id: record.value.partition_id
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
