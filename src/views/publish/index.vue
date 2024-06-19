<template>
  <div class="p-4">
    <!-- 选择病区 -->
    <div class="flex justify-center items-center" v-append-to-dom="`SEARCH_AREA`">
      <PartitionSelect />
    </div>
    <!-- tabs -->
    <div class="msg-publish-tab w-full text-blue-500 flex">
      <div class="flex flex-1 justify-start">
        <Tabs v-model:activeKey="tabActive">
          <template v-for="item of tabs" :key="item.key">
            <TabPane>
              <template #tab>
                <div class="flex">
                  <span class="text-base">{{ item.name }}</span>
                </div>
              </template>
              <!-- tabs内容 -->
              <component :is="item.component" :key="refreshKey + tabActive" />
            </TabPane>
          </template>
        </Tabs>
      </div>
    </div>
    <!-- <a-empty v-if="icuFlag" /> -->
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, computed, watch, shallowRef, provide } from 'vue';
  import { Tabs } from 'ant-design-vue';

  import PartitionSelect from '/@/views/sys/partition/index.vue';
  // 通知提示
  import Notice from './components/Notice/index.vue';
  // 紧急通知
  import Urgent from './components/Urgent/index.vue';
  // 病区标语
  import Slogan from './components/Slogan/index.vue';

  import { getOneStatus } from '/@/api/publish/publish';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const isUrgent = ref(false);
  const refreshKey = ref(new Date().getTime());

  // 当前用户所处的病区的id
  let partitionId = computed(() => userStore.getCurrentPartition.id);

  const TabPane = Tabs.TabPane;
  const tabActive = ref<number>(1);
  const tabsOptions = shallowRef([
    {
      key: 1,
      name: '通知提示',
      component: Notice,
    },
    {
      key: 2,
      name: '病区标语',
      component: Slogan,
    },
    {
      key: 3,
      name: '紧急通知',
      component: Urgent,
    },
  ]);
  const tabsOptionsICU = shallowRef([
    {
      key: 1,
      name: '病区标语',
      component: Slogan,
    },
    {
      key: 2,
      name: '紧急通知',
      component: Urgent,
    },
  ]);

  let partitionInfo: any;
  let icuFlag = ref(false);
  const tabs = ref<any>(tabsOptions.value);

  provide('is_icu', icuFlag);

  // 判断当前是否为紧急发布状态
  async function isReleaseStatus() {
    let params = {
      partition_id: partitionId.value,
    };
    let res = await getOneStatus(params);
    isUrgent.value = res?.id ? true : false;
    userStore.setIsUrgentStatus(isUrgent.value);
  }

  watch(
    () => userStore?.getCurrentPartition?.id,
    (newVal) => {
      if (!newVal) return;
      refreshKey.value = new Date().getTime();
      isReleaseStatus();
      // icu病区直接不显示信息发布
      tabActive.value = 1;
      partitionInfo = userStore.getCurrentPartition;
      tabs.value = partitionInfo?.is_icu === 0 ? tabsOptions.value : tabsOptionsICU.value;
      icuFlag.value = partitionInfo?.is_icu === 1;
    },
    {
      deep: true,
      immediate: true,
    },
  );

  onMounted(() => {
    isReleaseStatus();
  });
</script>
<style lang="less">
  .msg-publish-tab {
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
