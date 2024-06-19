<template>
  <div class="p-4 h-full flex flex-col">
    <!-- 家属分机（ICU病区） -->
    <FamilyExtension v-if="isICUPartition" />
    <!-- 床位一览（普通病区） -->
    <BedList v-else />
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';

  import { useUserStore } from '/@/store/modules/user';

  import BedList from '/@/views/patients/bed/bedList/index.vue';
  import FamilyExtension from '/@/views/patients/bed/familyExtension/index.vue';

  const userStore = useUserStore();
  const isICUPartition = computed(() => userStore.getCurrentPartition?.is_icu == 1);
</script>
