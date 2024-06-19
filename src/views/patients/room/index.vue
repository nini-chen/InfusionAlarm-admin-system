<template>
  <div class="p-4 h-full flex flex-col">
    <!-- 病床分机（ICU病区） -->
    <BedExtension v-if="isICUPartition" />
    <!-- 病房一览（普通病区） -->
    <RoomList v-else />
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';

  import { useUserStore } from '/@/store/modules/user';

  import BedExtension from '/@/views/patients/room/bedExtension/index.vue';
  import RoomList from '/@/views/patients/room/roomList/index.vue';

  const userStore = useUserStore();

  const isICUPartition = computed(() => userStore.getCurrentPartition?.is_icu == 1);
</script>
