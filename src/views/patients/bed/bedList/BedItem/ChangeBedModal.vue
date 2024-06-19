<template>
  <BasicModal
    title="患者转床"
    :destroy-on-close="true"
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <div class="pr-2">
      <BasicForm @register="register">
        <template #bedSlot="{ model, field }">
          <Select
            allowClear
            v-model:value="model[field]"
            :options="bedOptions"
            placeholder="请选择目标床位"
            @change="validateFields('bed_id')"
          />
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Select } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { changeBedSchemas } from './data';
  import { patientChangeBedApi, getBedSelectApi } from '/@/api/patients/bed';

  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();

  const record = ref();
  const bedOptions = ref<LabelValueOptions>([]);

  const emit = defineEmits(['success', 'register']);
  const { createMessage } = useMessage();
  const [register, { setFieldsValue, validate, validateFields }] = useForm({
    labelWidth: 90,
    baseColProps: {
      span: 24,
    },
    colon: true,
    schemas: changeBedSchemas,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps }] = useModalInner(async (data) => {
    record.value = data.record;
    const { hospital_bed_name, hospital_room_name, patient_name } = data.record;
    const res = await getBedSelectApi({
      partition_id: userStore.getCurrentPartition.id,
      // 1是绑定了病床分机
      is_bind_sickbed: 1,
      // 1是空床位
      is_empty_bed: 1,
    });
    if (res) {
      bedOptions.value = res.map((x) => {
        const { id, hospital_bed_name, room_name } = x;
        return {
          value: String(id),
          label: `${room_name} ${hospital_bed_name}`,
        };
      });
    }

    setFieldsValue({
      bedName: hospital_room_name + hospital_bed_name,
      patient_name,
    });

    // updateSchema({
    //   field: 'bed_id',
    //   component: 'ApiSelect',
    //   label: '目标床号',
    //   componentProps: {
    //     api: getBedSelectApi,
    //     params: {
    //       partition_id: userStore.getCurrentPartition.id,
    //       // 1是筛选病床分机
    //       is_bind_sickbed: 1,
    //     },
    //     resultField: 'data',
    //     labelField: 'hospital_bed_name',
    //     valueField: 'id',
    //   },
    // });
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      setModalProps({ confirmLoading: true });
      const res = await patientChangeBedApi({
        old_bed_id: record.value.bed_id,
        new_bed_id: values.bed_id,
      });
      if (res) {
        emit('success');
        createMessage.success('操作成功');
      }
      setModalProps({ confirmLoading: false, visible: false });
    } catch (error) {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less" scoped></style>
