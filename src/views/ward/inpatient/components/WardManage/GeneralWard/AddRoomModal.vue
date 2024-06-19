<template>
  <div class="add-ward-room-modal">
    <!-- 弹窗：普通病区-添加病房 -->
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      @ok="handleSubmit"
      @visible-change="handlecancel"
    >
      <div class="w-full">
        <BasicForm @register="register">
          <template #partition_name>
            <span class="text-gray-500">{{ partition_name }}</span>
          </template>
          <template #room_num="{ model, field }">
            <div>
              <div class="flex">
                <Select
                  v-model:value="model[field]"
                  style="width: 52%"
                  placeholder="请选择病房号"
                  :options="options"
                  allowClear
                />
                <span class="pl-2 pt-1">房</span>
                <div class="text-xs text-gray-400 pt-2 pl-4">提示：可选择范围1-99</div>
              </div>
            </div>
          </template>
          <template #bed_num="{ model, field }">
            <div>
              <div class="flex">
                <Select
                  v-model:value="model[field]"
                  style="width: 52%"
                  placeholder="请选择病床数量"
                  :options="options2"
                  allowClear
                />
                <div class="text-xs text-gray-400 pt-2 pl-4"
                  >提示：病床数量将影响门口机界面布局</div
                >
              </div>
            </div>
          </template>
        </BasicForm>
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, watch } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema } from '/@/components/Form/index';
  import { addHospitalRoom } from '/@/api/ward/patient';
  import { useUserStore } from '/@/store/modules/user';
  import { Select } from 'ant-design-vue';

  const props = defineProps({
    // eslint-disable-next-line vue/require-valid-default-prop
    selected: { type: Array, default: [] },
  });

  const emit = defineEmits(['success', 'register']);
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
      field: 'partition_name',
      component: 'Input',
      label: '所属病区',
      colProps: {
        span: 24,
      },
      slot: 'partition_name',
    },
    {
      field: 'room_num',
      component: 'Select',
      label: '病房名称',
      colProps: {
        span: 24,
      },
      required: true,
      slot: 'room_num',
    },
    {
      field: 'bed_num',
      component: 'Select',
      label: '病床数量',
      colProps: {
        span: 24,
      },
      required: true,
      slot: 'bed_num',
    },
    {
      field: 'remarks',
      component: 'InputTextArea',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
        rows: 4,
        maxlength: 100,
        showCount: true,
        allowClear: true,
      },
      colProps: {
        span: 24,
      },
    },
  ];

  const options = ref([]);

  const options2 = [
    // {
    //   label: '1',
    //   value: 1,
    // },
    {
      label: '2',
      value: 2,
    },
    {
      label: '3',
      value: 3,
    },
    {
      label: '4',
      value: 4,
    },
  ];

  const infoType = ref(false);
  const userStore = useUserStore();
  // 当前用户所处的病区的id
  let partitionId = computed(() => userStore.getCurrentPartition.id);
  const partitionOptions = computed(() => userStore.getAllPartitions);
  let partition_name = ref('');

  const [register, { getFieldsValue, setFieldsValue, resetFields, validate }] = useForm({
    labelWidth: 80,
    schemas: modalFormSchemas,
    colon: true,
    showActionButtonGroup: false,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    infoType.value = JSON.stringify(data) == '{}' ? true : false;
    setModalProps({
      title: infoType.value ? '添加病房' : '编辑病房',
    });
    if (infoType.value) {
      setFieldsValue({});

      getPartitionName();
    }
  });

  watch(
    () => props.selected,
    () => {
      setOptions();
    },
    {
      deep: true,
      immediate: true,
    },
  );

  setOptions();
  function setOptions() {
    let list: any = [];
    for (let i = 1; i <= 99; i++) {
      let opsions = {
        label: i,
        value: i,
        disabled: false,
      };

      list.push(opsions);
    }

    list.forEach((v) => {
      if (props.selected.includes(v.value)) {
        v.disabled = true;
      }
    });

    options.value = list;
  }

  function getPartitionName() {
    let obj: any = partitionOptions.value.find((v) => {
      return v.id == partitionId.value;
    });

    partition_name.value = obj.partition_name;
  }

  async function handleSubmit() {
    await validate();

    const { room_num, bed_num, remarks } = getFieldsValue();
    let partition_id = partitionId.value;
    let params = {
      room_num,
      bed_num,
      remarks,
      partition_id,
    };

    let res = await addHospitalRoom(params);
    if (res) {
      resetFields();
      closeModal();
      emit('success');
    }
  }

  function handlecancel(val) {
    !val && resetFields();
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
