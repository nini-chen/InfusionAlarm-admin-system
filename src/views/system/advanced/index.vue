<template>
  <PageWrapper>
    <!-- 选择病区 -->
    <div class="flex justify-center items-center" v-append-to-dom="`SEARCH_AREA`">
      <PartitionSelect />
    </div>
    <ToolBar @tab-change="tabChange" @openModal="openModal" />
    <List :refresh="refreshFlag" v-if="tabValue == '1'" />
    <PList v-if="tabValue == '2'" />

    <EditItemModal :width="640" @register="registerModal" @success="addSuccess" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import ToolBar from './toolBar/index.vue';
  import List from './list/list.vue';
  import PList from './list/privacy.vue';
  import EditItemModal from './components/modals/EditItemModal.vue';
  import { useModal } from '/@/components/Modal';
  import PartitionSelect from '/@/views/sys/partition/index.vue';
  import { PageWrapper } from "/@/components/Page";

  /*tab切换*/
  let tabValue = ref('');
  function tabChange(tab: string) {
    tabValue.value = tab;
  }

  /*vben新增弹框 方法调用*/
  const [registerModal, { openModal: openRegisterScTypeModal }] = useModal();
  function openModal(key) {
    tabValue.value == '1' && openRegisterScTypeModal(true, { titleIndex: key });
  }

  /*自定义事件*/
  const refreshFlag = ref(0);
  function addSuccess() {
    refreshFlag.value = Math.random();
  }
</script>
