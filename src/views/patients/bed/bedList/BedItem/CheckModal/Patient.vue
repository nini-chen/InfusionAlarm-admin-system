<template>
  <div>
    <div class="pb-4 pt-1 font-bold">
      <Badge color="blue" text="病人信息" />
    </div>
    <Description
      size="middle"
      :bordered="false"
      :column="3"
      :data="bedData"
      :schema="personSchema"
    />
  </div>
</template>
<script lang="ts" setup>
  import { Description } from '/@/components/Description/index';
  import { DescItem } from '/@/components/Description/index';
  import { Badge } from 'ant-design-vue';
  import { BedListRecord } from '/@/api/patients/model/bedModel';
  import { sexOptions } from '../data';

  defineProps({
    bedData: { type: Object as BedListRecord, default: () => ({}) },
  });

  const personSchema: DescItem[] = [
    {
      field: 'patient_name',
      label: '姓名',
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
      field: 'patient_doctor_name',
      label: '责任医生',
    },
    {
      field: 'i1_name',
      label: '护理级别',
    },
    {
      field: 'num',
      label: '住院次数',
    },
  ];
</script>
