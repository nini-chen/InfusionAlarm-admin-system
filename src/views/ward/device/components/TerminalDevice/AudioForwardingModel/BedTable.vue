<template>
  <div class="p-4">
    <!-- 病床分机 列表 -->
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts" setup>
  import { BasicTable, useTable } from '/@/components/Table';
  import { getBedColumns } from './tableData';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getDeviceList } from '/@/api/ward/equipment';

  const { createMessage } = useMessage();


  const [registerTable, { reload, scrollTo }] = useTable({
    fetchSetting: {
      pageField: 'page_index',
      sizeField: 'page_size',
      listField: 'data',
      totalField: 'data_sum',
    },
    api: getDeviceList,
    // beforeFetch(info) {
    //   return { ...info, ...searchInfo };
    // },
    columns: getBedColumns(),
    rowKey: 'id',
    showTableSetting: false,
    bordered: true,
    showIndexColumn: true,
    canResize: true,
    clickToRowSelect: false,
    striped: false,
    onChange() {
      scrollTo('top');
    },
  });
</script>
