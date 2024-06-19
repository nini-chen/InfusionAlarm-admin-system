<template>
  <div class="mt-4 bg-light-50">
    <a-table
      sticky
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
      <template #datetime="{ record }">
        <span @click="openModal(record)" class="text-[#4879FB]">{{ record.datetime }}</span>
      </template>
      <template #state="{ record }">
        <span v-if="record.state === 1" class="text-[#2DA641]">已通过</span>
        <span v-if="record.state === 2" class="text-[#000000]">已逾期</span>
        <span v-if="record.state === 3" class="text-[#FF4D4F]">未通过</span>
        <span v-if="record.state === 0" class="text-[#4879FB]">待审批</span>
      </template>
    </a-table>
    <Footer
      @onShowSizeChange="onShowSizeChange"
      @sizeChange="sizeChange"
      :total="total"
      :size="params.page_size"
      :page="params.page_index"
    />
    <n-modal
      v-model:show="showModal"
      preset="card"
      title="信息详情弹窗"
      style="width: 750px"
      header-style="background-color: #DAE6F5"
    >
      <div class="w-full h-full relative">
        <div class="text-xl leading-10 font-bold">患者信息</div>
        <div class="flex">
          <div class="text-16px leading-10">病区名称：{{ itemData.partition_name }}</div>
          <div class="text-16px leading-10 ml-90px">患者姓名：{{ itemData.patient_name }}</div>
        </div>

        <div class="border-t border-dashed border-gray-400 my-4"></div>
        <div class="text-xl leading-10 font-bold">家属信息</div>
        <div class="flex text-16px justify-between leading-10">
          <div>家属姓名：{{ itemData.name }}</div>
          <div>家属电话：{{ itemData.phone }}</div>
          <div>与患者关系：{{ itemData.relation }}</div>
        </div>
        <div class="flex text-16px justify-between leading-10">
          <div>预约时间：{{ itemData.datetime }}</div>
        </div>
        <div class="flex text-16px justify-between leading-10">
          <div>申请时间：{{ itemData.create_time }}</div>
        </div>
        <div class="text-16px leading-10">备注：{{ itemData.note ? itemData.note : '无' }}</div>

        <!-- <div class="flex h-80px leading-80px absolute top-0px left-0 right-0 z-index-9999 bg-white">
          <div class="flex-1 text-center bg-skyblue">
            <span class="text-[#387AF6]">{{ recordInfo.icu_family_numname }}</span>
            探视家属分机</div
          >
          <div class="flex-1 text-center bg-skyblue">
            <span class="text-[#387AF6]">{{ recordInfo.icu_sickbed_bed_name }}</span>
            探视病床分机</div
          >
        </div>
        <Dplayer :url="record_path" />
        <div
          v-if="0"
          class="flex h-30px leading-30px absolute bottom--80px left-0 right-0 z-index--1 bg-[#eee]"
        >
        </div> -->
      </div>
    </n-modal>
  </div>
</template>
<script setup lang="ts">
  import { NModal } from 'naive-ui';
  import { ref, reactive } from 'vue';
  // import Dplayer from '../components/dplayer.vue';
  import { approvalColumns as columns } from '../data';
  import { getVisitApprovalList } from '/@/api/record/visit';
  import { scrollTop } from '/@/utils/event';
  import { useMessage } from '/@/hooks/web/useMessage';
  const { createMessage } = useMessage();

  import Footer from '/@/components/PageFooter/index.vue';

  let ifredo = ref(false);

  const params = reactive({
    page_index: 1,
    page_size: 10,
    start_time: '',
    end_time: '',
    state: '',
  });

  const dataSource = ref([]);
  const total = ref(0);
  const itemData = ref(null);

  async function getList(gotoOne = false) {
    gotoOne && (params.page_index = 1);
    ifredo.value = true;
    const filteredParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== ''),
    );
    let res = await getVisitApprovalList(filteredParams);
    // 当有云探视配置时
    if (res.result === 200) {
      ifredo.value = false;
      total.value = res.data.data_sum;
      dataSource.value = res.data.data;
      // 当不是云探视配置的报错时
    } else if (res.result !== 200 && res.return_message != '项目配置的域名有误，请重新配置') {
      createMessage.error(res.return_message);
    } else {
      ifredo.value = false;
    }
  }
  getList();

  /*切换page和size*/
  function onShowSizeChange({ current, size }) {
    params.page_index = current;
    params.page_size = size;
    getList();
    scrollTop();
  }
  function sizeChange({ page, pageSize }) {
    params.page_index = page;
    params.page_size = pageSize;
    getList();
    scrollTop();
  }

  // 查看探视回放
  const showModal = ref(false);
  function openModal(record: any) {
    showModal.value = true;
    itemData.value = record;
  }

  defineExpose({
    getList,
    params,
    ifredo,
  });
</script>
