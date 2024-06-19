<template>
  <!-- ICU病区的病房管理 -->
  <ICUWard v-if="isICU" />
  <!-- 普通病区的病房管理 -->
  <GeneralWard v-else />
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import ICUWard from './ICUWard/index.vue';
  import GeneralWard from './GeneralWard/index.vue';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  const isICU = computed(() => userStore.getCurrentPartition?.is_icu == 1);
</script>
