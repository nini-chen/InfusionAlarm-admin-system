<template>
  <div class="mt-4 bg-light-50">
    <a-table
      sticky
      :dataSource="dataSource"
      :columns="versionColumns"
      :pagination="false"
      :scroll="{ y: 600 }"
      :row-key="(record) => record.id"
    >
      <template #index="{ index }">{{
        params.page_size * (params.page_index - 1) + index + 1
      }}</template>
      <template #type="{ record }">
        <div>{{ deviceTypeMap[record.device_type] || '其他设备' }}</div>
      </template>
      <template #time="{ record }">
        <div>{{ format(record.create_time) }}</div>
      </template>
      <template #status="{ record }">
        <div :class="upgrade(record).value">{{ upgrade(record).label }}</div>
      </template>
      <template #op="{ record }">
        <a-button
          type="text"
          success
          class="!pl-2 !pr-2 !text-blue-600"
          v-if="showBtn(record).includes('update')"
          @click="update(record)"
        >
          <span>升级</span>
        </a-button>
        <a-button
          type="text"
          class="!pl-2 !pr-2 !text-blue-600"
          v-if="showBtn(record).includes('edit')"
          @click="edit(record)"
        >
          <span>编辑</span>
        </a-button>
        <a-button
          type="text"
          class="!pl-2 !pr-2 !text-blue-600"
          v-if="showBtn(record)!.includes('detail')"
          @click="detail(record)"
        >
          <span>查看详情</span>
        </a-button>
        <a-button
          type="text"
          danger
          class="!pl-2 !pr-2"
          v-if="showBtn(record)!.includes('delete')"
          @click="del(record)"
        >
          <span>删除</span>
        </a-button>
      </template>
    </a-table>

    <Footer
      @onShowSizeChange="onShowSizeChange"
      @sizeChange="sizeChange"
      :total="total"
      :size="params.page_size"
      :page="params.page_index"
    />

    <DetailModal :width="840" @register="registerModal" />
    <UpdatelModal :minHeight="50" @register="registerUpdateModal" @success="refresh('update')" />
    <EditModal :width="640" @register="registerEditModal" @success="refresh" />
    <DelModal :minHeight="50" @register="registerDelModal" @success="refresh('del')" />
  </div>
</template>
<script setup lang="ts">
  import { ref, watch, onBeforeUnmount } from 'vue';
  // import { BasicTable } from '/@/components/Table';
  import { getVersionList } from '/@/api/system/version';
  import { versionColumns, deviceTypeMap } from '../data';
  import DetailModal from '../components/modals/DetailModal.vue';
  import UpdatelModal from '../components/modals/UpdateModal.vue';
  import EditModal from '../components/modals/EditModal.vue';
  import DelModal from '../components/modals/DeleteModal.vue';
  import { useModal } from '/@/components/Modal';
  // import { message } from 'ant-design-vue';
  import Footer from '/@/components/PageFooter/index.vue';
  import { scrollTop } from '/@/utils/event';

  /*props*/
  interface Props {
    refresh: number;
    searchValue: any;
  }
  const props = withDefaults(defineProps<Props>(), {
    refresh: 0,
    searchValue: {
      keywords: '',
      type: '',
    },
  });

  interface Params {
    page_index: number;
    page_size: number;
    keyword: string;
    device_type: string;
  }
  const params = ref<Params>({
    page_index: 1,
    page_size: 10,
    keyword: '',
    device_type: '',
  });

  watch(
    () => props.refresh,
    () => {
      getVersionListApi(params.value);
    },
  );
  watch(
    () => props.searchValue,
    (n) => {
      params.value.page_index = 1;
      params.value.keyword = n.keywords;
      params.value.device_type = n.type;
      getVersionListApi(params.value, true);
    },
  );

  /*页面刷新*/
  function refresh(type) {
    if (type == 'del') {
      let lastPage = Math.ceil(total.value / params.value.page_size!);
      // 判断当前页是否是最后一页 且 为最后一条数据
      if (params.value.page_index === lastPage && total.value % params.value.page_size! === 1) {
        params.value.page_index > 1 && params.value.page_index--;
      }
    }
    if (type == 'update') {
      setTimeout(() => detail(currentRecord.value), 1000);
    }
    getVersionListApi(params.value);
  }

  /*切换page和size*/
  function onShowSizeChange({ current, size }) {
    params.value.page_index = current;
    params.value.page_size = size;
    getVersionListApi(params.value);
    scrollTop();
  }
  function sizeChange({ page, pageSize }) {
    params.value.page_index = page;
    params.value.page_size = pageSize;
    getVersionListApi(params.value);
    scrollTop();
  }

  /*获取版本列表*/
  let timer: any = null;
  const dataSource = ref<any[]>([]);
  const total = ref(0);
  async function getVersionListApi(params, ifTip = false) {
    let res = await getVersionList(params);
    dataSource.value = res.data;
    total.value = res.data_sum;
    // if (ifTip && total.value == 0) message.info('数据为空，请重新输入');
  }
  getVersionListApi(params.value);
  timer = setInterval(() => getVersionListApi(params.value), 10000);
  onBeforeUnmount(() => {
    clearInterval(timer);
  });

  /*升级相关情况*/
  function upgrade(record) {
    if (record.upgrade_status == 1) {
      return { value: 'ready', label: '待升级' };
    } else if (record.upgrade_status == 2) {
      return { value: 'upload', label: `${record.success_count} / ${record.total_count}` };
    } else if (record.upgrade_status == 3) {
      return { value: 'finish', label: `${record.success_count} / ${record.total_count}` };
    } else {
      //4
      return { value: 'fail', label: `${record.success_count} / ${record.total_count}` };
    }
  }

  /*btn*/
  function showBtn(record: any): string[] {
    let { value } = upgrade(record)!;
    if (value == 'ready') return ['detail', 'delete'];
    else if (value == 'upload') return ['detail'];
    else if (value == 'finish') return ['detail', 'delete'];
    else return ['detail', 'delete'];
    // return ['update', 'edit', 'delete', 'detail'];
  }

  /*modal弹框*/
  const [registerModal, { openModal: detailRegisterModal }] = useModal();
  const [registerUpdateModal, { openModal: updateRegisterModal }] = useModal();
  const [registerEditModal, { openModal: editRegisterModal }] = useModal();
  const [registerDelModal, { openModal: delRegisterModal }] = useModal();

  /*保存一下当前行的数据*/
  const currentRecord = ref({});

  /*edit*/
  function edit(record) {
    editRegisterModal(true, { record });
  }
  /*detail*/
  function detail(record) {
    detailRegisterModal(true, { record });
  }
  /*update*/
  function update(record) {
    currentRecord.value = record;
    updateRegisterModal(true, { record });
  }
  /*delete*/
  function del(record) {
    delRegisterModal(true, { record });
  }

  /*时间戳转时间*/
  function format(timeStamp) {
    function add0(m) {
      return m < 10 ? '0' + m : m;
    }
    //shijianchuo是整数，否则要parseInt转换
    var time = new Date(timeStamp * 1000);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s);
  }
</script>

<style scoped>
  .finish {
    color: #59a059;
  }
  .upload {
    color: #5353d3;
  }
  .ready {
    color: #000000;
  }
  .fail {
    color: #ff4d4f;
  }
</style>
