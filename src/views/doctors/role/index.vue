<template>
  <PageWrapper>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" size="small" @click="handleCreate">
          <PlusOutlined />
          添加角色
        </a-button>
      </template>
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
              ifShow: () => record.role_default != 1,
            },
            {
              color: 'error',
              label: '删除',
              onClick: handleDelete.bind(null, record),
              ifShow: () => record.role_default != 1,
            },
          ]"
        />
      </template>
    </BasicTable>

    <!-- 角色详情 弹窗 -->
    <DetailModal :width="620" @register="registerDetailModal" />
    <!-- 添加角色 或 编辑角色 弹窗 -->
    <DealModal
      :width="600"
      :canFullscreen="false"
      @register="registerDealModal"
      @success="reload"
    />
    <!-- 删除弹窗 -->
    <Modal
      v-model:visible="deleteVisible"
      width="446"
      title="删除角色"
      :okText="isBind ? '前往换绑' : '确认'"
      @ok="confirmDelete"
    >
      <div class="px-24px py-30px">
        <div class="flex justify-center items-center">
          <Icon
            icon="ant-design:exclamation-circle-filled"
            :color="isBind ? '#FAAD14' : '#FF4F4F'"
            size="23"
          />
          <span class="flex-1 rounded-sm ml-2 p-8px text-base leading-initial">
            {{ isBind ? '角色使用中，请先将后台用户绑定至其他角色' : '确认删除该角色吗？' }}
          </span>
        </div>
        <div v-if="!isBind" class="delete-role-table">
          <div class="row">
            <p class="label">角色名称</p>
            <p class="txt">
              <span>{{ currentRole.role_name }}</span>
            </p>
          </div>
          <div class="row">
            <p class="label">角色描述</p>
            <p class="txt">
              <span>{{ currentRole.role_remarks }}</span>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { PageWrapper } from '/@/components/Page';
  import { Modal } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { useModal } from '/@/components/Modal';
  import { TreeItem } from '/@/components/Tree/index';
  import { useGo } from '/@/hooks/web/usePage';
  import { useMessage } from '/@/hooks/web/useMessage';

  import DetailModal from './components/DetailModal.vue';
  import DealModal from './components/DealModal.vue';

  import { columns } from './components/config.data';
  import { getRoleListApi, deleteRoleApi } from '/@/api/doctors/role';
  import { getAllRoleApi, checkRoleBindApi } from '/@/api/sys/user';

  const deleteVisible = ref<boolean>(false);
  const isBind = ref<boolean>(false);
  const currentRole = ref<Recordable>({});
  const treeData = ref<TreeItem[]>([]);

  const [registerTable, { reload, scrollTo }] = useTable({
    title: '后台角色配置',
    fetchSetting: {
      pageField: 'page_index',
      sizeField: 'page_size',
      listField: 'data',
      totalField: 'data_sum',
    },
    api: getRoleListApi,
    columns,
    rowKey: 'id',
    showTableSetting: false,
    bordered: true,
    showIndexColumn: true,
    clickToRowSelect: false,
    striped: false,
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      slots: { customRender: 'action' },
      fixed: undefined,
    },
    onChange() {
      scrollTo('top');
    },
  });
  const [registerDetailModal, { openModal: openDetailModal }] = useModal();
  const [registerDealModal, { openModal: openDealModal }] = useModal();
  const go = useGo();
  const { createMessage } = useMessage();

  function handleDetail(record: Recordable) {
    openDetailModal(true, {
      record,
      treeData: treeData.value,
    });
  }

  function handleCreate() {
    openDealModal(true, {
      isUpdate: false,
      record: {},
      treeData: treeData.value,
    });
  }

  function handleEdit(record: Recordable) {
    openDealModal(true, {
      isUpdate: true,
      record,
      treeData: treeData.value,
    });
  }

  async function handleDelete(record: Recordable) {
    currentRole.value = record;
    const res = await checkRoleBindApi(record.id);
    isBind.value = res === 'yes';
    deleteVisible.value = true;
  }

  async function confirmDelete() {
    // 已有账号绑定了此角色，去解绑
    if (isBind.value) {
      sessionStorage.setItem('formRoleId', currentRole.value.id);
      go(`/doctors/user`);
      return;
    }
    // 未发现账号绑定此角色，直接删除此角色
    await deleteRoleApi({ role_id: currentRole.value.id });
    createMessage.success('删除成功！');
    deleteVisible.value = false;
    isBind.value = false;
    reload();
  }

  async function getRoleTree() {
    treeData.value = await getAllRoleApi();
  }
  onMounted(() => {
    getRoleTree();
  });
</script>

<style lang="less">
  .delete-role-table {
    margin: 16px 0 0;
    font-size: 14px;
    color: #333;
    border-radius: 4px;
    border: 1px solid #e9e9e9;

    .row {
      min-height: 40px;
      display: flex;
      background-color: rgba(0, 0, 0, 0.05);
      &:first-child {
        border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      }
      p {
        margin: 0;
      }
    }

    .label,
    .txt {
      min-height: 40px;
      align-self: center;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .label {
      width: 88px;
    }

    .txt {
      flex: 1;
      background-color: #fff;
      padding: 0.5em;
      span {
        max-width: 300px;
      }
    }
  }
</style>
