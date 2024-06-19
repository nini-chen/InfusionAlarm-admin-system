<template>
  <PageWrapper class="personnel-page">
    <div class="bg-white rounded flex justify-between items-center mb-4 pr-2 pl-1">
      <BasicForm
        class="w-full min-h-46px !m-0 !pt-8px flex-1 items-center personnel-search-form"
        @register="registerSearchForm"
        @submit="handleSearch"
        @reset="handleReset"
      >
        <template #keywordSlot="{ model, field }">
          <InputSearch
            v-model:value.trim="model[field]"
            allowClear
            maxLength="20"
            placeholder="请输入工号/姓名"
            @search="searchKeyword"
            @input="
              (e) => {
                model[field] = oninputDeal(e);
              }
            "
          />
        </template>
      </BasicForm>
      <div class="min-w-320px">
        <a-button type="text" size="small" @click="reload">
          <SyncOutlined />
          刷新
        </a-button>
        <a-button class="mx-2" type="text" size="small" @click="handleCreate">
          <PlusOutlined />
          添加
        </a-button>
        <a-button type="primary" size="small" @click="handleBatchImport"> 批量导入 </a-button>
        <a-button
          class="ml-2"
          type="primary"
          danger
          size="small"
          :disabled="batchBtnDisabled"
          @click="handleBatchDelete"
        >
          批量删除
        </a-button>
      </div>
    </div>
    <BasicTable ref="personnelTableRef" @register="registerTable" :searchInfo="searchInfo">
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '详情',
              onClick: handleDetail.bind(null, record),
            },
            {
              label: '编辑',
              onClick: handleEdit.bind(null, record),
            },
            {
              label: '删除',
              color: 'error',
              onClick: showDeleteModal.bind(null, record),
            },
          ]"
        />
      </template>
    </BasicTable>
    <BatchImportModal
      :width="650"
      :canFullscreen="false"
      @register="registerBatchImportModal"
      @success="reload"
    />
    <DealModal
      :width="608"
      :canFullscreen="false"
      @register="registerDealModal"
      @success="reload"
    />
    <DetailModal :width="608" :canFullscreen="false" @register="registerDetailModal" />
    <Modal
      v-model:visible="deleteVisible"
      width="446"
      :title="deleteVisible && isBatchOperate ? '批量删除医护人员' : '删除医护人员'"
      @ok="confirmDelete"
      okText="确认"
      @cancel="isBatchOperate = false"
    >
      <div class="px-24px py-30px">
        <div class="flex justify-center items-center">
          <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
          <span class="flex-1 rounded-sm ml-2 p-8px text-base leading-initial">
            确认删除医护人员信息吗？
          </span>
        </div>
      </div>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, reactive, watch, nextTick, computed } from 'vue';
  import { InputSearch, Modal } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { PageWrapper } from '/@/components/Page';
  import { SyncOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';

  import BatchImportModal from './components/BatchImportModal.vue';
  import DealModal from './components/DealModal.vue';
  import DetailModal from './components/DetailModal.vue';

  import { columns, getFormConfig } from './components/config.data';
  import { getPersonListApi, deletePersonApi } from '/@/api/doctors/personnel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { useUserStore } from '/@/store/modules/user';
  import { oninputDeal } from '/@/utils/formRender';

  const { createMessage } = useMessage();
  const userStore = useUserStore();

  // 单个操作-当前操作的账号
  const currentAccount = ref<Recordable>({});
  // 删除、批量删除提示框
  const deleteVisible = ref<boolean>(false);
  // 批量操作-判断
  const isBatchOperate = ref<boolean>(false);
  // 批量操作-勾选的id
  const checkedKeys = ref<Array<string | number>>([]);

  const [registerSearchForm, {}] = useForm(getFormConfig());
  const [registerTable, { reload, clearSelectedRowKeys, setProps, scrollTo }] = useTable({
    fetchSetting: {
      pageField: 'page_index',
      sizeField: 'page_size',
      listField: 'data',
      totalField: 'data_sum',
    },
    api: getPersonListApi,
    beforeFetch(info) {
      return { ...info, ...searchInfo };
    },
    afterFetch(result) {
      const isSearchOperate = Object.values(searchInfo).find((x) => x);
      if (result?.length === 0 && isSearchOperate) {
        setProps({
          locale: {
            emptyText: '数据为空，请重新输入',
          },
        });
      }
    },
    columns,
    rowKey: 'id',
    showTableSetting: false,
    bordered: true,
    showIndexColumn: true,
    canResize: true,
    clickToRowSelect: false,
    striped: false,
    rowSelection: {
      type: 'checkbox',
      selectedRowKeys: checkedKeys,
      onChange: onSelectChange,
    },
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      slots: { customRender: 'action' },
      fixed: 'right',
    },
    onChange() {
      scrollTo('top');
    },
  });

  const [registerBatchImportModal, { openModal: openBatchImportModal }] = useModal();
  const [registerDealModal, { openModal: openDealModal }] = useModal();
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();

  // table勾选事件
  function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
  }

  // 所有批量操作按钮-未勾选，禁止点击
  const batchBtnDisabled = computed(() => checkedKeys.value.length === 0);

  // 超级管理员可看所有病区的人员，此值为空即可筛选全部数据；普通人员只能看所在病区的人员， 此值设置当前病区的id值；
  const defaultPartitionId =
    userStore?.getUserInfo.roleId == '1' ? '' : userStore?.getCurrentPartition.id;

  const searchInfo = reactive({
    keyword: '',
    partition_id: defaultPartitionId,
  });

  function handleSearch(val) {
    searchInfo.keyword = val.keyword;
    searchInfo.partition_id = val.user_partition;
    reload();
  }

  function searchKeyword(searchValue: string) {
    searchInfo.keyword = searchValue;
    reload();
  }

  function handleReset() {
    searchInfo.keyword = '';
    searchInfo.partition_id = '';
    reload();
  }

  function handleDetail(record: Recordable) {
    openDetailModal(true, {
      isUpdate: false,
      record,
    });
  }

  function handleCreate() {
    openDealModal(true, {
      isUpdate: false,
    });
  }

  function handleEdit(record: Recordable) {
    openDealModal(true, {
      // 此处后端返回的角色字段的值是字符串，要转成数字类型，Select框才能选中
      record: { ...record, user_role: Number(record.user_role) },
      isUpdate: true,
    });
  }

  async function deleteRequest(ids: string | number) {
    const res = await deletePersonApi({
      ids,
    });
    if (res === true) {
      createMessage.success('删除成功!');
    } else {
      createMessage.error('删除失败!');
    }
    clearSelectedRowKeys();
    reload();
  }

  async function handleBatchImport() {
    openBatchImportModal(true);
  }

  // 删除账号-弹出提示框
  function showDeleteModal(record: Recordable) {
    currentAccount.value = record;
    deleteVisible.value = true;
  }

  // 批量删除账号-弹出提示框
  function handleBatchDelete() {
    isBatchOperate.value = true;
    deleteVisible.value = true;
  }

  // 确定删除、批量删除操作
  function confirmDelete() {
    const ids = isBatchOperate.value ? checkedKeys.value : currentAccount.value.id;
    deleteRequest(ids);
    deleteVisible.value = false;
    isBatchOperate.value = false;
  }

  // 监听select病区的值是否改变；切换了病区，页面要刷新
  watch(
    () => userStore?.getCurrentPartition,
    async (newVal) => {
      if (!newVal) return;
      searchInfo.partition_id = newVal.id;
      await nextTick();
      reload();
    },
    {
      deep: true,
    },
  );
</script>

<style lang="less">
  .personnel-page {
    .personnel-search-form {
      .ant-input-affix-wrapper,
      .ant-select-selector {
        background-color: #f7f8fc;
      }
      input {
        background-color: #f7f8fc;
      }
    }
  }
</style>
