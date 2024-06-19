<template>
  <Description size="middle" :bordered="false" :column="3" :data="bedData" :schema="personSchema" />
</template>
<script lang="ts" setup>
  import { h } from 'vue';
  import { Description, DescItem } from '/@/components/Description/index';
  import { Divider } from 'ant-design-vue';
  import { BedListRecord } from '/@/api/patients/model/bedModel';
  import { sexOptions, bloodLabels } from '../data';
  defineProps({
    bedData: { type: Object as BedListRecord, default: () => ({}) },
  });

  // 几个医护类型的自定义渲染
  const careDescRender = (curVal) => {
    if (curVal?.length > 0) {
      let label = '';
      curVal.forEach((item, index) => {
        label = index > 0 ? `${label} / ${item.name}` : item.name;
      });
      return label;
    }
    return '无';
  };

  // 分隔线
  const divider: DescItem = {
    field: 'Divider',
    label: '',
    span: 3,
    render: () => {
      return h(Divider);
    },
  };

  const personSchema: DescItem[] = [
    {
      field: 'patient_number',
      label: '住院号',
    },
    {
      field: 'patient_id',
      label: '病人ID',
    },
    {
      field: 'patient_livedate',
      label: '入院时间',
    },
    // 分隔线
    divider,
    {
      field: 'patient_name',
      label: '姓名',
    },
    {
      field: 'hospital_bed_name',
      label: '病床号',
    },
    {
      field: 'patient_phone_number',
      label: '电话号码',
    },
    {
      field: 'patient_sex',
      label: '性别',
      render: (curVal) => {
        const match = sexOptions.find((b) => b.value == curVal);
        return match ? match.label : '其他';
      },
    },
    {
      field: 'patient_age',
      label: '年龄',
      render: (curVal) => {
        return curVal ? curVal + ' 岁' : '无';
      },
    },
    {
      field: 'patient_birthday',
      label: '生日',
    },
    {
      field: 'patient_blood',
      label: '血型',
      render: (curVal) => {
        const val = bloodLabels[Number(curVal)];
        return val ? val : bloodLabels[0];
      },
    },
    {
      field: 'patient_nativeplace',
      label: '籍贯',
    },
    {
      field: 'patient_patient_responce',
      label: '病人身份',
    },
    {
      field: 'patient_idcard',
      label: '身份证号',
    },
    {
      field: 'patient_address',
      label: '地址',
      span: 2,
    },
    {
      field: 'patient_emergency_contact',
      label: '紧急联系人',
    },
    {
      field: 'patient_emergency_contact_phone_number',
      label: '联系电话',
      span: 2,
    },
    // 分隔线
    divider,
    {
      field: 'partition_name',
      label: '科室（病区）',
    },
    {
      field: 'i1_name',
      label: '护理级别',
    },
    {
      field: 'num',
      label: '住院次数',
    },
    {
      field: 'patient_illness',
      label: '病情',
      render: (curVal) => {
        const index = curVal && Number(curVal) < 4 ? Number(curVal) : 0;
        const statusLabel = ['无', '正常', '病危', '病重'];
        return statusLabel[index];
      },
    },
    {
      field: 'diagnosis',
      label: '诊断',
      span: 2,
    },
    {
      field: 'patient_doctor_name',
      label: '责任医生',
    },
    {
      field: 'patient_nurse_name',
      label: '责任护士',
    },
    {
      field: 'operation_time',
      label: '手术时间',
    },
    // 分隔线
    divider,
    {
      field: 'i6_name',
      label: '医保类型',
    },
    {
      field: 'before_money',
      label: '预交金额',
    },
    {
      field: 'after_money',
      label: '未结算金额',
    },
    // 分隔线
    divider,
    {
      field: 'i5_name',
      label: '隔离类别',
      render: (val) => {
        return val ? val : '无';
      },
    },
    {
      field: 'inconfig_3',
      label: '饮食类别',
      render: careDescRender,
    },
    {
      field: 'inconfig_4',
      label: '药物反应',
      render: careDescRender,
    },
    {
      field: 'inconfig_2',
      label: '安全防范',
      render: careDescRender,
    },
  ];
</script>

<style lang="less" scoped>
  :deep(.ant-descriptions-item-content) {
    margin-right: 20px;
  }
</style>
