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
        @search="getlogListApi"
        @input="
          (e) => {
            params.keyword = oninputDeal(e);
          }
        "
      />
    </div>
    <a-table
      v-if="!icuFlag"
      sticky
      :row-selection="{ type: 'checkbox', onChange: onSelectChange }"
      :scroll="{ y: 600 }"
      :dataSource="dataSource"
      :columns="terminalColumns"
      :pagination="false"
      :loading="ifredo"
      :row-key="(r) => r.id"
      ref="table"
    >
      <template #index="{ index }">
        {{ params.page_size * (params.page_index - 1) + index + 1 }}
      </template>
      <template #time="{ record }">
        {{ formatToDateTime(record.create_time * 1000) }}
      </template>
    </a-table>
    <a-table
      v-else
      sticky
      :row-selection="{ type: 'checkbox', onChange: onSelectChangeIcu }"
      :scroll="{ y: 600 }"
      :dataSource="dataSource"
      :columns="terminalIcuColumns"
      :pagination="false"
      :loading="ifredo"
      :row-key="(r) => r.id"
      ref="tableIcu"
    >
      <template #index="{ index }">
        {{ params.page_size * (params.page_index - 1) + index + 1 }}
      </template>
      <template #device_type="{ record }">
        {{ icuDevTypesMap[record.device_type] }}
      </template>
      <template #type="{ record }">
        {{ allIcuTypesMap[record.type] }}
      </template>
      <template #time="{ record }">
        {{ formatToDateTime(record.create_time * 1000) }}
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
  import { ref, reactive, computed, watch, inject } from 'vue';
  import { terminalColumns, terminalIcuColumns, icuDevTypesMap, allIcuTypesMap } from '../data';
  import { getwterlogList } from '/@/api/record/operate';
  import { oninputDeal } from '/@/utils/formRender';
  import { useUserStore } from '/@/store/modules/user';
  import { formatToDateTime } from '/@/utils/dateUtil';
  import Footer from '/@/components/PageFooter/index.vue';
  import PartitionSelect from '/@/views/sys/partition/index.vue';
  import { scrollTop } from '/@/utils/event';
  import { message } from 'ant-design-vue';

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  const icuFlag = inject('icuFlag');

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
    device_type?: string;
    keyword: string;
    idarr: any[];
  }

  const params = reactive<Params>({
    page_index: 1,
    page_size: 10,
    start_time: '',
    end_time: '',
    partition_id: currentPartition.value.id,
    type: '',
    device_type: '',
    keyword: '',
    idarr: [],
  });

  /*切换page和size*/
  function onShowSizeChange({ current, size }) {
    params.page_index = current;
    params.page_size = size;
    getlogListApi();
    scrollTop();
  }
  function sizeChange({ page, pageSize }) {
    params.page_index = page;
    params.page_size = pageSize;
    getlogListApi();
    scrollTop();
  }

  /*选中日志*/
  const selectArr = ref<any[]>([]);
  const selectArrIcu = ref<any[]>([]);
  function onSelectChange(rows) {
    selectArr.value = rows;
  }
  function onSelectChangeIcu(rows) {
    selectArrIcu.value = rows;
  }

  watch(
    () => currentPartition.value,
    (n) => {
      if (!n) return;
      params.partition_id = n.id;
      getlogListApi(true);
      selectArr.value = [];
      selectArrIcu.value = [];
    },
    { deep: true, immediate: true },
  );

  const dataSource = ref<any[]>([]);
  const total = ref(0);

  let ifredo = ref(false);
  async function getlogListApi(gotoOne = false) {
    gotoOne && (params.page_index = 1);

    let idarr = params.idarr;
    params.idarr = [];
    ifredo.value = true;
    let res = await getwterlogList(params);
    ifredo.value = false;
    params.idarr = idarr;

    dataSource.value = res.data;
    total.value = res.data_sum;
    emit('disableExport', !Boolean(total.value));
  }
  getlogListApi();

  /*导出*/
  async function exportLog() {
    if ((icuFlag as any).value) params.idarr = selectArrIcu.value;
    else params.idarr = selectArr.value;

    const exportParams = { ...params, page_index: 1 };

    const protocol = location.protocol;
    const host = import.meta.env.DEV ? import.meta.env.VITE_GLOB_HOSTNAME : location.hostname;
    const url = host + '/api/v2/terminallog/listsexcel';
    const theDownloadUrl = protocol + '//' + joinUrlParams(url, exportParams);

    const headers = new Headers();
    // headers.append('Authorization', `Bearer ${userStore.getAccessToken}`);
    headers.append('Token', `${userStore.getToken}`);
    fetch(theDownloadUrl, { headers })
      .then((res) => res.blob())
      .then((blob) => {
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
    return url;
  }

  defineExpose({
    getlogListApi,
    params,
  });
</script>
