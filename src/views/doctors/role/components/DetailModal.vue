<template>
  <BasicModal
    title="角色详情"
    v-bind="$attrs"
    @register="register"
    destroyOnClose
    :showOkBtn="false"
    cancelText="关闭"
  >
    <div class="pt-3px pr-3px min-h-120" v-loading="loading">
      <ul class="role-auth-detail">
        <li class="role-item">
          <label class="label">角色名称 :</label>
          <div>
            <span>{{ roleRecord.role_name || '无' }}</span>
          </div>
        </li>
        <li class="role-item">
          <label class="label">角色描述 :</label>
          <div class="w-4/5">
            <span>{{ roleRecord.role_remarks || '无' }}</span>
          </div>
        </li>
        <li class="role-item">
          <label class="label">权限管理 :</label>
          <div id="treeWrapper">
            <BasicTree
              ref="roleTreeRef"
              id="roleTreeId"
              class="role-auth-tree min-h-80"
              :treeData="treeData"
              :replaceFields="{ key: 'id', title: 'node_title', children: 'children' }"
            />
          </div>
        </li>
      </ul>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, nextTick } from 'vue';
  import { filter } from '/@/utils/helper/treeHelper';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicTree, TreeItem, TreeActionType } from '/@/components/Tree/index';
  import { getRoleMenuList } from '/@/api/sys/user';
  import { RoleListRecord } from '/@/api/doctors/role/model/roleModel';

  const loading = ref(false);
  const roleRecord = ref({} as RoleListRecord);
  const treeData = ref<TreeItem[]>([]);
  const roleTreeRef = ref<Nullable<TreeActionType>>(null);

  defineEmits(['register']);

  const [register, {}] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  // TODO 消除tree侧边滚动条
  function clearTreeScroll() {
    setTimeout(() => {
      const roleTreeElementHeight = roleTreeRef.value.$el.offsetHeight;
      document.getElementById('treeWrapper').style.height = roleTreeElementHeight + 40 + 'px';
      loading.value = false;
    }, 500);
  }

  async function onDataReceive(data) {
    roleRecord.value = data.record;
    const nodeIds = await getRoleMenuList({ role_id: data.record.id });
    console.log('nodeIds--', nodeIds);
    if (data?.treeData && nodeIds) {
      loading.value = true;
      // 过滤菜单，只展示有权限的
      treeData.value = filter(data?.treeData, (node) => {
        if (nodeIds.includes(node.id) && node.id != 11) {
          return node;
        }
      });
      // 将tree组件展开
      nextTick(() => {
        roleTreeRef.value?.expandAll(true);
        clearTreeScroll();
      });
    }
  }
</script>
<style lang="less">
  .role-auth-detail {
    .role-item {
      margin: 0 30px;
      font-size: 14px;
      display: flex;

      .label {
        height: 32px;
        color: #000000d9;
        margin-right: 25px;
      }
      > div {
        flex: 1;
      }
    }
  }

  .role-auth-tree {
    // min-height: 1000px;
    background-color: transparent !important;
  }
</style>
