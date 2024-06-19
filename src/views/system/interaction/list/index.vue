<template>
  <div class="mt-4 bg-light-50">
    <a-table
      sticky
      :scroll="{ y: 600 }"
      :dataSource="dataSource"
      :columns="columns"
      :pagination="false"
    >
      <template #index="{ index }">{{
        params.page_size * (params.page_index - 1) + index + 1
      }}</template>
      <template #color="{ record }">
        <div
          :style="{ 'background-color': colorList[record.color - 1] }"
          class="h-7 w-100"
        ></div>
      </template>
      <template #op="{ record }">
        <div>
          <a-button
            type="text"
            class="!pl-2 !pr-2 !text-blue-600"
            @click="editItem(record)"
          >
            编辑
          </a-button>
          <a-button
            type="text"
            class="!pl-2 !pr-2 !text-blue-600"
            v-if="props.tab == '1'"
            @click="toDefault(record)"
          >
            恢复默认
          </a-button>
          <a-button
            type="text"
            danger
            class="!pl-2 !pr-2"
            @click="deleteItem(record)"
            v-if="props.tab != '1'"
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

    <EditItemModal
      :width="640"
      @register="registerModal"
      @success="refreshList('edit')"
    />
    <DelItemModal
      :minHeight="50"
      @register="registerDelModal"
      @success="refreshList('del')"
    />
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue";
// import { BasicTable } from '/@/components/Table';
import { useModal } from "/@/components/Modal";
import EditItemModal from "../components/modals/EditItemModal.vue";
import DelItemModal from "../components/modals/DeleteItemModal.vue";
import { getInconfigList, editConfig } from "/@/api/system/interaction";
import { columns, colorList } from "../data";
import Footer from "/@/components/PageFooter/index.vue";
  import { scrollTop } from '/@/utils/event';

interface Props {
  tab: string;
  refresh: number;
}
const props = withDefaults(defineProps<Props>(), {
  tab: "1",
  refresh: 0,
});

interface Params {
  page_index: number;
  page_size: number;
  type: number | string;
}
let params = ref<Params>({
  page_index: 1,
  page_size: 10,
  type: "1",
});

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

//监听tab & refresh变化，有变化则发送请求
watch(
  () => props.tab,
  (n) => {
    params.value.type = +n;
    params.value.page_index = 1;
    getList(params.value);
  }
);
watch(
  () => props.refresh,
  () => getList(params.value)
);

/*获取列表*/
const total = ref(0);
const dataSource = ref<any[]>();
async function getList(params) {
  let res: any = await getInconfigList(params);
  dataSource.value = res.data;
  total.value = res.data_sum;
}
getList(params.value);

/*刷新列表*/
function refreshList(type) {
  if (type == "del") {
    let lastPage = Math.ceil(total.value / params.value.page_size);
    // 判断当前页是否是最后一页 且 为最后一条数据
    if (
      params.value.page_index === lastPage &&
      total.value % params.value.page_size === 1
    ) {
      params.value.page_index > 1 && params.value.page_index--;
    }
  }
  getList(params.value);
}

const [registerModal, { openModal: openRegisterModal }] = useModal();
function editItem(record) {
  openRegisterModal(true, {
    tab: +props.tab,
    id: record.id,
    name: record.name,
    color: record.color,
    comment: record.comment,
  });
}
const [registerDelModal, { openModal: openRegisterDelModal }] = useModal();
function deleteItem(record) {
  openRegisterDelModal(true, {
    tab: +props.tab,
    id: record.id,
  });
}

/*护理级别配置恢复默认*/
async function toDefault(record) {
  if (record.name == "特级护理") {
    record.color = 1;
    record.comment = "特级护理";
  }
  if (record.name == "一级护理") {
    record.color = 16;
    record.comment = "一级护理";
  }
  if (record.name == "二级护理") {
    record.color = 24;
    record.comment = "二级护理";
  }
  if (record.name == "三级护理") {
    record.color = 36;
    record.comment = "三级护理";
  }

  await editConfig(record);
}
</script>
