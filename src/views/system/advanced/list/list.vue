<template>
  <div class="mt-4 bg-light-50">
    <a-table
      sticky
      :dataSource="dataSource"
      :columns="BackLightColumns"
      :pagination="false"
      :scroll="{ y: 600 }"
    >
      <template #index="{ index }">{{
        params.page_size! * (params.page_index! - 1) + index + 1
      }}</template>
      <template #type="{ record }">
        <div>{{ deviceType[record.device_type] }}</div>
      </template>
      <template #day="{ record }">
        <div>{{ `${record['day_start_time']} - ${record['day_end_time']}` }}</div>
      </template>
      <template #daylight="{ record }">
        <div>
          <InputNumber
            v-model:value="record.day_light"
            step="20"
            :min="20"
            :max="100"
            @change="changeDayLight(record)"
          />
        </div>
      </template>
      <template #night="{ record }">
        <div>{{ `${record['night_start_time']} - ${record['night_end_time']}` }}</div>
      </template>
      <template #nightlight="{ record }">
        <div>
          <InputNumber
            v-model:value="record.night_light"
            step="20"
            :min="20"
            :max="100"
            @change="changeNightLight(record)"
          />
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
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  import { getBackLightList, editBackLight } from '/@/api/system/advanced';
  import { BackLightColumns, deviceType } from '../data';
  import { useUserStore } from '/@/store/modules/user';
  import Footer from '/@/components/PageFooter/index.vue';
  import { InputNumber } from 'ant-design-vue';

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  /*props*/
  interface Props {
    refresh: number /*list刷新*/;
  }
  const props = withDefaults(defineProps<Props>(), {
    refresh: 0,
  });

  /*list请求参数*/
  interface Params {
    partition_id: number | string;
    page_index?: number;
    page_size?: number;
  }
  let params = ref<Params>({
    partition_id: currentPartition.value.id,
    page_index: 1,
    page_size: 10,
  });

  /*监听refresh变化，变化则重新请求list*/
  watch(
    () => props.refresh,
    () => getList(params.value),
  );
  /*监听partition_id，变化则更新列表*/
  watch(
    () => currentPartition.value,
    (n) => {
      if (!n) return;
      params.value.partition_id = n.id;
      getList(params.value);
    },
    { deep: true },
  );

  /*切换page和size*/
  function onShowSizeChange({ current, size }) {
    params.value.page_index = current;
    params.value.page_size = size;
    getList(params.value);
  }
  function sizeChange({ page, pageSize }) {
    params.value.page_index = page;
    params.value.page_size = pageSize;
    getList(params.value);
  }

  const dataSource = ref<any[]>();
  const total = ref(0);
  async function getList(params) {
    let res: any = await getBackLightList(params);
    dataSource.value = res.data;
    total.value = res.data_sum;
  }
  getList(params.value);

  async function changeDayLight(record) {
    if (typeof record.day_light == 'string') {
      let bool = isNaN(parseInt(record.day_light));
      if (bool) record.day_light = 80;
      else record.day_light = parseInt(record.day_light);
    }
    if (record.day_light < 20) return (record.day_light = 20);
    if (record.day_light > 100) return (record.day_light = 100);
    let data = { ...record, partition_id: params.value.partition_id };
    await editBackLight(data);
  }

  async function changeNightLight(record) {
    if (typeof record.night_light == 'string') {
      let bool = isNaN(parseInt(record.night_light));
      if (bool) record.night_light = 40;
      else record.night_light = parseInt(record.night_light);
    }
    if (record.night_light < 20) return (record.night_light = 20);
    if (record.night_light > 100) return (record.night_light = 100);
    let data = { ...record, partition_id: params.value.partition_id };
    await editBackLight(data);
  }
</script>
