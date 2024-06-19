<template>
  <div class="p-4 bg-white h-14 flex items-center justify-between">
    <!-- tabs -->
    <a-tabs v-model:activeKey="activeKey" class="!leading-10">
      <a-tab-pane tab="排班类型配置" key="1" />
      <a-tab-pane tab="职级权重配置" key="2" v-if="userinfo.roleId == '1'" />
    </a-tabs>
    <!-- button -->
    <a-button type="primary" @click="openModal">
      <div class="flex justify-around items-center">
        <Icon icon="carbon:add" size="20" />
        <span> 添加 </span>
      </div>
    </a-button>
  </div>
</template>
<script lang="ts" setup>
  import { ref, watch, computed } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const userinfo = computed(() => userStore.getUserInfo);

  const activeKey = ref('1');
  const emit = defineEmits<{
    (e: 'tabChange', tab: string): void;
    (e: 'openModal', key: number | string): void;
  }>();

  watch(
    () => activeKey.value,
    (n) => emit('tabChange', n),
    { immediate: true },
  );

  // const tabList = ref([
  //   { key: '1', tab: '排班类型配置' },
  //   { key: '2', tab: '职级权重配置' },
  // ]);

  function openModal() {
    emit('openModal', activeKey.value);
  }
</script>
