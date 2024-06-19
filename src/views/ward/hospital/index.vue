<template>
  <PageWrapper>
    <!-- 院区信息-->
    <AreaInformation />
    <!-- 院区管理 -->
    <AreaManagement />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import AreaInformation from './components/AreaInformation.vue';
  import AreaManagement from './components/AreaManagement.vue';
</script>
