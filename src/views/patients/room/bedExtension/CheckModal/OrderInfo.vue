<template>
  <div>
    <Patient :bedData="bedData" />
    <div class="pb-4 pt-1 font-bold">
      <Badge color="blue" text="医嘱信息" />
    </div>
    <BasicTable @register="registerTimeTable" />
  </div>
</template>
<script lang="ts" setup>
  // import moment from 'moment';
  import { Badge } from 'ant-design-vue';
  import Patient from './Patient.vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicColumn } from '/@/components/Table/src/types/table';
  import { ICUBedListRecord } from '/@/api/patients/model/bedExtensionModel';
  import { getDoctorAdviceListApi } from '/@/api/patients/bedExtension';
  import { tableStateRender } from '/@/utils/tableRender';
  import { adviceTypeOptions, rateOptions, useOptions } from '../data';

  const props = defineProps({
    bedData: { type: Object as ICUBedListRecord, default: () => ({}) },
  });

  const columns: BasicColumn[] = [
    {
      title: '医嘱类型',
      width: 120,
      dataIndex: 'advice_type',
      customRender: tableStateRender(adviceTypeOptions),
    },
    {
      width: 120,
      title: '长临嘱',
      dataIndex: 'advice_timetype',
      customRender: ({ text }) => {
        return text == 1 ? '长期' : '临时';
      },
    },
    {
      title: '医嘱内容',
      dataIndex: 'advice_content',
    },
    {
      width: 120,
      title: '开始时间',
      dataIndex: 'advice_startdate',
    },
    {
      width: 120,
      title: '结束时间',
      dataIndex: 'advice_enddate',
    },
    {
      width: 50,
      title: '频率',
      dataIndex: 'advice_race',
      customRender: tableStateRender(rateOptions),
    },
    {
      width: 50,
      title: '用法',
      dataIndex: 'advice_usage',
      customRender: tableStateRender(useOptions),
    },
    {
      width: 150,
      title: '医嘱状态',
      dataIndex: 'status',
      customRender: ({ record }) => {
        // const noStart = moment().diff(moment(record.advice_startdate), 'day') < 0;
        // const isEnd = moment(record.advice_enddate).diff(moment(), 'day') < 0;
        return record.status == 0 ? '未执行' : record.status == 2 ? '已执行' : '执行中';
      },
    },
  ];

  const [registerTimeTable, { scrollTo }] = useTable({
    columns,
    pagination: false,
    fetchSetting: {
      pageField: 'page_index',
      sizeField: 'page_size',
      totalField: 'data_sum',
      listField: 'data',
    },
    searchInfo: {
      bed_id: props.bedData.bed_id,
      partition_id: props.bedData.partition_id,
    },
    api: getDoctorAdviceListApi,
    showIndexColumn: false,
    bordered: true,
    canResize: false,
    onChange() {
      scrollTo('top');
    },
  });
</script>

<style lang="less" scoped></style>
