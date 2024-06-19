<template>
  <div class="w-full">
    <div class="position">
      <div>
        <Select
          v-model:value="deviceType"
          placeholder="选择设备类型"
          class="public-select-bg"
          style="width: 240px"
          :options="deviceClassify"
          @change="handleSelectChange"
          allowClear
        />
      </div>
      <div class="m-2">
        <InputSearch
          placeholder="设备名称/MAC/IP地址"
          v-model:value="totle.keyword"
          :maxlength="20"
          @input="(e) => (totle.keyword = oninputSpaceDeal(e))"
          @search="searchFn"
          allowClear
        />
      </div>
      <div class="m-2">
        <Button type="primary" @click="searchFn" class="mr-2"> 查询 </Button>
        <Button @click="resetList" class="mr-10"> 重置 </Button>
        <Button type="primary" @click="rushList">
          <SyncOutlined />
          刷新
        </Button>
      </div>
    </div>
    <BasicTable :pagination="pagination" @register="registerTable">
      <template #device_online_status="{ record }">
        <span :style="{ color: record.device_online_status == 1 ? '#00C219' : '#FF4D4F' }">
          {{ record.device_online_status == 1 ? '在线' : '离线' }}
        </span>
      </template>
      <template #outline_time="{ record }">
        <span>
          {{
            record.outline_time
              ? moment(parseInt(record.outline_time * 1000)).format('YYYY-MM-DD HH:mm:ss')
              : '--'
          }}
        </span>
      </template>
    </BasicTable>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue';
  import { Button, Select, InputSearch } from 'ant-design-vue';
  import { SyncOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable } from '/@/components/Table';
  import { offliceColumns, deviceClassify } from '../table.data';
  import { getOnlineList } from '/@/api/ward/equipment';
  import { useUserStore } from '/@/store/modules/user';
  import { oninputSpaceDeal } from '/@/utils/formRender';
  import moment from 'moment';

  const userStore = useUserStore();
  const deviceType = ref('');
  const pagination = ref<any>(false);
  const lists = ref([]);
  const totle = ref({
    page_index: 1,
    page_size: 10,
    device_type: deviceType.value,
    keyword: '',
  });

  onMounted(() => {
    getList();
  });

  watch(
    () => userStore?.getCurrentPartition?.id,
    (newVal) => {
      if (!newVal) return;
      getList();
    },
    {
      deep: true,
    },
  );

  // 注册表格组件
  const [registerTable, { setLoading, scrollTo }] = useTable({
    dataSource: lists,
    columns: offliceColumns,
    useSearchForm: false,
    bordered: true,
    clickToRowSelect: false,
    showIndexColumn: true,
    rowKey: 'id',

    onChange(pagination) {
      totle.value.page_index = pagination.current;
      totle.value.page_size = pagination.pageSize;
      getList();
      scrollTo('top');
    },
  });

  //获取列表
  async function getList() {
    let params = {
      page_index: totle.value.page_index,
      page_size: totle.value.page_size,
      device_type: totle.value.device_type,
      keyword: totle.value.keyword,
    };
    setLoading(true);
    const res = await getOnlineList(params);
    const { data, data_sum, page_index, page_size } = res;
    lists.value = data;

    console.log(data, data_sum, page_index, page_size);
    setLoading(false);
    pagination.value = {
      showSizeChanger: true,
      showQuickJumper: true,
      current: totle.value.page_index,
      total: Number(data_sum),
      pageSize: page_size,
    };
  }

  //重置
  function resetList() {
    totle.value.page_index = 1;
    totle.value.keyword = '';
    totle.value.device_type = '';
    totle.value.page_size = 10;
    deviceType.value = '';
    getList();
  }

  //刷新
  function rushList() {
    getList();
  }

  //设备下拉选择
  function handleSelectChange(val) {
    totle.value.page_index = 1;
    totle.value.keyword = '';
    totle.value.device_type = val;
    totle.value.page_size = 10;
    // getList();
  }

  function searchFn() {
    getList();
  }
</script>

<style lang="less" scoped>
  .position {
    position: absolute;
    top: 0;
    right: 25px;
    display: flex;
    align-items: center;
  }
</style>
