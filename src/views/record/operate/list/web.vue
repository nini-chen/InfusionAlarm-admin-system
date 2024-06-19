<template>
  <div class="mt-4 bg-light-50">
    <div class="flex justify-center items-center" v-appendToDom="`SEARCH_AREA`">
      <!-- 选择病区 -->
      <PartitionSelect />
      <!-- 搜索关键字 -->
      <a-input-search
        class="!ml-4 !w-220px"
        v-model:value="params.keyword"
        placeholder="请输入关键字搜索"
        allowClear
        :maxlength="20"
        @search="getweblogListApi"
        @input="
          (e) => {
            params.keyword = oninputDeal(e);
          }
        "
      />
    </div>
    <a-table
      :scroll="{ y: 600 }"
      :row-selection="{ type: 'checkbox', onChange: onSelectChange }"
      sticky
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      :loading="ifredo"
      :row-key="(r) => r.id"
    >
      <template #index="{ index }">
        {{ params.page_size * (params.page_index - 1) + index + 1 }}
      </template>
      <template #time="{ record }">{{ formatToDateTime(record.create_time * 1000) }}</template>
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
  import { ref, reactive, computed, watch } from 'vue';
  import { columns } from '../data';
  import { getweblogList, getWebLog } from '/@/api/record/operate';
  import { oninputDeal } from '/@/utils/formRender';
  import { useUserStore } from '/@/store/modules/user';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import Footer from '/@/components/PageFooter/index.vue';
  import PartitionSelect from '/@/views/sys/partition/index.vue';
  import { scrollTop } from '/@/utils/event';
  import { message } from 'ant-design-vue';
  import { downloadByUrl } from '/@/utils/file/download';

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  /*emits*/
  const emit = defineEmits<{
    (e: 'disableExport', bool: boolean): void;
  }>();

  /*props*/
  interface Props {
    exportRefresh: number;
  }
  const props = withDefaults(defineProps<Props>(), {
    exportRefresh: 0,
  });

  watch(
    () => props.exportRefresh,
    () => exportLog(),
  );

  interface Params {
    page_index: number;
    page_size: number;
    start_time?: string;
    end_time?: string;
    partition_id?: string | number;
    type?: string;
    module?: string;
    keyword: string;
    idarr?: any[];
  }

  const params = reactive<Params>({
    page_index: 1,
    page_size: 10,
    start_time: '',
    end_time: '',
    partition_id: currentPartition.value.id,
    type: '',
    module: '',
    keyword: '',
    idarr: [],
  });

  /*切换page和size*/
  function onShowSizeChange({ current, size }) {
    params.page_index = current;
    params.page_size = size;
    getweblogListApi();
    scrollTop();
  }
  function sizeChange({ page, pageSize }) {
    params.page_index = page;
    params.page_size = pageSize;
    getweblogListApi();
    scrollTop();
  }

  /*选中日志*/
  const selectArr = ref<any[]>([]);
  function onSelectChange(rows) {
    selectArr.value = rows;
  }

  watch(
    () => currentPartition.value,
    (n) => {
      if (!n) return;
      params.partition_id = n.id;
      getweblogListApi(true);
      selectArr.value = [];
    },
    { deep: true },
  );

  const dataSource = ref<any[]>([]);
  const total = ref(0);
  let ifredo = ref(false);
  async function getweblogListApi(gotoOne = false) {
    gotoOne && (params.page_index = 1);

    let idarr = params.idarr;
    params.idarr = [];
    ifredo.value = true;
    let res = await getweblogList(params);
    ifredo.value = false;
    params.idarr = idarr;

    dataSource.value = res.data;
    total.value = res.data_sum;
    emit('disableExport', !Boolean(total.value));
  }
  getweblogListApi();

  /*导出*/
  async function exportLog() {
    params.idarr = selectArr.value;

    const exportParams = { ...params, page_index: 1 };
    const protocol = location.protocol;
    const host = import.meta.env.DEV ? import.meta.env.VITE_GLOB_HOSTNAME : location.hostname;
    const url = host + '/api/v2/weblog/listsexcel';
    const theDownloadUrl = protocol + '//' + joinUrlParams(url, exportParams);

    console.log(theDownloadUrl, 'theDownloadUrl');

    const headers = new Headers();
    // headers.append('Authorization', `Bearer ${userStore.getAccessToken}`);
    headers.append('Token', `${userStore.getToken}`);
    fetch(theDownloadUrl, { headers })
      .then((res) => res.blob())
      .then((blob) => {
        // 下载blob
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = '日志.zip';
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => {
        message.error('导出失败');
      });
  }

  function joinUrlParams(url: string, params: any) {
    const queryString = Object.entries(params)
      .map(([key, value]) => `${key}=${value || ''}`)
      .join('&');

    if (url.includes('?')) {
      url += '&' + queryString;
    } else {
      url += '?' + queryString;
    }
    console.log(url, encodeURIComponent(url));
    return url;
  }

  defineExpose({
    getweblogListApi,
    params,
  });
</script>
