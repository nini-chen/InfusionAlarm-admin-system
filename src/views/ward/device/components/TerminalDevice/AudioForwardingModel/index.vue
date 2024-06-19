<template>
  <BasicModal
    title="音频转发器管理"
    v-bind="$attrs"
    @register="register"
    :destroy-on-close="true"
    @visible-change="handleVisibleChange"
    @ok="handleSubmit"
  >
    <div class="audio-forwarding-modal pt-3px pr-6">
      <!-- 音频转发器信息 -->
      <Description @register="descriptionRegister" class="mt-4" />
      <!-- 音频转发器设备列表 -->
      <BasicTable @register="registerICTable">
        <template #action="{ record }">
          <TableAction
            :actions="[
              {
                label: '删除',
                onClick: handleDeleteIC.bind(null, record),
              },
            ]"
          />
        </template>
      </BasicTable>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description, DescItem, useDescription } from '/@/components/Description/index';
  import { BasicTable, useTable, TableAction, BasicColumn } from '/@/components/Table';

  // import { dealModalSchemas, personTypeOptions, maleOptions, defaultAvatars } from './config.data';
  // import { getICList } from '/@/api/doctors/personnel';

  // Forward audio
  const { createMessage } = useMessage();
  const editId = ref<string>('');

  // 当前弹窗
  const [register, { setModalProps }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  const emit = defineEmits(['success', 'register']);

  // 门禁详情相关
  const descriptionData: Recordable = {
    device_name: 'test',
    partition_name: 'VB',
  };

  const descriptionSchema: DescItem[] = [
    {
      field: 'device_name',
      label: '设备名称',
    },
    {
      field: 'partition_name',
      label: '所属病区',
    },
  ];

  const [descriptionRegister] = useDescription({
    bordered: false,
    data: descriptionData,
    schema: descriptionSchema,
  });

  function getICList() {
    return [];
  }

  const ICColumns: BasicColumn[] = [
    {
      title: 'IC卡编号',
      dataIndex: 'ic_number',
    },
    {
      title: 'IC卡名称',
      dataIndex: 'ic_name',
    },
  ];

  // IC卡表格
  const [registerICTable, { reload, scrollTo }] = useTable({
    fetchSetting: {
      pageField: 'page_index',
      sizeField: 'page_size',
      listField: 'data',
      totalField: 'data_sum',
    },
    // beforeFetch(info) {
    //   return { ...info, ...searchParams };
    // },
    api: getICList,
    columns: ICColumns,
    useSearchForm: false,
    bordered: true,
    clickToRowSelect: false,
    showIndexColumn: true,
    rowKey: 'id',
    actionColumn: {
      title: '操作',
      dataIndex: 'action',
      width: 220,
      slots: { customRender: 'action' },
    },
    onChange() {
      scrollTo('top');
    },
  });

  async function onDataReceive(data) {
    setModalProps({
      title: data.isUpdate ? '编辑医护人员' : '添加医护人员',
    });
    editId.value = '';
    if (data.isUpdate) {
    }
  }

  function handleVisibleChange(v) {
    // !v && resetFields();
  }

  function handleSubmit() {}
  function handleDeleteIC() {}
</script>
<style lang="less">
  .audio-forwarding-modal {
  }
</style>
