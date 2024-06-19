<template>
  <div class="p-4 bg-white h-14 flex justify-between items-center">
    <!-- tabs  -->
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="探视审批" />
      <a-tab-pane key="2" tab="探视录像" />
    </a-tabs>
    <div class="flex">
      <!-- date  -->
      <span class="mt-5px mr-3">{{ activeKey == '1' ? '预约时间' : '探视时间' }}:</span>
      <a-range-picker
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY-MM-DD HH:mm:ss"
        allow-clear
        :disabled-date="disabledDate"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
        v-model:value="filterOptions.dateValue"
        class="!mr-4 public-picker-bg"
      />

      <a-select
        class="!mr-4 w-200px public-select-bg"
        placeholder="请选择审批状态"
        v-if="activeKey == '1'"
        ref="select"
        allow-clear
        v-model:value="filterOptions.state"
      >
        <a-select-option
          v-for="(select, index) in stateOptions"
          :key="index"
          :value="select.value"
          >{{ select.label }}</a-select-option
        >
      </a-select>
      <a-input-search
        v-if="activeKey == '2'"
        key="1"
        class="!mr-4 !w-220px"
        v-model:value="filterOptions.keyword"
        placeholder="请输入患者姓名"
        allowClear
        :maxlength="20"
        @search="search"
        @input="
          (e) => {
            filterOptions.keyword = oninputDeal(e);
          }
        "
      />

      <!-- button  -->
      <a-button class="!mr-3" type="primary" @click="search">查询</a-button>
      <a-button color="" @click="reset">重置</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import moment, { Moment } from 'moment';
  import { FilterOptions } from '../data';
  import { oninputDeal } from '/@/utils/formRender';

  const emit = defineEmits<{
    (e: 'search', options: FilterOptions): void;
    (e: 'redo', options: FilterOptions): void;
    (e: 'keyChange', key: string): void;
  }>();
  //tabs选择
  let activeKey = ref('1');
  watch(
    () => activeKey.value,
    (n) => emit('keyChange', n),
  );
  const stateOptions = ref([
    { value: '', label: '全部' },
    { value: 0, label: '待审批' },
    { value: 1, label: '已通过' },
    { value: 3, label: '未通过' },
    { value: 2, label: '已逾期' },
  ]);

  //禁止选择的时间
  const disabledDate = (current: Moment) => {
    return current > moment().endOf('day') || current < moment('2022-01-01');
  };

  //选择器
  const filterOptions = ref<FilterOptions>({
    dateValue: [],
    keyword: '',
    state: '',
  });

  /*查询*/
  function search() {
    emit('search', filterOptions.value);
  }

  /*重置*/
  function reset() {
    filterOptions.value = {
      dateValue: [],
      keyword: '',
      state: '',
    };
    emit('search', filterOptions.value);
  }
</script>
