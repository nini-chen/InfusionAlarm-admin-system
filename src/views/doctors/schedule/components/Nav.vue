<template>
  <div class="schedule-nav bg-white rounded flex justify-between items-center px-4 h-12">
    <Tabs
      class="!mt-4"
      :class="{ 'single-tab-bar-line': filterTabsOptions.length == 1 }"
      v-model:activeKey="tabActive"
      @change="handleChange"
    >
      <template v-for="item of filterTabsOptions" :key="item.key">
        <TabPane>
          <template #tab>
            <span class="text-base">{{ item.name }}</span>
          </template>
        </TabPane>
      </template>
    </Tabs>
    <div class="flex items-center">
      <a-button type="primary" size="small" @click="handleBatchImport"> 批量导入 </a-button>
      <div class="flex">
        <a-button type="link" size="small" @click="handlePre">
          <div class="picker-pointer">
            <LeftOutlined />
          </div>
        </a-button>
        <WeekPicker
          class="week-picker"
          placeholder="请选择周"
          :disabledDate="disabledDate"
          valueFormat="YYYY-MM-DD"
          :value="weekVal"
          @change="changeWeek"
          :allowClear="false"
        />
        <a-button type="link" size="small">
          <div class="picker-pointer" @click="handleNext">
            <RightOutlined />
          </div>
        </a-button>
      </div>
      <a-button type="link" size="small">
        <img
          class="cursor-pointer"
          :src="isDetail ? abbreviate0 : abbreviate1"
          title="缩略显示"
          @click="handleAbbreviate(false)"
        />
      </a-button>
      <a-button type="link" size="small">
        <img
          class="cursor-pointer"
          :src="isDetail ? detail1 : detail0"
          title="详细显示"
          @click="handleAbbreviate(true)"
        />
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, unref, computed } from 'vue';
  import { Tabs, DatePicker } from 'ant-design-vue';
  import { LeftOutlined, RightOutlined } from '@ant-design/icons-vue';
  import moment from 'moment';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRouter } from 'vue-router';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { usePermissionStoreWithOut } from '/@/store/modules/permission';

  // 图标
  import abbreviate0 from '/@/assets/images/abbreviate0.png';
  import abbreviate1 from '/@/assets/images/abbreviate1.png';
  import detail0 from '/@/assets/images/detail0.png';
  import detail1 from '/@/assets/images/detail1.png';

  const TabPane = Tabs.TabPane;
  const WeekPicker = DatePicker.WeekPicker;
  const go = useGo();
  const { currentRoute } = useRouter();
  const { createMessage } = useMessage();

  const permissionStore = usePermissionStoreWithOut();

  const emit = defineEmits(['selectWeek', 'changeModel', 'batchImport']);

  // 周的值，moment对象的值，默认给今天的值即可
  const weekVal = ref(moment());
  // 默认：详细显示
  const isDetail = ref<boolean>(true);

  // 2022-01-03之前的日期禁用
  function disabledDate(current) {
    return current < moment('2022-01-03');
    // return current < moment().add(-1, 'd');
  }

  function setMapToDate() {
    const startDate = moment(weekVal.value).day(1).format('YYYY-MM-DD');
    const endDate = moment(weekVal.value).day(7).format('YYYY-MM-DD');
    emit('selectWeek', { startDate, endDate });
  }

  // 上一周
  function handlePre() {
    const lastWeekLastDay = moment(weekVal.value).day(-1);
    if (lastWeekLastDay < moment('2022-01-03')) {
      createMessage.error('不能切换至2022-01-03之前的周!');
      return;
    }
    weekVal.value = lastWeekLastDay;
    setMapToDate();
  }

  // 下一周
  function handleNext() {
    const nextWeekFirstDay = moment(weekVal.value).day(8);
    weekVal.value = nextWeekFirstDay;
    setMapToDate();
  }

  // WeekPicker组件change事件
  const changeWeek = (date) => {
    weekVal.value = date;
    setMapToDate();
  };

  // tabs配置
  const tabsOptions = ref([
    {
      name: '护士排班',
      key: '/doctors/nurse',
      routeName: 'DoctorsNurse',
    },
    {
      name: '医生排班',
      key: '/doctors/doctor',
      routeName: 'DoctorsDoctor',
    },
  ]);

  // 护士排班、医生排版 路由切换
  function handleChange(activeKey) {
    go(activeKey);
  }

  // 缩略显示/详情显示的图标 点击切换
  function handleAbbreviate(flag: boolean) {
    isDetail.value = flag;
    emit('changeModel', flag);
  }

  // tabs涉及路由页面跳转，根据用户路由权限展示tabs选项是否展示
  const filterTabsOptions = computed(() => {
    return unref(tabsOptions).filter((tab) =>
      permissionStore.getPermCodeList.includes(tab.routeName),
    );
  });

  // 当前高亮tab
  const tabActive = computed(() => {
    return currentRoute.value.path || unref(filterTabsOptions)[0].key;
  });

  // 批量导入
  async function handleBatchImport() {
    emit('batchImport');
  }
</script>
<style lang="less">
  .schedule-nav {
    .week-picker {
      width: 120px;
      margin: 0 6px;

      .ant-input {
        background-color: #f7f8fc;
      }
    }

    .picker-pointer {
      width: 32px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      border-radius: 2px;
      color: #afbec9;
      background-color: #f7f8fc;
      border: 1px solid #afbec9;
      cursor: pointer;
    }
  }

  // 去掉周选择器的多余的第一列
  .ant-calendar-week-number {
    thead tr .ant-calendar-week-number-header,
    tbody tr .ant-calendar-week-number-cell {
      display: none;
    }
  }

  // 当只有一个tab, 添加底部横行线
  .single-tab-bar-line {
    .ant-tabs-ink-bar {
      width: 96px !important;
    }
  }
</style>
