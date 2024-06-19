<template>
  <div>
    <Patient :PatientInfo="personData" />
    <div class="pb-4 pt-1 font-bold">
      <Badge color="blue" text="生命体征信息" />
    </div>
    <div class="flex pb-4 px-2">
      <div class="bg-white box-shadow h-168px w-137px mr-4 py-2">
        <ul class="cursor-pointer">
          <li
            v-for="item of infoTitleList"
            :key="item.key"
            class="text-sm pl-5 py-1 text-gray-500"
            :class="currentCare === item.key ? '!text-blue-600 bg-blue-200' : ''"
          >
            <span>{{ item.label }}</span>
            <span class="pl-4">{{ item.prefix }}</span>
          </li>
        </ul>
      </div>
      <BasicTable class="flex-1 box-shadow" @register="registerTimeTable" />
    </div>
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
      title: '时间',
      width: 150,
      dataIndex: 't1',
    },
    {
      title: '体温数据°C',
      width: 150,
      dataIndex: 't2',
    },
  ];

  const refundTableData: any[] = [
    {
      t1: 1234561,
      t2: '矿泉水 550ml',
    },
    {
      t1: 1234562,
      t2: '矿泉水 550ml',
    },
    {
      t1: 1234562,
      t2: '矿泉水 550ml',
    },
    {
      t1: 1234562,
      t2: '矿泉水 550ml',
    },
  ];

  const infoTitleList = [
    {
      key: 1,
      label: '体温',
      prefix: '℃',
    },
    {
      key: 2,
      label: '血压',
      prefix: 'mmHg',
    },
    {
      key: 3,
      label: '呼吸',
      prefix: '次/分钟',
    },
    {
      key: 4,
      label: '脉搏',
      prefix: '次/分钟',
    },
    {
      key: 5,
      label: '心率',
      prefix: '次/分钟',
    },
  ];

  const currentCare = ref(1);

  const [registerTimeTable] = useTable({
    columns: refundTimeTableSchema,
    pagination: false,
    dataSource: refundTableData,
    showIndexColumn: false,
    bordered: true,
    canResize: false,
    striped: false,
    // scroll: { y: 300 },
  });
</script>

<style lang="less" scoped>
  .box-shadow {
    box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
  }
</style>
