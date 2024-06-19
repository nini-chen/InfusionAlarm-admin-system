<template>
  <div class="mt-4 bg-light-50">
    <a-table
      sticky
      :dataSource="dataSource"
      :columns="ScTypeColumns"
      :pagination="false"
      :scroll="{ y: 600 }"
    >
      <template #index="{ index }">{{
        params.page_size! * (params.page_index! - 1) + index + 1
      }}</template>
      <template #bed="{ record }">
        <div>{{ record.schedulingtype_is_managebed == 1 ? '是' : '否' }}</div>
      </template>
      <template #position="{ record }">
        <div>{{ record.schedulingtype_population == 1 ? '医疗人员' : '护理人员' }}</div>
      </template>
      <template #prebed="{ record }">
        <div>{{ getBed(record.schedulingtype_managebed_range) || '无' }}</div>
      </template>
      <template #op="{ record }">
        <div>
          <a-button type="text" class="!pl-2 !pr-2 !text-blue-600" @click="editItem(record)"
            >编辑</a-button
          >
          <a-button type="text" danger class="!pl-2 !pr-2" @click="deleteItem(record)"
            >删除</a-button
          >
        </div>
      </template>
    </a-table>
    <Footer
      @onShowSizeChange="onShowSizeChange"
      @sizeChange="sizeChange"
      :total="total"
      :size="params.page_size"
      :page="params.page_index"
    />

    <EditScTypeModal :width="640" @register="registerModal" @success="editSuccess" />
    <DeleteScTypeModal
      :minHeight="50"
      @register="registerDeleteModal"
      @success="delSuccess"
    />
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, computed } from 'vue';
  // import { BasicTable } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import EditScTypeModal from '../components/modals/EditScTypeModal.vue';
  import DeleteScTypeModal from '../components/modals/DeleteScTypeModal.vue';
  import { getSchedulingTypeList } from '/@/api/system/inconfig';
  import { ScTypeColumns } from '../data';
  import { useUserStore } from '/@/store/modules/user';
  import Footer from '/@/components/PageFooter/index.vue';
   import { scrollTop } from '/@/utils/event';

  const userStore = useUserStore();
  const currentPartition = computed(() => userStore.getCurrentPartition);

  /*弹框相关*/
  const [registerModal, { openModal: openRegisterModal }] = useModal();
  const [registerDeleteModal, { openModal: openDeleteModal }] = useModal();
  function editItem(record) {
    openRegisterModal(true, { record });
  }
  function deleteItem(record) {
    openDeleteModal(true, { record });
  }

  /*props*/
  interface Props {
    refresh: number /*list刷新*/;
    bedRoomTree: any[];
  }
  const props = withDefaults(defineProps<Props>(), {
    tab: '1',
    refresh: 0,
    bedRoomTree: () => [],
  });

  /*list请求参数*/
  interface Params {
    partition_id: number | string;
    schedulingtype_population?: string | number;
    page_index?: number;
    page_size?: number;
  }
  let params = ref<Params>({
    partition_id: currentPartition.value.id,
    page_index: 1,
    page_size: 10,
  });

  /*监听refresh变化，变化则重新请求list*/
  watch(
    () => props.refresh,
    () => getList(params.value),
  );
  /*监听partition_id，变化则更新列表*/
  watch(
    () => currentPartition.value,
    (n) => {
      if(!n) return
      params.value.partition_id = n.id;
      getList(params.value);
    },
    {deep:true}
  );

  /*切换page和size*/
  function onShowSizeChange({ current, size }) {
    params.value.page_index = current;
    params.value.page_size = size;
    getList(params.value);
    scrollTop()
  }
  function sizeChange({ page, pageSize }) {
    params.value.page_index = page;
    params.value.page_size = pageSize;
    getList(params.value);
    scrollTop()
  }

  const dataSource = ref<any[]>();
  const total = ref(0);
  async function getList(params) {
    let res: any = await getSchedulingTypeList(params);
    // console.log(res);
    dataSource.value = res.data;
    total.value = res.data_sum;
  }
  getList(params.value);

  /*edit*/
  function editSuccess() {
    getList(params.value);
  }
  /*del*/
  function delSuccess() {
    let lastPage = Math.ceil(total.value / params.value.page_size!);
    // 判断当前页是否是最后一页 且 为最后一条数据
    if (params.value.page_index === lastPage && total.value % params.value.page_size! === 1) {
      params.value.page_index > 1 && params.value.page_index--;
    }
    getList(params.value);
  }

  /*数据转化函数 sctype*/
  function getBed(str) {
    let result: string[] = [];
    let idArray = str.split(',');
    for (let room of props.bedRoomTree) {
      if (!room.children) continue;
      for (let child of room.children) {
        if (idArray.includes(child.id.toString())) {
          result.push(room.name + '/' + child.name);
        }
      }
    }
    return result.join(',');
  }
</script>
