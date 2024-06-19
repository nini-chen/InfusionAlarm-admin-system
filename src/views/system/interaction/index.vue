<template>
  <PageWrapper>
    <ToolBar @tab-change="tabChange" @open="openModal" />
    <List :tab="tabValue" :refresh="refreshFlag" />

    <AddItemModal :width="640" @register="registerModal" @success="refresh" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import ToolBar from './toolBar/index.vue';
  import List from './list/index.vue';
  import { useModal } from '/@/components/Modal';
  import AddItemModal from './components/modals/AddItemModal.vue';
    import { PageWrapper } from "/@/components/Page";

  let tabValue = ref('1');
  function tabChange(tab: string) {
    tabValue.value = tab;
  }

  /*刷新list*/
  let refreshFlag = ref(0);
  function refresh() {
    refreshFlag.value = Math.random();
  }

  /*openModal*/
  const [registerModal, { openModal: openRegisterModal }] = useModal();
  function openModal() {
    openRegisterModal(true, { titleIndex: tabValue.value });
  }
</script>
