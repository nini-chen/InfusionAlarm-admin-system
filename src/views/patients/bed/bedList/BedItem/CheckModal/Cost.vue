<template>
  <div>
    <Patient :PatientInfo="personData" />
    <div class="pb-4 pt-1 font-bold">
      <Badge color="blue" text="费用详情" />
    </div>
    <BasicTable @register="registerCostTable" />
    <div class="pb-4 pt-4 font-bold">
      <Badge color="blue" text="单日消费清单" />
      <DatePicker class="!ml-2" v-model:value="dateVal" />
    </div>
    <BasicTable @register="registerDayTable" />
    <div>
      <p class="text-right text-grey-900 pt-2">单日总金额：0元</p>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Badge, DatePicker } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import Patient from './Patient.vue';
  import { BasicColumn } from '/@/components/Table/src/types/table';
  import type { Dayjs } from 'dayjs';

  const personData = ref({
    b1: '付小小',
    b2: '18100000000',
    b3: '菜鸟仓储',
    b4: '浙江省杭州市西湖区万塘路18号',
    b5: '一级',
    b6: '555',
  });

  const refundTimeTableSchema: BasicColumn[] = [
    {
      title: '总费用金额',
      width: 150,
      dataIndex: 't1',
    },
    {
      title: '预交金额',
      width: 150,
      dataIndex: 't2',
    },
    {
      title: '剩余金额',
      width: 150,
      dataIndex: 't3',
      // customRender: ({ record }) => {
      //   return <Badge status="success" text={record.t3} />;
      // },
    },
  ];

  const refundTimeTableSchema1: BasicColumn[] = [
    {
      title: '姓名',
      width: 150,
      dataIndex: 't1',
    },
    {
      title: '费用类型',
      width: 150,
      dataIndex: 't2',
    },
    {
      title: '费用项目',
      width: 150,
      dataIndex: 't3',
      // customRender: ({ record }) => {
      //   return <Badge status="success" text={record.t3} />;
      // },
    },
    {
      title: '费用',
      width: 150,
      dataIndex: 't4',
    },
    {
      title: '缴费时间',
      width: 150,
      dataIndex: 't5',
    },
  ];

  const refundTableData: any[] = [
    {
      t1: 1234561,
      t2: '矿泉水 550ml',
      t3: '12421432143214321',
      t4: '2.00',
      t5: 1,
      t6: 2.0,
    },
    {
      t1: 1234562,
      t2: '矿泉水 550ml',
      t3: '12421432143214321',
      t4: '2.00',
      t5: 2,
      t6: 2.0,
    },
    {
      t1: 1234562,
      t2: '矿泉水 550ml',
      t3: '12421432143214321',
      t4: '2.00',
      t5: 2,
      t6: 2.0,
    },
    {
      t1: 1234562,
      t2: '矿泉水 550ml',
      t3: '12421432143214321',
      t4: '2.00',
      t5: 2,
      t6: 2.0,
    },
  ];
  const dateVal = ref<Dayjs>();
  const [registerCostTable] = useTable({
    columns: refundTimeTableSchema,
    pagination: false,
    dataSource: refundTableData,
    showIndexColumn: false,
    bordered: true,
    canResize: false,
    // scroll: { y: 300 },
  });

  const [registerDayTable] = useTable({
    columns: refundTimeTableSchema1,
    pagination: false,
    dataSource: refundTableData,
    showIndexColumn: false,
    bordered: true,
    canResize: false,
    // scroll: { y: 300 },
  });
</script>

<style lang="less" scoped></style>
