<template>
  <div class="head-tab w-full bg-white text-blue-500 h-12 rounded-md flex px-2">
    <div class="pl-60 flex flex-1 justify-center">
      <div class="flex">
        <div
          class="flex items-center cursor-pointer mx-5"
          :class="tabActive === item.key ? 'tab-item-active' : 'tab-item'"
          v-for="item of tabsOptions"
          :key="item.key"
          @click="handleChange(item.key)"
        >
          <img class="h-20px" :src="tabActive === item.key ? item.iconActive : item.icon" />
          <span class="ml-2 text-gray-500 text-base">{{ item.name }}</span>
        </div>
      </div>
    </div>
    <div class="statistics flex">
      <div class="flex flex-col justify-center px-6" v-for="(item, key) in statistics" :key="key">
        <span class="text-center text-sm font-bold">{{ item.count }}</span>
        <span class="text-black">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  // 本组件是病房和病床公用的顶部栏： 切换页面 和状态统计功能
  import { computed } from 'vue';
  import { useGo } from '/@/hooks/web/usePage';
  import { useRouter } from 'vue-router';

  import bed from '/@/assets/images/bed.png';
  import bedActive from '/@/assets/images/bed1.png';
  import ward from '/@/assets/images/ward.png';
  import wardActive from '/@/assets/images/ward1.png';

  import { useUserStore } from '/@/store/modules/user';

  defineProps({
    statistics: Object,
  });

  const go = useGo();
  const { currentRoute } = useRouter();
  const userStore = useUserStore();

  const tabsOptions = computed(() => {
    const isICUPartition = userStore.getCurrentPartition?.is_icu == 1;
    if (isICUPartition) {
      return [
        {
          name: '病床分机',
          icon: bed,
          iconActive: bedActive,
          key: '/patients/room',
        },
        {
          name: '家属分机',
          icon: ward,
          iconActive: wardActive,
          key: '/patients/bed',
        },
      ];
    }
    return [
      {
        name: '病房一览',
        icon: ward,
        iconActive: wardActive,
        key: '/patients/room',
      },
      {
        name: '床位一览',
        icon: bed,
        iconActive: bedActive,
        key: '/patients/bed',
      },
    ];
  });

  const tabActive = computed(() => {
    return currentRoute.value.path || tabsOptions.value[0].key;
  });

  function handleChange(activeKey) {
    go(activeKey);
  }
</script>
<style lang="less" scoped>
  .head-tab {
    position: relative;
    &::after {
      display: inline-block;
      width: 206px;
      height: 58px;
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      background: transparent url(/src/assets/images/patient-nav.png) no-repeat left;
    }
  }

  .tab-item {
    color: rgba(0, 0, 0, 0.65);
  }

  .tab-item-active {
    color: #000;
    position: relative;
    &::after {
      position: absolute;
      bottom: 0;
      left: 7px;
      content: '';
      display: inline-block;
      width: 78px;
      height: 2px;
      background: #387af6;
    }
  }
</style>
