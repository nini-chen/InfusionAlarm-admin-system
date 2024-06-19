<template>
  <PageWrapper>
    <div class="bg-white rounded flex justify-between items-center mb-4 pr-2 pl-1">
      <BasicForm
        class="w-full min-h-46px !m-0 !pt-8px flex-1 items-center user-search-form"
        @register="registerSearchForm"
        @submit="handleSearch"
        @reset="handleReset"
      >
        <template #keywordSlot="{ model, field }">
          <InputSearch
            v-model:value.trim="model[field]"
            allowClear
            maxLength="20"
            placeholder="请输入账号/姓名"
            @search="searchKeyword"
            @input="
              (e) => {
                model[field] = oninputDeal(e);
              }
            "
          />
        </template>

        <template #roleSlot="{ model, field }">
          <Select
            v-model:value="model[field]"
            :options="roleOptions"
            allowClear
            placeholder="请选择角色类型"
          />
        </template>
      </BasicForm>
      <div>
        <a-button type="primary" size="small" @click="handleCreate">
          <PlusOutlined />
          添加用户
        </a-button>
        <a-button
          class="mx-2 bath-open-btn"
          ghost
          color="success"
          size="small"
          :disabled="batchBtnDisabled"
          @click="handleBatchStart"
        >
          批量启用
        </a-button>
        <a-button type="default" size="small" :disabled="batchBtnDisabled" @click="handleBatchStop">
          批量停用
        </a-button>
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
    <BasicTable @register="registerTable" :searchInfo="searchInfo">
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
              ifShow: () => record.power,
            },
            {
              label: '停用',
              color: 'error',
              onClick: showStopModal.bind(null, record),
              ifShow: () => record.power && record.user_status === 1,
            },
            {
              label: '启用',
              color: 'success',
              onClick: showStartModal.bind(null, record),
              ifShow: () => record.power && record.user_status === 2,
            },
            {
              label: '删除',
              color: 'error',
              onClick: showDeleteModal.bind(null, record),
              ifShow: () => record.power,
            },
          ]"
        />
      </template>
    </BasicTable>
    <!-- 弹窗：用户详情 -->
    <DetailModal
      :width="670"
      :canFullscreen="false"
      @register="registerDetailModal"
      @success="reload"
    />
    <!-- 弹窗：添加用户 或 编辑用户 -->
    <DealModal
      :width="670"
      :canFullscreen="false"
      @register="registerDealModal"
      @success="reload"
    />
    <!-- 弹窗：停用 / 批量停用 -->
    <Modal
      v-model:visible="stopVisible"
      width="446"
      :title="stopVisible && isBatchOperate ? '批量停用账号' : '停用账号'"
      okText="确认"
      @ok="confirmStop"
      @cancel="isBatchOperate = false"
    >
      <div class="px-24px py-30px">
        <div class="flex justify-center items-center">
          <Icon icon="ant-design:exclamation-circle-filled" color="#FAAD14" size="23" />
          <span class="flex-1 rounded-sm ml-2 p-8px leading-initial">
            <span class="text-base leading-initial">
              确认停用
              <i class="text-blue-500 not-italic" v-if="stopVisible && !isBatchOperate">{{
                currentAccount.user_name
              }}</i>
              账号吗？
            </span>
          </span>
        </div>
        <div class="mt-2 pl-34px">
          <span class="text-sm text-gray-500 text-base"
            >停用后，所选账号用户将无法登录使用系统</span
          >
        </div>
      </div>
    </Modal>
    <!-- 弹窗：删除 / 批量删除 -->
    <Modal
      v-model:visible="deleteVisible"
      width="466"
      :title="deleteVisible && isBatchOperate ? '批量删除账号' : '删除账号'"
      okText="确认"
      @ok="confirmDelete"
      @cancel="isBatchOperate = false"
    >
      <div class="px-24px py-30px">
        <div class="flex justify-center items-center">
          <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
          <span class="flex-1 rounded-sm ml-2 p-8px text-base">
            <span>
              确认删除<i class="text-blue-500 not-italic" v-if="deleteVisible && !isBatchOperate">{{
                currentAccount.user_name
              }}</i
              >账号吗？
            </span>
          </span>
        </div>
      </div>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { InputSearch, Modal, Select } from 'ant-design-vue';
  import { Icon } from '/@/components/Icon';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { PageWrapper } from '/@/components/Page';

  import DetailModal from './components/DetailModal.vue';
  import DealModal from './components/DealModal.vue';

  import { columns, getFormConfig } from './components/config.data';
  import { getRoleListApi } from '/@/api/doctors/role';
  import { getUserListApi, deleteUserApi, stopOrStartUserApi } from '/@/api/doctors/user';
  import { StopOrStartUserParams } from '/@/api/doctors/model/userModel';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { oninputDeal } from '/@/utils/formRender';

  // 搜索参数
  const searchInfo = ref({});
  // 单个操作-当前操作的账号
  const currentAccount = ref<Recordable>({});
  // 停用提示框是否弹出，停用和批量停用共用一个
  const stopVisible = ref<boolean>(false);
  // 删除、批量删除提示框
  const deleteVisible = ref<boolean>(false);
  // 批量操作-判断
  const isBatchOperate = ref<boolean>(false);
  // 批量操作-勾选的id
  const checkedKeys = ref<Array<string | number>>([]);
  const roleOptions = ref<LabelValueOptions>([]);

  const { createMessage } = useMessage();
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  const [registerDealModal, { openModal: openDealModal }] = useModal();
  const [registerSearchForm, { setFieldsValue }] = useForm(getFormConfig());
  const [registerTable, { reload, clearSelectedRowKeys, setProps, scrollTo }] = useTable({
    fetchSetting: {
      pageField: 'page_index',
      sizeField: 'page_size',
      listField: 'data',
      totalField: 'data_sum',
    },
    api: getUserListApi,
    beforeFetch(info) {
      return { ...info, ...searchInfo.value };
    },
    afterFetch(result) {
      const isSearchOperate = Object.values(searchInfo.value).find((x) => x);
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
    clickToRowSelect: false,
    striped: false,
    rowSelection: {
      type: 'checkbox',
      // 设备禁用项： 目前就admin身份不可修改删除
      getCheckboxProps(record: Recordable) {
        return { disabled: !record.power };
      },
      selectedRowKeys: checkedKeys,
      onChange: onSelectChange,
    },
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 250,
      slots: { customRender: 'action' },
      fixed: 'right',
    },
    onChange() {
      scrollTo('top');
    },
  });

  // table勾选事件
  function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
  }

  // 搜索栏-搜索按钮
  function handleSearch(val) {
    searchInfo.value = val;
    reload();
  }

  // 搜索栏-关键字搜索的enter事件、input框内小图标点击事件
  function searchKeyword(searchValue: string) {
    searchInfo.value.keyword = searchValue;
    reload();
  }

  // 搜索栏-重置按钮
  function handleReset() {
    searchInfo.value = { keyword: '', user_partition: '', user_role: '' };
    reload();
  }

  // 所有批量操作按钮-未勾选，禁止点击
  const batchBtnDisabled = computed(() => checkedKeys.value.length === 0);

  function handleDetail(record: Recordable) {
    openDetailModal(true, {
      record,
      isUpdate: true,
    });
  }

  function handleCreate() {
    openDealModal(true, {
      record: {},
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

  async function stopOrStartRequest(params: StopOrStartUserParams) {
    const res = await stopOrStartUserApi(params);
    const label = params.user_status === 1 ? '启用' : '停用';
    if (res === true) {
      createMessage.success(`${label}成功!`);
    } else {
      createMessage.error(`${label}失败!`);
    }
    clearSelectedRowKeys();
    reload();
  }

  async function deleteRequest(ids: string | number) {
    const res = await deleteUserApi({
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

  // 停用账号-弹出提示框
  function showStopModal(record: Recordable) {
    currentAccount.value = record;
    stopVisible.value = true;
  }

  // 批量停用账号-弹出提示框
  function handleBatchStop() {
    isBatchOperate.value = true;
    stopVisible.value = true;
  }

  // 停用/批量停用账号-确定操作
  function confirmStop() {
    const ids = isBatchOperate.value ? checkedKeys.value : currentAccount.value.id;
    stopOrStartRequest({
      ids,
      user_status: 2,
    });
    stopVisible.value = false;
    isBatchOperate.value = false;
  }

  // 启用账号
  function showStartModal(record: Recordable) {
    stopOrStartRequest({
      ids: record.id,
      user_status: 1,
    });
  }

  // 批量启用账号
  function handleBatchStart() {
    stopOrStartRequest({
      ids: checkedKeys.value,
      user_status: 1,
    });
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

  // 判断是否是从角色页面跳过来进行换绑的
  function checkComeFromRolePage() {
    const user_role = sessionStorage.getItem('formRoleId');
    if (user_role) {
      setFieldsValue({
        user_role: String(user_role) || '',
      });
      searchInfo.value.user_role = user_role;
      sessionStorage.removeItem('formRoleId');
      reload();
    }
  }

  // 获取角色类型options
  async function getRoleOptions() {
    const res = await getRoleListApi();
    roleOptions.value = res?.data?.map((x) => {
      const { id, role_name: label } = x;
      return {
        value: String(id),
        label,
      };
    });
  }

  onMounted(() => {
    getRoleOptions();
    checkComeFromRolePage();
  });
</script>
<style lang="less">
  .bath-open-btn.ant-btn-background-ghost[disabled] {
    color: rgba(0, 0, 0, 0.25) !important;
    background: #f5f5f5 !important;
    border-color: #d9d9d9 !important;
    text-shadow: none;
    box-shadow: none;
  }

  .user-search-form {
    .ant-row.ant-form-item {
      margin-bottom: 0;
    }

    .ant-input-affix-wrapper,
    .ant-select:not(.ant-select-customize-input) .ant-select-selector {
      background-color: #f7f8fc;
    }
    input {
      background-color: #f7f8fc;
    }
  }
</style>
