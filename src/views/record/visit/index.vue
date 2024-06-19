<template>
  <PageWrapper>
    <!-- 选择病区 -->
    <div class="flex justify-center items-center" v-append-to-dom="`SEARCH_AREA`">
      <PartitionSelect v-if="key == '2'" />
    </div>
    <ToolBar
      @approvalParamsChange="approvalParamsChange"
      @videotapeParamsChange="videotapeParamsChange"
      @search="search"
      @redo="redo"
      @keyChange="keyChange"
    />
    <List ref="approvalRef" v-if="key == '1'" />
    <Videotape ref="videotapeRef" v-else />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import ToolBar from './toolBar/index.vue';
  import List from './list/index.vue';
  import PartitionSelect from '/@/views/sys/partition/index.vue';
  import { PageWrapper } from '/@/components/Page';
  import Videotape from './list/videotape.vue';

  const key = ref('1');
  const approvalRef = ref<any>(null);
  const videotapeRef = ref<any>(null);

  function keyChange(payload) {
    key.value = payload;
  }

  function search(opt) {
    console.log(opt, 'opt------');
    if (key.value == '1') {
      approvalParamsChange(opt);
      delete opt.keyword;
      approvalRef.value.getList(true);
    } else {
      videotapeParamsChange(opt);
      delete opt.state;
      videotapeRef.value.getList(true);
    }
  }

  function approvalParamsChange(opt) {
    approvalRef.value.params.state = opt.state;
    approvalRef.value.params.start_time = opt.dateValue[0];
    approvalRef.value.params.end_time = opt.dateValue[1];
  }
  function videotapeParamsChange(opt) {
    videotapeRef.value.params.keyword = opt.keyword;
    videotapeRef.value.params.start_time = opt.dateValue[0];
    videotapeRef.value.params.end_time = opt.dateValue[1];
  }
</script>
