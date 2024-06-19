<template>
  <div class="icu-room-modal">
    <!-- 弹窗：ICU病区-添加/编辑 普通病房 -->
    <BasicModal
      v-bind="$attrs"
      @register="registerModal"
      :destroy-on-close="true"
      @ok="handleSubmit"
      @visible-change="handleCancel"
    >
      <div class="w-full">
        <BasicForm @register="register">
          <!-- 普通病房-可创建的病房号 -->
          <template #roomNumberSlot="{ model, field }">
            <div v-if="isEdit" class="text-gray-400 ml-4">
              <span class="pr-18px">{{ model[field] }}</span>
              房</div
            >
            <div class="flex" v-else>
              <Select
                v-model:value="model[field]"
                style="width: 52%"
                placeholder="请选择病房号"
                :options="freeRoomNumberOptions"
                allowClear
              />
              <span class="pl-2 pt-1">房</span>
              <div class="text-xs text-gray-400 pt-2 pl-4">提示：可选择范围1-20</div>
            </div>
          </template>
          <!-- 普通病房-病床数量 -->
          <template #bedNumberSlot="{ model, field }">
            <div v-if="isEdit" class="text-gray-400 ml-4">
              <span>{{ model[field] }}</span>
            </div>
            <div class="flex" v-else>
              <Select
                v-model:value="model[field]"
                style="width: 52%"
                placeholder="请选择病床数量"
                :options="options20"
                allowClear
              />
              <div class="text-xs text-gray-400 pt-2 pl-4">提示：可选择范围1-20</div>
            </div>
          </template>
        </BasicForm>
      </div>
    </BasicModal>
  </div>
</template>
<script lang="ts" setup>
  import { ref, computed, watch, h } from 'vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormSchema, FormProps } from '/@/components/Form/index';
  import { useUserStore } from '/@/store/modules/user';
  import { Select } from 'ant-design-vue';
  import { fileListProps } from '/@/components/Upload/src/props';
  import { useMessage } from '/@/hooks/web/useMessage';

  import { addICURoomApi, editICURoomApi } from '/@/api/ward/patient';
  import { ICUWardTreeRoomNode } from '/@/api/ward/model/patientModel';

  const isEdit = ref(false);
  const record = ref({} as ICUWardTreeRoomNode);
  const createdGeneralRoomNumber = ref<number[]>([]);

  const emit = defineEmits(['success', 'register']);

  const schemas: FormSchema[] = [
    {
      field: 'partition_name',
      component: 'Input',
      label: '所属病区',
      render: ({ model, field }) => {
        return h(
          'div',
          {
            class: 'text-gray-400 ml-4',
          },
          model[field] || '--',
        );
      },
    },
    {
      field: 'room_num',
      component: 'Select',
      label: '病房名称',
      required: () => !isEdit.value,
      slot: 'roomNumberSlot',
      colProps: {
        span: 18,
      },
    },
    {
      field: 'bed_num',
      component: 'Select',
      label: '病床数量',
      required: () => !isEdit.value,
      slot: 'bedNumberSlot',
      colProps: {
        span: 18,
      },
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
    },
  ];

  // 1-20个数字的下拉框options
  const options20 = Array.from({ length: 20 }, (_, i) => ({
    label: i + 1,
    value: i + 1,
  }));

  // 普通病房-空余房间号（未创建的房间号）下拉框options
  const freeRoomNumberOptions = computed(() => {
    return options20.filter((_, index) => !createdGeneralRoomNumber.value.includes(index + 1));
  });

  const { createMessage } = useMessage();
  const userStore = useUserStore();
  // 当前用户所处的病区的id
  let partition = computed(() => userStore.getCurrentPartition);

  const [
    register,
    { getFieldsValue, setFieldsValue, resetFields, validate, updateSchema, setProps },
  ] = useForm({
    labelWidth: 80,
    colon: true,
    showActionButtonGroup: false,
    schemas,
  });

  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    // 传递过来的值
    isEdit.value = data.isEdit;
    record.value = data.record;
    createdGeneralRoomNumber.value = data.createdGeneralRoomNumber;
    // 设置弹窗数据
    const title = isEdit.value ? '编辑病房信息' : '添加病房';
    setModalProps({
      title,
    });

    // 设置表单数据
    setFieldsValue({
      partition_name: partition.value.partition_name,
    });

    // 编辑时，数据回显
    if (isEdit.value) {
      setFieldsValue({
        room_num: data.record.order_num,
        bed_num: data.record.hospital_bed_num,
        remarks: data.record.remarks,
      });
    }
  });

  // 弹窗保存按钮点击事件
  async function handleSubmit() {
    // 表单验证
    await validate();
    const values = getFieldsValue();
    setModalProps({ // 按钮loading效果，提交数据后接口响应前 禁止重复点击
      confirmLoading: true,
    });
    if (isEdit.value) {
      saveEditData(values);
    } else {
      saveAddData(values);
    }
  }

  // 保存新增数据
  async function saveAddData(values) {
    const { room_num, bed_num, remarks } = values;
    try {
      let res = await addICURoomApi({
        partition_id: partition.value.id,
        is_kin: 0, // 探视病房
        room_num,
        bed_num,
        remarks,
      });
      if (res) {
        createMessage.success('添加成功');
        operateSuccess();
      }
    } catch (error) {
      operateError();
    }
  }

  // 保存编辑数据
  async function saveEditData(values) {
    const { room_num, remarks } = values;
    try {
      let res = await editICURoomApi({
        id: record.value.id,
        hospital_room_name: room_num,
        remarks,
      });
      if (res) {
        createMessage.success('编辑成功');
        operateSuccess();
      }
    } catch (error) {
      operateError();
    }
  }

  // 操作成功回调
  function operateSuccess() {
    setModalProps({
      confirmLoading: false,
      visible: false,
    });
    emit('success');
  }

  // 操作失败回调
  function operateError() {
    setModalProps({
      confirmLoading: false,
    });
  }

  // 弹窗取消按钮点击事件
  function handleCancel(val) {
    !val && resetFields();
  }
</script>
