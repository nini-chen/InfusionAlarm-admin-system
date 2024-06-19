<template>
  <Select
    v-if="isAdmin"
    v-bind="$attrs"
    class="partition-select"
    show-search
    :filterOption="filterOption"
    :getPopupContainer="getPopupContainer"
    v-model:value="partitionId"
    :options="partitionOptions"
    @change="selectPartition"
    placeholder="请选择病区"
  />
</template>
<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { Select } from 'ant-design-vue';
  import { filterOption, getPopupContainer } from '/@/utils';

  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();

  // 当前选择病区组件：只有管理员身份才展示(管理员可能拥有多个病区，可切换；普通用户仅有一个病区，不需切换)
  const isAdmin = computed(() => userStore.getUserInfo.roleId == '1');

  // 当前用所有的病区数据
  const partitionOptions = computed(() => userStore.getSelectPartitions);

  // 当前用户所处的病区的id
  const partitionId = ref<number | null>(null);

  // 设置当前病区
  function selectPartition(_, option) {
    userStore.setCurrentPartition(option);
  }

  watch(
    () => userStore?.getCurrentPartition,
    (newVal) => {
      if (!newVal) return;
      partitionId.value = newVal.id;
    },
    {
      immediate: true,
    },
  );
</script>
<style lang="less" scoped>
  .partition-select {
    width: 184px;
    :deep(.ant-select-selector) {
      background-color: #f7f8fc;
    }
  }
</style>
