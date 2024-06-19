<template>
  <div class="mt-4 bg-light-50">
    <a-table
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
      <template #bed_room="{ record }">
        {{ record.icu_sickbed_room_name + record.icu_sickbed_bed_name }}
      </template>
      <template #record="{ record }">
        <div v-if="record.is_record === 1"> -- </div>
        <div v-else-if="!record.is_normal" class="text-gray-400">已逾期</div>
        <div v-else>
          <n-button
            quaternary
            type="info"
            size="small"
            @click="openModal(record.record_path, record)"
            >播放</n-button
          >
          <n-button quaternary type="info" size="small" @click="downloadRecord(record.id)"
            >下载</n-button
          >
        </div>
      </template>
    </a-table>
    <Footer
      @onShowSizeChange="onShowSizeChange"
      @sizeChange="sizeChange"
      :total="total"
      :size="params.page_size"
      :page="params.page_index"
    />
    <n-modal
      v-model:show="showModal"
      preset="card"
      title="录音录像"
      style="width: 950px"
      header-style="background-color: #DAE6F5"
    >
      <div class="w-full h-full relative">
        <div class="flex h-80px leading-80px absolute top-0px left-0 right-0 z-index-9999 bg-white">
          <div class="flex-1 text-center bg-skyblue">
            <span class="text-[#387AF6]">{{ recordInfo.icu_family_numname }}</span>
            探视家属分机</div
          >
          <div class="flex-1 text-center bg-skyblue">
            <span class="text-[#387AF6]">{{ recordInfo.icu_sickbed_bed_name }}</span>
            探视病床分机</div
          >
        </div>
        <Dplayer :url="record_path" />
        <div
          v-if="0"
          class="flex h-30px leading-30px absolute bottom--80px left-0 right-0 z-index--1 bg-[#eee]"
        >
        </div>
      </div>
    </n-modal>
  </div>
</template>
<script setup lang="ts">
  import { NButton, NModal } from 'naive-ui';
  import { ref, reactive, watch, computed } from 'vue';
  import Dplayer from '../components/dplayer.vue';
  import { columns } from '../data';
  import { getIcuVisitVideoList } from '/@/api/record/visit';
  import { useUserStore } from '/@/store/modules/user';
  import { scrollTop } from '/@/utils/event';
  import { downloadByUrl } from '/@/utils/file/download';

  import Footer from '/@/components/PageFooter/index.vue';

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  let ifredo = ref(false);

  const params = reactive({
    page_index: 1,
    page_size: 10,
    partition_id: currentPartition.value.id,
    start_time: '',
    end_time: '',
    keyword: '',
  });

  const dataSource = ref([]);
  const total = ref(0);

  function is_icu() {
    console.log(currentPartition.value, 'currentPartition-video');
    return currentPartition.value.is_icu === 1;
  }
  async function getList(gotoOne = false) {
    if (!is_icu()) {
      dataSource.value = [];
      total.value = 0;
      return;
    }
    gotoOne && (params.page_index = 1);
    ifredo.value = true;
    let res = await getIcuVisitVideoList(params);
    ifredo.value = false;
    total.value = res.data_sum;
    dataSource.value = res.data;
    scrollTop();
  }
  getList();

  /*切换page和size*/
  function onShowSizeChange({ current, size }) {
    params.page_index = current;
    params.page_size = size;
    getList();
  }
  function sizeChange({ page, pageSize }) {
    params.page_index = page;
    params.page_size = pageSize;
    getList();
  }

  // 查看探视回放
  const showModal = ref(false);
  const record_path = ref('');
  const recordInfo = ref<any>({});
  function openModal(path: string, record: any) {
    showModal.value = true;
    record_path.value = path;
    recordInfo.value = record;
  }

  // 下载探视回放
  function downloadRecord(id: string) {
    const protocol = location.protocol;
    const host = import.meta.env.DEV ? import.meta.env.VITE_GLOB_HOSTNAME : location.hostname;
    const url = protocol + '//' + host + '/api/v2/kin/downloadIcuVisitVideo?id=' + id;
    downloadByUrl({
      url,
      target: '_self',
    });
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

  defineExpose({
    getList,
    params,
    ifredo,
  });
</script>
