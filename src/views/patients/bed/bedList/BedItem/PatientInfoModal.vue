<template>
  <BasicModal
    wrapClassName="patient-info-modal"
    destroyOnClose
    v-bind="$attrs"
    @register="registerModal"
    @ok="handleSubmit"
  >
    <div class="pr-2 patient-info-form">
      <BasicForm @register="register">
        <template #bloodSlot="{ model, field }">
          <TreeSelect
            allowClear
            treeDefaultExpandAll
            placeholder="请选择血型"
            v-model:value="model[field]"
            :treeData="bloodTypeOptions"
            treeNodeLabelProp="label"
            :getPopupContainer="getPopupContainer"
          />
        </template>

        <template #careSlot="{ model, field }">
          <Select
            allowClear
            v-model:value="model[field]"
            :options="careOptions"
            placeholder="请选择护理级别"
            @change="changeValidateFiled($event, 'inconfig_1')"
            :getPopupContainer="getPopupContainer"
          />
        </template>

        <template #doctorSlot="{ model, field }">
          <Select
            show-search
            :filterOption="filterOption"
            allowClear
            v-model:value="model[field]"
            :options="configOptions.doctor"
            placeholder="请选择责任医生"
            @change="changeValidateFiled($event, 'patient_doctor')"
            :getPopupContainer="getPopupContainer"
          />
        </template>

        <template #nurseSlot="{ model, field }">
          <Select
            show-search
            :filterOption="filterOption"
            allowClear
            v-model:value="model[field]"
            :options="configOptions.nurse"
            placeholder="请选择责任护士"
            :getPopupContainer="getPopupContainer"
          />
        </template>

        <template #config5Slot="{ model, field }">
          <Select
            show-search
            :filterOption="filterOption"
            allowClear
            v-model:value="model[field]"
            :options="configOptions.config5"
            placeholder="请选择隔离类别"
            :getPopupContainer="getPopupContainer"
          />
        </template>

        <template #config3Slot="{ model, field }">
          <TreeSelect
            v-model:value="model[field]"
            :treeData="configOptions.config3"
            treeCheckable
            allowClear
            show-search
            treeNodeFilterProp="title"
            :replaceFields="{
              children: 'children',
              title: 'name',
              key: 'id',
              value: 'id',
            }"
            placeholder="请选择饮食类别"
            :getPopupContainer="getPopupContainer"
            dropdownClassName="!max-h-296px"
          />
        </template>
        <template #config4Slot="{ model, field }">
          <TreeSelect
            v-model:value="model[field]"
            :treeData="configOptions.config4"
            treeCheckable
            allowClear
            show-search
            treeNodeFilterProp="title"
            :replaceFields="{
              children: 'children',
              title: 'name',
              key: 'id',
              value: 'id',
            }"
            placeholder="请选择药物反应"
            :getPopupContainer="getPopupContainer"
            dropdownClassName="!max-h-296px"
          />
        </template>
        <template #config2Slot="{ model, field }">
          <TreeSelect
            v-model:value="model[field]"
            :treeData="configOptions.config2"
            treeCheckable
            allowClear
            show-search
            treeNodeFilterProp="title"
            :replaceFields="{
              children: 'children',
              title: 'name',
              key: 'id',
              value: 'id',
            }"
            placeholder="请选择安全防范"
            :getPopupContainer="getPopupContainer"
            dropdownClassName="!max-h-296px"
          />
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Select, TreeSelect } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { filterOption, getPopupContainer } from '/@/utils';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { patientInfoSchemas, bloodTypeOptions } from './data';
  import { patientRegisterApi, patientEditApi, getPatientDetailApi } from '/@/api/patients/bed';

  const emit = defineEmits(['success', 'register']);
  const { createMessage } = useMessage();
  const bedId = ref<Nullable<number>>(null);
  const isEdit = ref(false);
  const careOptions = ref<LabelValueOptions>([]);
  const configOptions = ref({});

  const [register, { validate, validateFields, setFieldsValue }] = useForm({
    labelWidth: 90,
    baseColProps: {
      span: 8,
    },
    colon: true,
    schemas: patientInfoSchemas,
    showActionButtonGroup: false,
  });

  // 重新验证一下表单选项 (解决一些使用slot方式展示的select框会存在这种情况)
  function changeValidateFiled(_, filedKey) {
    validateFields([filedKey]);
  }

  async function onDataReceive(data) {
    const { isUpdate, record, statistics, configs } = data;
    setModalProps({
      title: data.isUpdate ? '编辑病人信息' : '病人入院信息登记',
    });
    console.log('护理级别select框', statistics);
    isEdit.value = isUpdate;
    //  护理级别select框
    careOptions.value = statistics;
    //  其他几个select框
    configOptions.value = configs;
    if (isUpdate) {
      // 编辑：获取详情，将数据回填到表单
      const res = await getPatientDetailApi(record.bed_id);
      const {
        bed_id,
        hospital_bed_name,
        room_name,
        i1_id,
        i6_id,
        inconfig_2,
        inconfig_3,
        inconfig_4,
        i5_id,
        patient_nurse_id,
        patient_doctor_id,
        patient_address,
        patient_idcard,
        patient_nativeplace,
        patient_phone_number,
        patient_birthday,
        patient_blood,
        before_money,
        after_money,
        operation_time,
        patient_illness,
        patient_patient_responce,
        patient_emergency_contact,
        patient_emergency_contact_phone_number,
        num,
      } = res;
      bedId.value = bed_id;
      setFieldsValue({
        ...record,
        bedName: room_name + hospital_bed_name,
        patient_doctor: patient_doctor_id == 0 ? null : String(patient_doctor_id),
        patient_nurse: patient_nurse_id == 0 ? null : String(patient_nurse_id),
        inconfig_1: i1_id,
        inconfig_6: i6_id ? Number(i6_id) : null,
        inconfig_5: i5_id == '0' ? null : String(i5_id),
        inconfig_2: inconfig_2?.map((x) => x.id),
        inconfig_3: inconfig_3?.map((x) => x.id),
        inconfig_4: inconfig_4?.map((x) => x.id),
        patient_address,
        patient_idcard,
        patient_birthday,
        patient_blood: patient_blood == 0 ? null : String(patient_blood),
        patient_illness: patient_illness == '0' ? null : String(patient_illness),
        before_money,
        operation_time,
        after_money,
        patient_nativeplace,
        patient_phone_number,
        patient_patient_responce,
        patient_emergency_contact,
        patient_emergency_contact_phone_number,
        num: num == 0 ? null : num,
      });
    } else {
      // 新增
      const { bed_id, hospital_room_name, hospital_bed_name } = data.record;
      bedId.value = bed_id;
      setFieldsValue({
        bedName: hospital_room_name + hospital_bed_name,
      });
    }
  }

  const [registerModal, { setModalProps }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  async function handleSubmit() {
    try {
      const values = await validate();
      console.log(values);
      setModalProps({ confirmLoading: true });
      const is_operation = values.operation_time ? 1 : 2;
      const data = {
        ...values,
        bed_id: bedId.value,
        is_operation,
        inconfig_2: values.inconfig_2?.toString(),
        inconfig_3: values.inconfig_3?.toString(),
        inconfig_4: values.inconfig_4?.toString(),
        patient_blood: values.patient_blood || '0',
        patient_illness: values.patient_illness || '0',
        patient_doctor: values.patient_doctor || '0',

        inconfig_5: values.inconfig_5 ?? '',
        num: values.num ?? '',
        patient_birthday: values.patient_birthday ?? '',
        patient_nurse: values.patient_nurse ?? '',
        operation_time: values.operation_time ?? '',
        before_money: values.before_money ?? '',
        after_money: values.after_money ?? '',
      };
      if (isEdit.value) {
        await patientEditApi(data);
      } else {
        await patientRegisterApi(data);
      }
      setModalProps({ confirmLoading: false, visible: false });
      emit('success');
      createMessage.success('操作成功');
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }
</script>

<style lang="less">
  .patient-info-modal {
    .patient-info-form {
      overflow-y: auto;
      .ant-divider {
        margin: 0 0 24px;
      }

      .ant-input-number {
        width: 214px;
      }

      // 最后一行高度设置一下，让弹窗内容在select框地下
      .last-row-height {
        min-height: 400px;
      }
    }

    .ant-modal-body {
      // 设置固高度解决select框的弹出菜单把高度顶下去，出现晃动
      height: 600px;
      > .scrollbar {
        padding-bottom: 0;
      }
    }
  }
</style>
