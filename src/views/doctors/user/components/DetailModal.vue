<template>
  <BasicModal
    title="用户详情"
    v-bind="$attrs"
    @register="register"
    cancelText="关闭"
    :showOkBtn="false"
    destroyOnClose
  >
    <div class="pt-3px pr-3px user-details-Description">
      <Description :column="1" :data="descriptionData" :schema="schemaDescription" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description, DescItem, useDescription } from '/@/components/Description/index';

  defineEmits(['register']);

  const descriptionData = ref([]);

  const emptyRender = (val) => (val ? val : '-');
  const schemaDescription: DescItem[] = [
    {
      field: 'user_name',
      label: '姓名',
    },
    {
      field: 'user_number',
      label: '账号',
    },
    {
      field: 'partition_name',
      label: '所属病区',
    },
    {
      field: 'role_name',
      label: '角色',
    },
    {
      field: 'user_telphone',
      label: '手机号码',
      render: emptyRender,
    },
    {
      field: 'user_email',
      label: '邮箱',
      render: emptyRender,
    },
    {
      field: 'remarks',
      label: '备注',
      render: emptyRender,
    },
  ];

  useDescription({
    title: 'useDescription',
    data: descriptionData,
    schema: schemaDescription,
  });

  const [register, {}] = useModalInner((data) => {
    descriptionData.value = data.record;
  });
</script>

<style lang="less">
  .user-details-Description {
    .ant-descriptions-item-label {
      width: 90px;
    }
  }
</style>
