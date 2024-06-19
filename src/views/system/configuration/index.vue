<template>
  <PageWrapper>
    <!-- 选择病区 -->
    <div class="flex justify-center items-center" v-append-to-dom="`SEARCH_AREA`">
      <PartitionSelect v-show="tabValue == '1'" />
    </div>
    <ToolBar @tab-change="tabChange" @openModal="openModal" />
    <ScList v-if="tabValue == '1'" :refresh="refresh" :bedRoomTree="options" />
    <PosList v-if="tabValue == '2'" :refresh="refreshP" />

    <AddScTypeModal :width="640" @register="registerModal" @success="addSuccess" />
    <AddPositionModal :width="640" @register="registerPostionModal" @success="addSuccess" />
  </PageWrapper>
</template>

<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import ToolBar from './toolBar/index.vue';
  import ScList from './list/sclist.vue';
  import PosList from './list/poslist.vue';
  import { useModal } from '/@/components/Modal';
  import AddScTypeModal from './components/modals/AddScTypeModal.vue';
  import AddPositionModal from './components/modals/AddPositionModal.vue';
  import PartitionSelect from '/@/views/sys/partition/index.vue';
  import { getHRoomBedTree } from '/@/api/system/inconfig';
  import { useUserStore } from '/@/store/modules/user';
  import { PageWrapper } from '/@/components/Page';

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  /*tab切换*/
  let tabValue = ref('');
  function tabChange(tab: string) {
    tabValue.value = tab;
  }

  /*vben新增弹框 方法调用*/
  const [registerModal, { openModal: openRegisterScTypeModal }] = useModal();
  const [registerPostionModal, { openModal: openRegisterPositionModal }] = useModal();
  function openModal(key) {
    tabValue.value == '1' && openRegisterScTypeModal(true, { titleIndex: key });
    tabValue.value == '2' && openRegisterPositionModal(true, { titleIndex: key });
  }

  /*新增弹框提交成功时，更新列表*/
  let refresh = ref(0);
  let refreshP = ref(0);
  function addSuccess() {
    tabValue.value == '1' && (refresh.value = Math.random());
    tabValue.value == '2' && (refreshP.value = Math.random());
  }

  /*获取分区下的病房和病床*/
  const options = ref<any[]>();
  async function getHRoomBedTreeAPI(id) {
    let params = { partition_id: id };
    let res = await getHRoomBedTree(params);
    options.value = res;
  }

  /*监听分区id变化*/
  watch(
    () => currentPartition.value,
    (n) => {
      if (!n) return;
      getHRoomBedTreeAPI(n.id);
    },
    { immediate: true, deep: true },
  );
</script>
