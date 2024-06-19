<template>
  <div class="mt-4 bg-light-50">
    <a-table
      id="table"
      sticky
      :row-selection="{ type: 'checkbox', onChange: onSelectChange }"
      :scroll="{ y: 600 }"
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
      :loading="ifredo"
      :row-key="(r) => r.id"
    >
      <template #index="{ index }">
        {{ params.page_size * (params.page_index - 1) + index + 1 }}
      </template>
      <template #status="{ record }">
        <div v-if="record.status === 1" class="text-green-600">启用中</div>
        <div v-if="record.status === 2" class="text-red-600">已停用</div>
        <div v-if="record.status === 0" class="text-red-600">已删除</div>
      </template>
      <template #op="{ record }">
        <n-button quaternary type="success" @click="editcard(record)">编辑</n-button>
        <n-button quaternary v-if="record.status === 1" type="error" @click="unusecard(record)"
          >停用</n-button
        >
        <n-button quaternary v-else type="info" @click="usecard(record)">启用</n-button>
        <n-button quaternary type="error" @click="delcard(record)">删除</n-button>
      </template>
    </a-table>
    <Footer
      @onShowSizeChange="onShowSizeChange"
      @sizeChange="sizeChange"
      :total="total"
      :size="params.page_size"
      :page="params.page_index"
    />
    <DelModal :minHeight="50" @register="registerModal" @success="refresh('del')" />
    <EditModal :width="640" @register="editRegisterModal" @success="refresh('edit')" />
    <BlockModal :minHeight="50" @register="blockRegisterModal" @success="refresh('block')" />
  </div>
</template>
<script setup lang="ts">
  import { NButton } from 'naive-ui';
  import { ref, reactive, watch } from 'vue';
  import { columns } from '../data';
  import { getICCardList, changeICStatus } from '/@/api/system/iccard';
  import { scrollTop } from '/@/utils/event';
  import { useModal } from '/@/components/Modal';
  import DelModal from '../compoments/modals/delModal.vue';
  import EditModal from '../compoments/modals/editModal.vue';
  import BlockModal from '../compoments/modals/blockModal.vue';
  import Footer from '/@/components/PageFooter/index.vue';
  import { message } from 'ant-design-vue';

  const emits = defineEmits<{
    (e: 'disableEmit', len: number): void;
  }>();

  const [registerModal, { openModal: openModal }] = useModal();
  const [editRegisterModal, { openModal: openEditModal }] = useModal();
  const [blockRegisterModal, { openModal: blockEditModal }] = useModal();

  let ifredo = ref(false);

  const params = reactive({
    page_index: 1,
    page_size: 10,
  });

  const dataSource = ref([]);
  const total = ref(0);
  async function getList(gotoOne = false) {
    gotoOne && (params.page_index = 1);
    ifredo.value = true;
    let res = await getICCardList(params);
    ifredo.value = false;
    total.value = res.data_sum;
    dataSource.value = res.data;
    scrollTop();
  }
  getList();

  /*切换page和size*/
  function onShowSizeChange({ current, size }) {
    params.page_index = current;
    params.page_size = size;
    getList();
  }
  function sizeChange({ page, pageSize }) {
    params.page_index = page;
    params.page_size = pageSize;
    getList();
  }

  async function usecard(record: any) {
    let codes: any;
    if (record.mul) codes = selectionArray.value.map((i) => i.code_sign);
    else codes = [record.code_sign];
    const params = {
      code_sign: codes,
      status: 1,
    };
    try {
      await changeICStatus(params);
    } catch (e) {
      return message.error('操作失败');
    }
    message.success('操作成功');
    getList();
  }

  let selectionArray = ref<any[]>([]);

  watch(
    () => selectionArray.value.length,
    (n) => {
      emits('disableEmit', n);
    },
  );

  function onSelectChange(_, selction) {
    selectionArray.value = selction;
  }

  function unusecard(record: any) {
    if (!Array.isArray(record)) record = [record];
    blockEditModal(true, { record: record });
  }

  function delcard(record: any) {
    if (!Array.isArray(record)) record = [record];
    openModal(true, { record: record });
  }

  function editcard(record: any) {
    openEditModal(true, { record: record });
  }

  function refresh(type: string) {
    if (type == 'del') {
      let lastPage = Math.ceil(total.value / params.page_size!);
      // 判断当前页是否是最后一页 且 为最后一条数据
      if (params.page_index === lastPage && total.value % params.page_size! === 1) {
        params.page_index > 1 && params.page_index--;
      }
      selectionArray.value = [];
    }
    getList();
  }

  function duetoCard(record: any) {
    if (record.mul) {
      if (selectionArray.value.length === 0) return message.error('请选择需要处理的项');
      if (record.status === 2) {
        return usecard({ mul: true });
      }
      if (record.status === 1) {
        return unusecard(selectionArray.value);
      }
      if (record.status === 0) {
        return delcard(selectionArray.value);
      }
    }
  }

  defineExpose({
    getList,
    params,
    ifredo,
    duetoCard,
  });
</script>
