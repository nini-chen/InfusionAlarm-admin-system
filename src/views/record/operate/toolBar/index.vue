<template>
  <div class="p-4 bg-white h-14 flex justify-between items-center">
    <!-- tabs  -->
    <a-tabs v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="后台系统日志" />
      <a-tab-pane key="2" tab="终端系统日志" />
    </a-tabs>

    <!-- 后台系统设置 -->
    <div class="flex" v-if="activeKey == '1'" key="1">
      <!-- date  -->
      <a-range-picker
        v-model:value="filterOptions.dateValue"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY-MM-DD HH:mm:ss"
        :disabled-date="disabledDate"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
        class="!mr-4 public-picker-bg"
      />
      <!-- operate-type  -->
      <a-select
        ref="select"
        v-model:value="filterOptions.operateTypeValue"
        placeholder="请选择操作类型"
        class="!mr-4 w-200px public-select-bg"
        show-time
        allow-clear
      >
        <a-select-option v-for="(select, index) in typeList" :value="select.value" :key="index">
          {{ select.label }}
        </a-select-option>
      </a-select>
      <!-- button  -->
      <a-button class="!mr-3" type="primary" @click="search">查询</a-button>
      <a-button class="!mr-3" type="primary" @click="webRedo">重置</a-button>
      <a-button class="ml-5" :disabled="props.disableWeb" @click="exportExcel('1')">
        导出日志
      </a-button>
    </div>

    <!-- 终端系统日志 -->
    <div class="flex" v-if="activeKey == '2'" key="2">
      <!-- terminal-type  -->
      <a-select
        ref="select"
        v-model:value="terFilterOptions.terLogTypeValue"
        class="!mr-4 w-160px public-select-bg"
        placeholder="选择设备类型"
        allowClear
      >
        <a-select-option v-for="(select, index) in devices" :value="select.value" :key="index">
          {{ select.label }}
        </a-select-option>
      </a-select>
      <!-- terminal-type  -->
      <a-select
        ref="select"
        v-model:value="terFilterOptions.terminalTypeValue"
        class="!mr-4 w-160px public-select-bg"
        placeholder="选择操作类型"
        allowClear
      >
        <a-select-option
          v-for="(select, index) in terminalSelect"
          :value="select.value"
          :key="index"
          >{{ select.label }}</a-select-option
        >
      </a-select>
      <!-- date  -->
      <a-range-picker
        v-model:value="terFilterOptions.dateValue"
        value-format="YYYY-MM-DD HH:mm:ss"
        format="YYYY-MM-DD HH:mm:ss"
        :disabled-date="disabledDate"
        :show-time="{
          hideDisabledOptions: true,
          defaultValue: [moment('00:00:00', 'HH:mm:ss'), moment('23:59:59', 'HH:mm:ss')],
        }"
        class="!mr-4 public-picker-bg"
      />
      <!-- button  -->
      <a-button class="!mr-3" type="primary" @click="search">查询</a-button>
      <a-button class="!mr-3" type="primary" @click="terRedo">重置</a-button>
      <a-button class="ml-5" @click="exportExcel('2')" :disabled="props.disableTer"
        >导出日志</a-button
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch, inject } from 'vue';
  import moment, { Moment } from 'moment';
  import {
    typeList,
    FilterOptions,
    TerminalFilterOptions,
    deviceTypeAll,
    icuDevTypes,
    doorwayOpList,
    ternimalOpList,
    ternimalSosOpList,
    ternimalSickOpList,
    ternimalHostOpList,
    icuFamilyTypes,
    icuSickTypes,
    icuHostTypes,
    allIcuTypes,
  } from '../data';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();

  const icuFlag = inject('icuFlag');

  /*emit*/
  const emit = defineEmits<{
    (e: 'webParamsChange', options: any): void;
    (e: 'terParamsChange', options: any): void;
    (e: 'search', options: FilterOptions): void;
    (e: 'terSearch', options: TerminalFilterOptions): void;
    (e: 'keyChange', key: string): void;
    (e: 'exportExcel', key: string): void;
  }>();

  /*props*/
  interface Props {
    disableTer: boolean;
    disableWeb: boolean;
  }
  const props = withDefaults(defineProps<Props>(), {
    disableTer: false,
    disableWeb: false,
  });

  //禁止选择的时间
  const disabledDate = (current: Moment) => {
    return current > moment().endOf('day') || current < moment('2022-01-01');
  };

  //tabs选择
  let activeKey = ref('1');

  watch(
    () => activeKey.value,
    (n) => emit('keyChange', n),
  );

  function search() {
    if (activeKey.value == '1') emit('search', filterOptions.value);
    else emit('terSearch', terFilterOptions.value);
  }

  //web日志===================================================================================================
  //选择器
  const filterOptions = ref<FilterOptions>({
    dateValue: [],
    operateTypeValue: undefined,
  });

  watch(
    () => filterOptions.value,
    (n) => {
      emit('webParamsChange', n);
    },
    { deep: true },
  );

  function webRedo() {
    emit(
      'search',
      (filterOptions.value = {
        dateValue: [],
        operateTypeValue: undefined,
      }),
    );
  }

  //终端日志==================================================================================================

  //选择器
  const devices = ref<any[]>(deviceTypeAll);

  const terFilterOptions = ref<TerminalFilterOptions>({
    dateValue: [],
    terLogTypeValue: undefined,
    terminalTypeValue: undefined,
  });

  watch(
    () => terFilterOptions.value,
    (n) => {
      emit('terParamsChange', n);
    },
    { deep: true },
  );

  const terminalSelect = ref<any[]>(ternimalOpList);

  /*查询*/
  function terRedo() {
    emit(
      'terSearch',
      (terFilterOptions.value = {
        dateValue: [],
        terLogTypeValue: undefined,
        terminalTypeValue: undefined,
      }),
    );
  }

  watch(
    () => userStore.getCurrentPartition,
    (n) => {
      if (n.is_icu === 1) {
        devices.value = icuDevTypes;
        terminalSelect.value = allIcuTypes;
      } else {
        devices.value = deviceTypeAll;
        terminalSelect.value = ternimalOpList;
      }
    },
    { deep: true, immediate: true },
  );

  /*联动*/
  watch(
    () => terFilterOptions.value.terLogTypeValue,
    (n) => {
      if ((icuFlag as any).value) {
        if (n == 'icu_family') {
          terminalSelect.value = icuFamilyTypes;
        } else if (n == 'icu_sickbed') {
          terminalSelect.value = icuSickTypes;
        } else if (n == 'icu_host') {
          terminalSelect.value = icuHostTypes;
        }
        // else if (m == 'icu_guard') {
        //   terminalSelect.value = icuGuardTypes;
        // }
        else {
          terminalSelect.value = allIcuTypes;
        }
        return;
      }
      if (n == 'sickbed' || n === 'apk_sickbed') {
        terminalSelect.value = ternimalSickOpList;
      } else if (n == 'host') {
        terminalSelect.value = ternimalHostOpList;
      } else if (n == 'sos') {
        terminalSelect.value = ternimalSosOpList;
      } else if (n == 'doorway') {
        terminalSelect.value = doorwayOpList;
      } else {
        terminalSelect.value = ternimalOpList;
      }
    },
  );

  /*导出*/
  function exportExcel(key) {
    emit('exportExcel', key);
  }
</script>
