<template>
  <div class="addModal">
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      @ok="handleSubmit"
      @visible-change="handlecancel"
    >
      <div class="w-full">
        <BasicForm @register="register" />
      </div>

      <div class="mb-2">分组范围：</div>
      <div class="w-full bg-gray-100 px-3 pt-12" style="position: relative">
        <div class="transferTop">
          <div class="w-1/2">
            <Select
              v-model:value="selectValue"
              placeholder="选择设备类型"
              style="width: 150px"
              :options="deviceClassify"
            />
            <Input
              v-model:value="search"
              placeholder="请输入设备编号"
              style="margin-left: 10px; width: 174px"
              allowClear
            >
              <template #suffix>
                <SearchOutlined />
              </template>
            </Input>
          </div>
          <div class="w-1/2" style="padding: 5px 30px">已选：2项</div>
        </div>
        <Transfer
          v-model:target-keys="targetKeys"
          :data-source="mockData"
          :show-search="false"
          :showSelectAll="false"
          @change="handleChange"
          @search="handleSearch"
          :listStyle="listStyle"
          :operationStyle="operationStyle"
        >
          <template
            #children="{
              direction,
              filteredItems,
              selectedKeys,
              disabled: listDisabled,
              onItemSelectAll,
              onItemSelect,
            }"
          >
            <Table
              :row-selection="
                getRowSelection({
                  disabled: listDisabled,
                  selectedKeys,
                  onItemSelectAll,
                  onItemSelect,
                })
              "
              :pagination="false"
              :columns="direction === 'left' ? leftColumns : rightColumns"
              :data-source="filteredItems"
              size="small"
              :style="{ pointerEvents: listDisabled ? 'none' : null }"
              :custom-row="
                ({ key, disabled: itemDisabled }) => ({
                  onClick: () => {
                    if (itemDisabled || listDisabled) return;
                    onItemSelect(key, !selectedKeys.includes(key));
                  },
                })
              "
            />
          </template>
        </Transfer>
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, onMounted } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { addDeviceGroup, getAllDevice } from '/@/api/ward/patient';
  import { useUserStore } from '/@/store/modules/user';
  import { Transfer, Table, Input, Select } from 'ant-design-vue';
  import { SearchOutlined } from '@ant-design/icons-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { deviceClassify, getDeviceClassifyName } from '/@/views/ward/device/components/table.data';

  const emit = defineEmits(['success']);
  const modalFormSchemas: FormSchema[] = [
    {
      field: 'id',
      component: 'Input',
      label: ' ',
      colProps: {
        span: 16,
      },
      show: false,
    },
    {
      field: 'group_name',
      component: 'Input',
      label: '分组名称',
      colProps: {
        span: 16,
      },
      componentProps: {
        placeholder: '请输入分组名称',
      },
      required: true,
    },
    {
      field: 'remarks',
      component: 'InputTextArea',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
        rows: 4,
        allowClear: true,
      },
      colProps: {
        span: 16,
      },
    },
  ];

  let listStyle = {
    width: '50%',
    height: '350px',
  };

  let operationStyle = {
    width: '65px',
  };

  const leftTableColumns = [
    {
      dataIndex: 'device_type',
      title: '设备类型',
    },
    {
      dataIndex: 'deviceCode',
      title: '设备编号',
    },
    {
      dataIndex: 'deviceName',
      title: '设备名称',
    },
  ];
  const rightTableColumns = [
    {
      dataIndex: 'device_type',
      title: '设备类型',
    },
    {
      dataIndex: 'deviceCode',
      title: '设备编号',
    },
    {
      dataIndex: 'deviceName',
      title: '设备名称',
    },
  ];

  const mockData = ref([]);
  const targetKeys = ref([]);
  const leftColumns = ref(leftTableColumns);
  const rightColumns = ref(rightTableColumns);
  const search = ref('');
  const selectValue = ref('');

  const infoType = ref(false);
  const userStore = useUserStore();
  const { createMessage } = useMessage();
  // 当前用户所处的病区的id
  let partitionId = computed(() => userStore.getCurrentPartition.id);

  const [register, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 80,
    schemas: modalFormSchemas,
    colon: true,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    infoType.value = JSON.stringify(data) == '{}' ? true : false;
    setModalProps({
      title: infoType.value ? '添加设备分组' : '编辑设备分组',
    });
    if (infoType.value) {
      setFieldsValue({});
    }
  });

  const getRowSelection = ({
    disabled,
    selectedKeys,
    onItemSelectAll,
    onItemSelect,
  }: Record<string, any>) => {
    return {
      getCheckboxProps: (item: Record<string, string | boolean>) => ({
        disabled: disabled || item.disabled,
      }),
      onSelectAll(selected: boolean, selectedRows: Record<string, string | boolean>[]) {
        const treeSelectedKeys = selectedRows
          .filter((item) => !item.disabled)
          .map(({ key }) => key);
        onItemSelectAll(treeSelectedKeys, selected);
      },
      onSelect({ key }: Record<string, string>, selected: boolean) {
        onItemSelect(key, selected);
      },
      selectedRowKeys: selectedKeys,
    };
  };

  onMounted(() => {
    // getMock();
  });

  async function handleSubmit() {
    await validate();

    if (targetKeys.value.length == 0) {
      createMessage.warning('至少选择一个分组');
      return false;
    }

    const { group_name, remarks } = getFieldsValue();

    //新增
    if (infoType.value) {
      let params = {
        group_name,
        remarks,
        partition_id: partitionId.value,
        device_ids: targetKeys.value,
      };
      let res = await addDeviceGroup(params);
      if (res) {
        resetFields();
        closeModal();
        emit('success');
      }
    } else {
    }
  }

  async function getList() {
    let params = {
      partition_id: partitionId.value,
      device_type: selectValue.value,
      keyword: search.value,
    };
    let res = await getAllDevice(params);
    console.log(res, 444);
    const keys = [];
    const mData = [];
    for (let i = 0; i < res.length; i++) {
      const data = {
        key: res[i].id,
        device_type: getDeviceClassifyName(res[i].device_type),
        deviceCode: res[i].device_code,
        deviceName: res[i].device_name,
      };
      mData.push(data);
    }
    mockData.value = mData;
    targetKeys.value = keys;
  }

  function handleChange(keys: string[], direction: string, moveKeys: string[]) {
    console.log(keys, direction, moveKeys);
  }

  function handleSearch(dir: string, value: string) {
    console.log('search:', dir, value);
  }

  function handlecancel(val) {
    !val && resetFields();
    val && getList();
  }
</script>

<style lang="less" scoped>
  .transferTop {
    width: 100%;
    position: absolute;
    top: 9px;
    left: 12px;
    display: flex;
  }

  :deep(.ant-transfer-operation) {
    align-items: center;
  }

  :deep(.ant-transfer-operation .ant-btn:first-child) {
    margin-bottom: 20px;
  }

  :deep(.ant-transfer-list-header) {
    display: none;
  }
</style>
