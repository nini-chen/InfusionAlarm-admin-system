<template>
  <div class="mt-4 bg-light-50">
    <a-table
      v-if="!icuFlag"
      id="table"
      sticky
      :scroll="{ y: 600 }"
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      :loading="ifredo"
      :row-key="(r) => r.id"
    >
      <template #index="{ index }">
        {{ params.page_size * (params.page_index - 1) + index + 1 }}
      </template>
      <template #type="{ record }">{{ callHashMap[record.type] }}</template>
    </a-table>
    <a-table
      v-else
      id="table"
      sticky
      :scroll="{ y: 600 }"
      :dataSource="dataSource"
      :columns="icucolumns"
      :pagination="false"
      :loading="ifredo"
      :row-key="(r) => r.id"
    >
      <template #index="{ index }">
        {{ params.page_size * (params.page_index - 1) + index + 1 }}
      </template>
      <template #call_ts="{ record }">
        {{ dayjs(record.call_ts * 1000).format('YYYY-MM-DD HH:mm:ss') }}
      </template>
      <template #call_type="{ record }">
        {{ IcuCallTypeHashMap[record.call_type] }}
      </template>
      <template #handle_type="{ record }">
        {{ icuHandleHashMap[record.handle_type] }}
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
  import { ref, reactive, watch, computed, inject } from 'vue';
  import { columns, icucolumns, callHashMap, IcuCallTypeHashMap, icuHandleHashMap } from '../data';
  import { getCallList, getIcuCallList } from '/@/api/record/call';
  import { useUserStore } from '/@/store/modules/user';
  import { scrollTop } from '/@/utils/event';

  import Footer from '/@/components/PageFooter/index.vue';
  import dayjs from 'dayjs';

  const icuFlag = inject('icuFlag');

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  let ifredo = ref(false);

  const params = reactive({
    page_index: 1,
    page_size: 10,
    start_time: '',
    end_time: '',
    type: '',
    do_value: '',
    from_mac: '',
    partition_id: currentPartition.value.id,
  });

  const icuparams = {
    page_index: 1,
    page_size: 10,
    start_time: '',
    end_time: '',
    call_type: '',
    handle_type: '',
    caller_name: '',
    partition_id: currentPartition.value.id,
  };

  const dataSource = ref([]);
  const total = ref(0);

  async function requestList(gotoOne = false) {
    if ((icuFlag as any).value) getIcuList(gotoOne);
    else getList(gotoOne);
  }

  async function getList(gotoOne = false) {
    gotoOne && (params.page_index = 1);
    ifredo.value = true;
    let res = await getCallList(params);
    ifredo.value = false;
    total.value = res.data_sum;
    dataSource.value = res.data;
    scrollTop();
  }

  async function getIcuList(gotoOne = false) {
    // 这里由于分页器只有一个，绑定的是params，所以这里需要额外处理icuparams
    if (gotoOne) {
      icuparams.page_index = 1;
      params.page_index = 1;
    } else {
      icuparams.page_index = params.page_index; // footer绑定的是params
    }
    icuparams.page_size = params.page_size; // footer绑定的是params

    ifredo.value = true;
    let res = await getIcuCallList(icuparams);
    ifredo.value = false;
    total.value = res.data_sum;
    dataSource.value = res.data;
    scrollTop();
  }

  /*切换page和size*/
  function onShowSizeChange({ current, size }) {
    params.page_index = current;
    params.page_size = size;
    requestList();
  }
  function sizeChange({ page, pageSize }) {
    params.page_index = page;
    params.page_size = pageSize;
    requestList();
  }

  watch(
    () => currentPartition.value,
    (n) => {
      if (!n) return;
      params.partition_id = n.id;
      icuparams.partition_id = n.id;
      requestList(true);
    },
    { deep: true, immediate: true },
  );

  defineExpose({
    requestList,
    getIcuList,
    getList,
    params,
    icuparams,
    ifredo,
  });
</script>
