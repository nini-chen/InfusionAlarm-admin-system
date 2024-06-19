<template>
  <BasicModal
    title="删除角色"
    v-bind="$attrs"
    @register="register"
    :destroyOnClose="true"
    :okText="isBind ? '前往换绑' : '确认'"
    @ok="handleOk"
  >
    <!-- 2. 如果已经绑定了其他角色 -->
    <div class="mt-8" v-if="isBind">
      <div class="flex justify-center items-center">
        <Icon icon="ant-design:exclamation-circle-filled" color="#FAAD14" size="23" />
        <span class="flex-1 bg-yellow-100 rounded-sm ml-2 p-8px"
          >角色使用中，请先将后台用户绑定至其他角色</span
        >
      </div>
    </div>
    <!-- 1. 角色信息提示 -->
    <div class="mt-8" v-else>
      <div class="flex justify-center items-center pb-6">
        <Icon icon="ant-design:exclamation-circle-filled" color="#ff4f4f" size="23" />
        <span class="flex-1 bg-yellow-100 rounded-sm ml-2 p-8px">确认删除该角色吗？</span>
      </div>
      <Description @register="registerDescription" :data="roleData" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref, unref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description, useDescription } from '/@/components/Description/index';
  import { Icon } from '/@/components/Icon';

  import { deleteRoleApi } from '/@/api/doctors/role';
  import { checkRoleBindApi } from '/@/api/sys/user';
  import { RoleListRecord } from '/@/api/doctors/model/roleModel';

  const { createMessage } = useMessage();
  const emit = defineEmits(['success', 'register']);

  const isBind = ref<boolean>(false);
  const roleData = ref({} as RoleListRecord);

  const [register, { setModalProps }] = useModalInner((data) => {
    isBind.value = false;
    setModalProps({
      confirmLoading: false,
    });
    roleData.value = data.record;
  });

  const [registerDescription] = useDescription({
    column: 1,
    schema: [
      {
        field: 'role_name',
        label: '角色名称',
      },
      {
        field: 'role_remarks',
        label: '角色描述',
      },
    ],
  });

  async function handleOk() {
    setModalProps({
      confirmLoading: true,
    });
    if (isBind.value) {
      // 2.1.1 二次点击了确定按钮，前往解除绑定：
    } else {
      // 1. 判断当前角色是否被用于绑定了用户账号
      const role_id = unref(roleData).id;
      const res = await checkRoleBindApi(role_id);
      isBind.value = res === 'yes';
      if (isBind.value) {
        // 2.1 如果已经绑定，则改变一下当前弹窗的提示语，和确定按钮的文案，让用户可二次点击
        setModalProps({
          confirmLoading: false,
        });
      } else {
        // 2.2 如果此账号没被用于绑定用户，直接删除吧
        try {
          await deleteRoleApi({ role_id });
          createMessage.success('删除成功！');
          setModalProps({
            confirmLoading: false,
            visible: false,
          });
          emit('success');
        } catch (e) {
          createMessage.error('删除失败！');
          setModalProps({
            confirmLoading: false,
          });
        }
      }
    }
  }
</script>
<style lang="less" scoped></style>
