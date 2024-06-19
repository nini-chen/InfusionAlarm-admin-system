<template>
  <div>
    <div id="dplayer"> </div>
  </div>
</template>

<script setup lang="ts">
  import DPlayer from 'dplayer';
  import { onMounted } from 'vue';
  const protocol = location.protocol;
  const host = import.meta.env.DEV ? import.meta.env.VITE_GLOB_HOSTNAME : location.hostname;

  const props = defineProps<{
    url: string;
  }>();

  function init() {
    const url = protocol + '//' + host + props.url;
    new DPlayer({
      container: document.getElementById('dplayer'),
      video: {
        url: url,
      },
      autoplay: true,
      config: {
        setting: false,
      },
    });
  }

  onMounted(() => {
    init();
  });
</script>
<style>
  .dplayer-setting {
    display: none !important;
  }
</style>
