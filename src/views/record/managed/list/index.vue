<template>
  <div class="mt-4 bg-light-50">
    <a-table
      sticky
      :scroll="{ y: 600 }"
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      :loading="ifredo"
      :row-key="(r) => r.id"
    >
      <template #index="{ index }">{{
        params.page_size * (params.page_index - 1) + index + 1
      }}</template>
      <template #status="{ record }">
        <div>{{ record.agent_status == 1 ? '托管中' : '已结束' }}</div>
      </template>
      <template #start="{ record }">
        <div>{{ formatToDateTime(record.start_time * 1000) }}</div>
      </template>
      <template #end="{ record }">
        <div>{{ record.end_time == 0 ? '--' : formatToDateTime(record.end_time * 1000) }}</div>
      </template>
      <template #length="{ record }">
        <div>{{ getLength(record.length) }}</div>
      </template>
    </a-table>

    <Footer
      @onShowSizeChange="onShowSizeChange"
      @sizeChange="sizeChange"
      :total="total"
      :size="params.page_size"
      :page="params.page_index"
    />
  </div>
</template>
<script setup lang="ts">
  import { ref, reactive, watch, computed } from 'vue';
  // import { BasicTable } from '/@/components/Table';
  import { columns } from '../data';
  import { getAgentList } from '/@/api/record/agent';
  import { useUserStore } from '/@/store/modules/user';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import Footer from '/@/components/PageFooter/index.vue';
  import { scrollTop } from '/@/utils/event';

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  let ifredo = ref(false);

  const params = reactive({
    page_index: 1,
    page_size: 10,
    start_time: '',
    end_time: '',
    agent_status: '',
    partition_id: currentPartition.value.id,
  });

  /*切换page和size*/
  function onShowSizeChange({ current, size }) {
    params.page_index = current;
    params.page_size = size;
    getList();
    scrollTop();
  }
  function sizeChange({ page, pageSize }) {
    params.page_index = page;
    params.page_size = pageSize;
    getList();
    scrollTop();
  }

  watch(
    () => currentPartition.value,
    (n) => {
      if (!n) return;
      params.partition_id = n.id;
      getList(true);
    },
    { deep: true },
  );

  const dataSource = ref([]);
  const total = ref(0);
  async function getList(gotoOne = false) {
    gotoOne && (params.page_index = 1);
    ifredo.value = true;
    let res = await getAgentList(params);
    ifredo.value = false;
    total.value = res.data_sum;
    dataSource.value = res.data;
  }
  getList();

  /*通话时长*/
  function getLength(length) {
    if (length == 0) return '--';
    else if (length < 60) return `${length} 秒`;
    else if (length < 3600) {
      let m = Math.floor(length / 60);
      let s = length - m * 60;
      return `${m}分钟${s}秒`;
    } else {
      let h = Math.floor(length / 3600);
      let m = Math.floor((length - 3600 * h) / 60);
      let s = length - 3600 * h - 60 * m;
      return `${h}小时${m}分钟${s}秒`;
    }
  }

  defineExpose({
    getList,
    params,
    ifredo,
  });
</script>
