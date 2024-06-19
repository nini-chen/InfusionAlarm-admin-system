<template>
  <div class="p-4 bg-white h-14 flex items-center justify-end">
    <!-- date  -->
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

    <!-- call-type  -->
    <a-select
      class="!mr-4 w-200px public-select-bg"
      placeholder="请选择呼叫类型"
      ref="select"
      allow-clear
      v-model:value="filterOptions.callTypeValue"
    >
      <a-select-option
        v-for="select in callTypeOptions"
        :key="select.value"
        :value="select.value"
        >{{ select.label }}</a-select-option
      >
    </a-select>

    <!-- operate-type  -->
    <a-select
      class="!mr-4 w-200px public-select-bg"
      placeholder="请选择处理方式"
      ref="select"
      allow-clear
      v-model:value="filterOptions.operateTypeValue"
    >
      <a-select-option
        v-for="(select, index) in operateTypeOptions"
        :key="index"
        :value="select.value"
        >{{ select.label }}</a-select-option
      >
    </a-select>

    <!-- call-from  -->
    <a-select
      v-if="!icuFlag"
      ref="select"
      placeholder="请选择主叫方"
      allow-clear
      optionFilterProp="label"
      v-model:value="filterOptions.callFromValue"
      class="!mr-4 w-200px public-select-bg"
    >
      <a-select-option
        v-for="(select, index) in callFromOptions"
        :key="index"
        :label="select.device_name"
        :value="select.device_mac"
        >{{ select.device_name }}</a-select-option
      >
    </a-select>

    <a-select
      v-else
      ref="select"
      placeholder="请选择呼叫者名称"
      allow-clear
      v-model:value="filterOptions.callFromValue"
      class="!mr-4 w-200px public-select-bg"
    >
      <a-select-option
        v-for="(select, index) in callFromOptions"
        :key="index"
        :label="select.caller_name"
        :value="select.caller_name"
      >
        {{ select.caller_name }}
      </a-select-option>
    </a-select>

    <!-- button  -->
    <a-button class="!mr-3" type="primary" @click="search">查询</a-button>
    <a-button color="" @click="reset">重置</a-button>

    <!-- refresh -->
    <div class="ml-6 min-w-16 hover:text-green-500 cursor-pointer" @click="redo">
      <span class="align-center mr-2"> <Icon icon="iconoir:refresh-double" /></span>
      <span>刷新</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch, inject } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { callType, doType, filterCallType, sosType, icuCallType, icuHandleType } from '../data';
  import moment, { Moment } from 'moment';
  import { getDeviceList, getIcuCaller } from '/@/api/record/call';
  import { FilterOptions } from '../data';

  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();

  let icuFlag = inject('icuFlag');

  const emit = defineEmits<{
    (e: 'search', options: FilterOptions): void;
    (e: 'redo', options: FilterOptions): void;
  }>();

  //禁止选择的时间
  const disabledDate = (current: Moment) => {
    return current > moment().endOf('day') || current < moment('2022-01-01');
  };

  //选择器 筛选条件
  const filterOptions = ref<FilterOptions>({
    dateValue: [],
    callTypeValue: undefined,
    operateTypeValue: undefined,
    callFromValue: undefined,
  });

  //呼叫类型选择器
  const callTypeOptions = ref<any[]>(callType);

  //处理方式选择器
  const operateTypeOptions = ref<any[]>(doType);

  //主叫方
  const callFromOptions = ref<any[]>([]);
  async function getAllDeviceApi() {
    if ((icuFlag as any).value) {
      const result = await getIcuCaller({
        partition_id: userStore.getCurrentPartition.id,
      });
      callFromOptions.value = result;
    }
    // todo这里好像有点问题？？？？？？？？？？？？？？？
    else {
      const types = ['sos', 'sickbed', 'host', 'apk_sickbed'];
      const result = await getDeviceList({
        keyword: '',
      });
      callFromOptions.value = result.filter((i) => types.includes(i.device_type));
    }
  }

  /*查询*/
  function search() {
    emit('search', filterOptions.value);
  }

  /*重置*/
  function reset() {
    filterOptions.value = {
      dateValue: [],
      callTypeValue: undefined,
      operateTypeValue: undefined,
      callFromValue: undefined,
    };
    emit('search', filterOptions.value);
  }

  /*重新加载*/
  function redo() {
    emit('redo', filterOptions.value);
  }

  // 监听当前病区id，刷新主叫方
  watch(
    () => userStore.getCurrentPartition.id,
    () => {
      // reset();
      getAllDeviceApi();
    },
    { immediate: true },
  );

  /*监听filterOptions.operateTypeValue，做联动*/
  watch(
    () => filterOptions.value.callTypeValue,
    (n) => {
      // icu病区不做这些判断联动
      if ((icuFlag as any).value) return;

      if (n == 'call' || n == 'assist' || n == 'warn') {
        operateTypeOptions.value = filterCallType;
      } else if (n == 'sos') {
        operateTypeOptions.value = sosType;
      } else {
        operateTypeOptions.value = doType;
      }
    },
  );

  // 监听icuFlag，切换呼叫类型和处理方式
  watch(
    () => (icuFlag as any).value,
    (n) => {
      if (n) {
        callTypeOptions.value = icuCallType;
        operateTypeOptions.value = icuHandleType;
      } else {
        callTypeOptions.value = callType;
        operateTypeOptions.value = doType;
      }

      //请空当前选中项
      filterOptions.value.callTypeValue = undefined;
      filterOptions.value.operateTypeValue = undefined;
      filterOptions.value.callFromValue = undefined;
    },
    { immediate: true },
  );
</script>
