<template>
  <PageWrapper>
    <ToolBar
      @openUploadModal="openUploadModal"
      @openHostModal="openHostModal"
      @search="keywordsSearch"
      :refresh="toolRefresh"
    />
    <List :refresh="refresh" :searchValue="keywords" />

    <!-- <AddItemModal :width="640" @register="registerModal" @success="addSuccess" />
    <MessageModal :minHeight="50" @register="registerMessageModal" @success="changeStatusSuccess" /> -->
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import ToolBar from './toolBar/index.vue';
  import List from './list/index.vue';
  // import { useModal } from '/@/components/Modal';
  // import AddItemModal from './components/modals/AddItemModal.vue';
  // import MessageModal from './components/modals/MessageModal.vue';
  import { PageWrapper } from '/@/components/Page';

  // /*vben新增弹框 方法调用*/
  // const [registerModal, { openModal: openAddItemModal }] = useModal();
  // const [registerMessageModal, { openModal: openMeesageModal }] = useModal();
  // function openUploadModal() {
  //   openAddItemModal(true);
  // }
  // function openHostModal(value) {
  //   openMeesageModal(true, { status: value });
  // }

  /*弹框操作成功 */
  const refresh = ref(0);
  const toolRefresh = ref(0);
  // function addSuccess() {
  //   refresh.value = Math.random();
  // }
  // function changeStatusSuccess() {
  //   toolRefresh.value = Math.random();
  // }

  /*关键字搜索*/
  const keywords = ref({});
  function keywordsSearch(payload) {
    keywords.value = payload;
  }
</script>

<style></style>
