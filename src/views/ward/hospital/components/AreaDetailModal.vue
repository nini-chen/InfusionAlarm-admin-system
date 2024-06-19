<template>
  <BasicModal
    title="病区详情"
    v-bind="$attrs"
    @register="register"
    cancelText="关闭"
    :showOkBtn="false"
    destroyOnClose
  >
    <div class="pt-3px pr-3px min-h-200px">
      <Description :column="1" :data="descriptionData" :schema="schemaDescription" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description, DescItem, useDescription } from '/@/components/Description/index';

  const descriptionData = ref([]);
  const schemaDescription: DescItem[] = [
    {
      field: 'partition_code',
      label: '病区编号',
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'partition_name',
      label: '病区名称',
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'area_code',
      label: '病区唯一编码',
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'partition_order',
      label: '病床号排序方式',
      labelMinWidth: 100,
      contentMinWidth: 300,
      render: (val) => {
        return val == 1 ? '房内顺序' : '区内顺序';
      },
    },
    {
      field: 'partition_avoidnum',
      label: '号码规避',
      render: (val) => {
        return val ? '开' : '关';
      },
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'partition_avoidnum',
      label: ' ',
      show: ({ partition_avoidnum }) => {
        return partition_avoidnum;
      },
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'remarks',
      label: '科室（病区）简介',
      render: (val) => {
        return val ? val : '--';
      },
      labelMinWidth: 100,
      contentMinWidth: 300,
    },

    // 以下是ICU模块特有的信息项
    {
      field: 'is_icu',
      label: '探视模块',
      render: (val) => val == 1 ? '已开启' : '未开启',
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'tips',
      label: '温馨提示',
      labelMinWidth: 100,
      contentMinWidth: 300,
      show: ({ is_icu }) => is_icu == 1,
      render: (val) => val || '--',
    },
    {
      field: 'visit_time',
      label: '探视时长',
      render: (val) => val ? `${val}分钟` : '--',
      labelMinWidth: 100,
      contentMinWidth: 300,
      show: ({ is_icu }) => is_icu == 1,
    },
    {
      field: 'apply_time',
      label: '申请时长',
      render: (val) => val ? `${val}分钟` : '--',
      labelMinWidth: 100,
      contentMinWidth: 300,
      show: ({ is_icu }) => is_icu == 1,
    },

  ];

  useDescription({
    title: 'useDescription',
    data: descriptionData,
    schema: schemaDescription,
  });

  const [register, {}] = useModalInner((data) => {
    descriptionData.value = data.record;
  });
</script>
