<template>
  <PageWrapper>
    <!-- 选择病区 -->
    <div class="flex justify-center items-center" v-append-to-dom="`SEARCH_AREA`">
      <PartitionSelect />
    </div>

    <div class="inpatient-manage-tab w-full text-blue-500 flex">
      <div class="flex flex-1 justify-start">
        <a-tabs v-model:activeKey="active">
          <template v-for="item of tabsMenus" :key="item.key">
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
                :partitionID="currentPartition.id"
              />
            </a-tab-pane>
          </template>
        </a-tabs>
      </div>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useUserStore } from '/@/store/modules/user';

  import PartitionSelect from '/@/views/sys/partition/index.vue';
  import InfoManage from './components/InfoManage/index.vue';
  import WardManage from './components/WardManage/index.vue';
  // import DeviceGroup from './components/DeviceGroup/index.vue';
  const tabsMenus = [
    {
      key: 1,
      name: '信息管理',
      component: InfoManage,
    },
    {
      key: 2,
      name: '病房管理',
      component: WardManage,
    },
    // {
    //   key: 3,
    //   name: '设备病区分组',
    //   component: DeviceGroup,
    // },
  ];

  const active = ref(1);

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  // 页码刷新的key （因为切换病区的时候要刷新页面内容）
  const refreshKey = computed(() => currentPartition.value?.id || new Date().getTime());
</script>

<style lang="less" scoped>
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
