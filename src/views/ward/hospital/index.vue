<template>
  <PageWrapper>
    <!-- 院区信息-->
    <AreaInformation />
    <!-- 智能输液报警器分区列表 -->
    <AreaManagement title="智能输液报警器分区列表" />
    <!-- 无线报警器分区列表 -->
    <!-- <AreaManagement title="无线报警器分区列表" /> -->
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import AreaInformation from './components/AreaInformation.vue';
  import AreaManagement from './components/AreaManagement.vue';
</script>
