<template>
  <div>
    <Patient :PatientInfo="personData" />
    <div class="pb-4 pt-1 font-bold">
      <Badge color="blue" text="检验检查信息" />
    </div>
    <BasicTable @register="registerTimeTable" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Badge } from 'ant-design-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { BasicColumn } from '/@/components/Table/src/types/table';
  import Patient from './Patient.vue';

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
      title: '姓名',
      width: 150,
      dataIndex: 't1',
    },
    {
      title: '时间',
      width: 150,
      dataIndex: 't2',
    },
    {
      title: '名称',
      width: 150,
      dataIndex: 't3',
      // customRender: ({ record }) => {
      //   return <Badge status="success" text={record.t3} />;
      // },
    },
    {
      title: '注意事项',
      width: 150,
      dataIndex: 't4',
    },
    {
      title: '结果',
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

  const [registerTimeTable] = useTable({
    columns: refundTimeTableSchema,
    pagination: false,
    dataSource: refundTableData,
    showIndexColumn: false,
    bordered: true,
    canResize: false,
    // scroll: { y: 300 },
  });
</script>

<style lang="less" scoped></style>
