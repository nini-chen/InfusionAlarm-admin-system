<template>
  <div class="p-4 bg-white h-14 flex justify-end items-center">
    <!-- date  -->
    <a-range-picker
      class="!mr-4 public-picker-bg"
      value-format="YYYY-MM-DD HH:mm:ss"
      format="YYYY-MM-DD HH:mm:ss"
      v-model:value="filterOptions.dateValue"
      :disabled-date="disabledDate"
      :show-time="{
        hideDisabledOptions: true,
        defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
      }"
    />

    <!-- manage-type  -->
    <a-select
      ref="select"
      class="!mr-4 w-200px public-select-bg"
      placeholder="请选择托管状态"
      v-model:value="filterOptions.statusValue"
      allow-clear
    >
      <a-select-option
        v-for="(select, index) in manageTypeOptions"
        :value="select.value"
        :key="index"
        >{{ select.label }}</a-select-option
      >
    </a-select>

    <!-- button  -->
    <a-button class="!mr-3" type="primary" @click="search">查询</a-button>
    <a-button @click="reset">重置</a-button>

    <!-- refresh -->
    <div class="hover:text-green-500 cursor-pointer flex items-center ml-8" @click="redo">
      <span class="align-center mr-2"> <Icon icon="iconoir:refresh-double" /></span>
      <span>刷新</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import moment, { Moment } from 'moment';
  import { manageTypeOptions, FilterOptions } from '../data';

  /*emits*/
  const emit = defineEmits<{
    (e: 'search', options: FilterOptions): void;
    (e: 'redo', options: FilterOptions): void;
  }>();

  //禁止选择的时间
  const disabledDate = (current: Moment) => {
    return current > moment().endOf('day') || current < moment('2022-01-01');
  };

  //时间选择器
  const filterOptions = ref<FilterOptions>({
    dateValue: ['', ''],
    statusValue: undefined,
  });

  /*查询*/
  function search() {
    emit('search', filterOptions.value);
  }

  /*重置*/
  function reset() {
    filterOptions.value = {
      dateValue: ['', ''],
      statusValue: undefined,
    };
    emit('search', filterOptions.value);
  }

  /*重新加载*/
  function redo() {
    emit('redo', filterOptions.value);
  }
</script>
