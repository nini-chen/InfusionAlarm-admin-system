<template>
  <div class="p-4 bg-white h-14 flex items-center justify-between">
    <div>
      <a-input-search
        class="!mr-4 !w-220px"
        v-model:value="filterOptions.keyword"
        placeholder="请输入卡号/姓名"
        allowClear
        :maxlength="20"
        @search="search"
        @input="
          (e) => {
            filterOptions.keyword = oninputDeal(e);
          }
        "
      />

      <!-- button  -->
      <a-button class="mr-4" type="primary" @click="search">查询</a-button>
      <a-button color="" @click="reset">重置</a-button>
    </div>
    <!-- refresh -->
    <div class="min-w-16 hover:text-green-500 cursor-pointer" @click="redo">
      <span class="align-center mr-2"> <Icon icon="iconoir:refresh-double" /></span>
      <span>刷新</span>
    </div>

    <div class="ml-10">
      <a-button type="primary" class="mr-4" @click="serverModal">服务器</a-button>
      <a-button type="primary" :disabled="disabled" class="mr-4" @click="changeStats(2)"
        >批量启用</a-button
      >
      <a-button type="primary" :disabled="disabled" danger class="mr-4" @click="changeStats(1)"
        >批量停用</a-button
      >
      <a-button type="primary" :disabled="disabled" danger class="mr-4" @click="changeStats(0)"
        >批量删除</a-button
      >
      <a-button type="primary" class="mr-4" @click="importModal">批量导入</a-button>
    </div>
    <ImportModal @register="registerModal" @success="importSuccess" />
    <ServerModal @register="registerServerModal" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { oninputDeal } from '/@/utils/formRender';
  import { useModal } from '/@/components/Modal';
  import ImportModal from '../compoments/modals/importModal.vue';
  import ServerModal from '../compoments/modals/serverModal.vue';
  import { getServerConfig } from '/@/api/system/iccard';

  const emit = defineEmits<{
    (e: 'search', options: any): void;
    (e: 'redo', options: any): void;
    (e: 'change', options: any): void;
  }>();

  const disabled = ref(true);

  //选择器
  const filterOptions = ref({
    keyword: '',
  });

  /*查询*/
  function search() {
    emit('search', filterOptions.value);
  }

  /*重置*/
  function reset() {
    filterOptions.value = {
      keyword: '',
    };
    emit('search', filterOptions.value);
  }

  /*重新加载*/
  function redo() {
    emit('redo', filterOptions.value);
  }

  /*状态更改*/
  function changeStats(status) {
    emit('change', status);
  }

  /*模板弹窗*/
  const [registerModal, { openModal: openModal }] = useModal();
  const [registerServerModal, { openModal: openServerModal }] = useModal();
  function importModal() {
    openModal(true);
  }
  async function serverModal() {
    const res = await getServerConfig();
    openServerModal(true, { record: res });
  }

  function importSuccess() {
    emit('redo', filterOptions.value);
  }

  defineExpose({
    disabled,
  });
</script>
