<template>
  <PageWrapper>
    <!-- 选择病区 -->
    <div class="flex justify-center items-center" v-append-to-dom="`SEARCH_AREA`">
      <PartitionSelect v-show="active == 2" />
    </div>
    <!-- tabs标题栏切换：新设备绑定 / 终端设备管理 / 离线设备列表 -->
    <div class="device-manage-tab w-full text-blue-500 flex">
      <div class="flex flex-1 justify-start">
        <a-tabs v-model:activeKey="active" @change="changeTab">
          <template v-for="item of tabsOptions" :key="item.key">
            <a-tab-pane>
              <template #tab>
                <div class="flex">
                  <span class="ml-2 text-base">{{ item.name }}</span>
                </div>
              </template>
              <!-- tabs内容 -->
              <component
                :is="item.component"
                :key="refreshKey + active"
                :inpatientQuery="inpatientQuery"
              />
            </a-tab-pane>
          </template>
        </a-tabs>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted, shallowRef } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import { PageWrapper } from '/@/components/Page';

  // 公用的选择病区select框
  import PartitionSelect from '/@/views/sys/partition/index.vue';

  // 新设备绑定组件
  import NewBind from './components/NewBind/index.vue';
  // 终端设备组件
  import TerminalDevice from './components/TerminalDevice/index.vue';
  // 离线设备列表组件
  import OfflineList from './components/OfflineList/index.vue';

  // tabs相关
  const active = ref<number>(1);
  const tabsOptions = shallowRef([
    {
      key: 1,
      name: '新设备绑定',
      component: NewBind,
    },
    {
      key: 2,
      name: '终端设备管理',
      component: TerminalDevice,
    },
    {
      key: 3,
      name: '离线设备列表',
      component: OfflineList,
    },
  ]);

  const userStore = useUserStore();

  // 其他页面跳过之前，在本地缓存的参数，仅用一次
  const inpatientQuery = ref({});

  // 切换tab事件
  function changeTab() {
    // 切换tab时，要清空，因为仅用一次
    inpatientQuery.value = {};
  }

  /* 
  其他页面跳到当前页面携带参数的情况：
  1. 从病区管理-病房管理-洗手间按钮\病床分机的编辑按钮 点击后跳过来；
  2. 页面右上角离线设备红色图标的文本提示，点击跳转到当前页面查看离线设备列表;
  */
  function checkComeFormInpatient() {
    const fromInpatientEdit = sessionStorage.getItem('fromInpatientEdit');
    if (!fromInpatientEdit) return;
    const { tabActive } = JSON.parse(fromInpatientEdit);
    active.value = Number(tabActive);
    inpatientQuery.value = JSON.parse(fromInpatientEdit);
    sessionStorage.removeItem('fromInpatientEdit');
  }

  onMounted(() => {
    checkComeFormInpatient();
  });

  // 页码刷新的key （因为切换病区的时候要刷新页面内容）
  const refreshKey = computed(() => userStore?.getCurrentPartition?.id || new Date().getTime());
</script>

<style lang="less">
  .device-manage-tab {
    .ant-tabs {
      width: 100%;

      .ant-tabs-nav-wrap {
        padding-left: 6px;
        border-radius: 2px;
        background-color: #fff;
      }
    }

    .ant-tabs-extra-content {
      line-height: normal;
    }
  }
</style>
