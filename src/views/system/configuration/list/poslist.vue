<template>
  <div class="mt-4 bg-light-50">
    <div class="p-4">
      <ExclamationCircleOutlined />
      <span class="ml-3">
        职级权重将影响医护人员在终端屏上的展示顺序；同类型中，数字越大权重越高
      </span>
      <a-table
        sticky
        :dataSource="dataSource"
        :columns="PositionColumns"
        :pagination="false"
        :scroll="{ y: 560 }"
      >
        <template #index="{ index }">
          {{ params.page_size * (params.page_index - 1) + index + 1 }}
        </template>
        <template #remarks="{ record }">
          {{ record.position_remarks || '无' }}
        </template>
        <template #postype="{ record }">
          <div>{{ record.position_type == 1 ? '医疗人员职级' : '护理人员职级' }}</div>
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
    </div>

    <Footer
      @onShowSizeChange="onShowSizeChange"
      @sizeChange="sizeChange"
      :total="total"
      :size="params.page_size"
      :page="params.page_index"
    />

    <EditScTypeModal :width="640" @register="registerModal" @success="editSuccess" />
    <DeleteScTypeModal :minHeight="50" @register="registerDeleteModal" @success="delSuccess" />
  </div>
</template>
<script setup lang="ts">
  import { ref, watch } from 'vue';
  // import { BasicTable } from '/@/components/Table';
  import { getPositionList } from '/@/api/system/inconfig';
  import { PositionColumns } from '../data';
  import { useModal } from '/@/components/Modal';
  import EditScTypeModal from '../components/modals/EditPositionModal.vue';
  import DeleteScTypeModal from '../components/modals/DeletePositionModal.vue';
  import Footer from '/@/components/PageFooter/index.vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { scrollTop } from '/@/utils/event';

  /*modal*/
  const [registerModal, { openModal: openRegisterModal }] = useModal();
  const [registerDeleteModal, { openModal: openDeleteModal }] = useModal();
  function editItem(record) {
    openRegisterModal(true, { record });
  }
  function deleteItem(record) {
    openDeleteModal(true, { record });
  }
  function editSuccess() {
    getList(params.value);
  }
  function delSuccess() {
    let lastPage = Math.ceil(total.value / params.value.page_size!);
    // 判断当前页是否是最后一页 且 为最后一条数据
    if (params.value.page_index === lastPage && total.value % params.value.page_size! === 1) {
      params.value.page_index > 1 && params.value.page_index--;
    }
    getList(params.value);
  }

  /*props*/
  interface Props {
    tab: string | number /*tab切换*/;
    refresh: number /*list刷新*/;
  }
  const props = withDefaults(defineProps<Props>(), {
    tab: '',
    refresh: 0,
  });

  interface Params {
    page_index: number;
    page_size: number;
  }
  const params = ref<Params>({
    page_index: 1,
    page_size: 10,
  });

  /*切换page和size*/
  function onShowSizeChange({ current, size }) {
    params.value.page_index = current;
    params.value.page_size = size;
    getList(params.value);
    scrollTop();
  }
  function sizeChange({ page, pageSize }) {
    params.value.page_index = page;
    params.value.page_size = pageSize;
    getList(params.value);
    scrollTop();
  }

  /*列表请求*/
  let dataSource = ref<any[]>();
  let total = ref(0);
  async function getList(params) {
    let res = await getPositionList(params);
    dataSource.value = res.data;
    total.value = res.data_sum;
  }

  /*监听tab和refresh的变化*/
  watch(
    () => props.refresh,
    () => getList(params.value),
    { immediate: true },
  );
</script>
