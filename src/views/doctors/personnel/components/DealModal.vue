<template>
  <BasicModal
    v-bind="$attrs"
    @register="register"
    :destroy-on-close="true"
    @visible-change="handleVisibleChange"
    @ok="validateForm"
  >
    <div class="person-deal-modal pt-3px pr-6">
      <BasicForm ref="formElRef" @register="registerForm">
        <!-- 上传头像 -->
        <template #uploadItem="{ model, field }">
          <UploadImg v-model:value="model[field]" />
          <p style="color: #969799; font-size: 12px; margin-left: -48px; margin-right: -42px"
            >提示：为保证最佳显示效果，请上传一寸证件照； 照片大小不超过5Mb；支持JPG/JPEG/PNG格式</p
          >
        </template>

        <template #staffTypeItem="{ model, field }">
          <span v-if="editId">{{ setPersonTypeLabel(model[field]) }}</span>
          <Select
            v-else
            allowClear
            v-model:value="model[field]"
            :options="personTypeOptions"
            @change="handleStaff"
            placeholder="请选择人员类型"
          />
        </template>

        <template #positionItem="{ model, field }">
          <Select
            allowClear
            v-model:value="model[field]"
            :options="positionOptions"
            placeholder="请选择职级"
            @change="handlePosition"
          />
        </template>

        <template #sexItem="{ model, field }">
          <Select
            allowClear
            v-model:value="model[field]"
            :options="maleOptions"
            @change="handleSex"
            placeholder="请选择性别"
          />
        </template>
      </BasicForm>
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm, FormActionType } from '/@/components/Form/index';
  import { Select } from 'ant-design-vue';

  import UploadImg from './UploadImg.vue';
  import { dealModalSchemas, personTypeOptions, maleOptions, defaultAvatars } from './config.data';
  import { addPersonApi, editPersonApi } from '/@/api/doctors/personnel';
  import { getPositionSelectApi } from '/@/api/doctors/personnel';

  const { createMessage } = useMessage();
  const emit = defineEmits(['success', 'register']);
  const editId = ref<string>('');
  const partitionName = ref<string>('');
  const positionOptions = ref<LabelValueOptions>([]);
  const formElRef = ref<Nullable<FormActionType>>(null);

  const [
    registerForm,
    { setFieldsValue, validateFields, resetFields, updateSchema, clearValidate, getFieldsValue },
  ] = useForm({
    schemas: dealModalSchemas,
    labelWidth: 90,
    baseColProps: {
      span: 12,
    },
    colon: true,
    showActionButtonGroup: false,
  });

  const [register, { setModalProps }] = useModalInner((data) => {
    data && onDataReceive(data);
  });

  async function onDataReceive(data) {
    setModalProps({
      title: data.isUpdate ? '编辑医护人员' : '添加医护人员',
    });
    // 编辑的时候, 禁止修改医护人员类型
    updateSchema([{ field: 'staff_type', required: !data.isUpdate }]);
    editId.value = '';
    if (data.isUpdate) {
      const { id, staff_partition_id, partition_name, staff_type, staff_position_id, staff_age } =
        data.record;
      editId.value = id;
      partitionName.value = partition_name;
      // 设置表单选项的值
      setFieldsValue(data.record);
      // 单独设置职级的值（注意：职级select的value值、select框的options的value值都要设置成字符串类型）
      setFieldsValue({
        staff_partition_id,
        staff_position_id: String(staff_position_id),
        staff_age: staff_age == 0 ? null : staff_age,
      });
      // 获取职级选项的options值
      setPositionOptions(staff_type);
    }
  }

  function handleVisibleChange(v) {
    !v && resetFields();
  }

  // 表单验证通过后，直接post数据
  async function handleSubmit(formValues) {
    try {
      if (editId.value) {
        formValues = {
          ...formValues,
          staff_age: formValues.staff_age == null ? 0 : formValues.staff_age,
          id: editId.value,
        };
        await editPersonApi(formValues);
      } else {
        await addPersonApi(formValues);
      }
      createMessage.success('操作成功');
      setModalProps({
        confirmLoading: false,
        visible: false,
      });
      emit('success');
    } catch (error) {
      setModalProps({
        confirmLoading: false,
      });
    }
  }

  // 提交数据前的表单验证
  async function validateForm() {
    setModalProps({
      confirmLoading: true,
    });
    try {
      const res = await validateFields();
      handleSubmit(res);
    } catch (error) {
      console.log('not passing', error);
      setModalProps({
        confirmLoading: false,
      });
    }
  }

  /**
   * 设置默认头像
   * @description: 默认头像图片有4种组合，由医护人员类型（医生/护士）、性别（男/女）， 这2组属性值决定
   */
  function setDefaultAvatar() {
    const formValues = getFieldsValue();
    // 如果类型、性别都有值（默认头像路径由这2值组成）
    const hasFullPath = formValues.staff_type && formValues.staff_sex;
    // 如果头像路径是空（默认初始化时）或 原来的头像是默认头像（如果新增时，头像没有设置，后端也会返回默认头像）
    const isDefaultAvatar =
      !formValues.staff_avatar || defaultAvatars.includes(formValues.staff_avatar);
    // 设置默认头像路径
    if (hasFullPath && isDefaultAvatar) {
      setFieldsValue({
        staff_avatar: `/static_field/default/icon_${formValues.staff_type}_${formValues.staff_sex}.png`,
      });
    }
  }

  // 设置医护人员选项的文本值
  function setPersonTypeLabel(type: number) {
    if (!type) return '无';
    const match = personTypeOptions.filter((x) => x.value == type);
    return match ? match[0].label : '无';
  }

  /**
   * @description: 获取职级表单项select框的options
   * @param typeVal 人员类型id
   */
  async function setPositionOptions(typeVal: number) {
    const result = await getPositionSelectApi(typeVal);
    // 注意：职级select的value值、select框的options的value值都要设置成字符串类型
    positionOptions.value = result?.map((x) => {
      return { value: String(x.id), label: x.position_name };
    });
  }

  /**
   * 人员类型change事件
   * 注意：根据人员类型的值, 获取对应的职级数据，这2个select框是联动的
   */
  function handleStaff(typeVal) {
    // 设置职级的options
    setPositionOptions(typeVal);
    // 重置职级的值
    setFieldsValue({
      staff_position_id: undefined,
    });
    // 消除职级由于重置引出的警告提示
    clearValidate('staff_position_id');
    validateFields('staff_type');
    // 判断是否需要设置默认头像
    setDefaultAvatar();
  }

  // 选择职级
  function handlePosition() {
    clearValidate('staff_position_id');
    validateFields('staff_position_id');
  }

  // 选择性别
  function handleSex() {
    // 判断是否需要设置默认头像
    setDefaultAvatar();
    validateFields('staff_sex');
  }
</script>
<style lang="less">
  .person-deal-modal {
    .ant-input-number {
      width: 188px;
    }

    .ant-col.ant-col-12 {
      &:nth-child(3),
      &:nth-child(4),
      &:nth-child(5) {
        position: absolute;
        right: 13px;
      }

      &:nth-child(3) {
        top: 72px;
      }

      &:nth-child(4) {
        top: 124px;
      }

      &:nth-child(5) {
        top: 178px;
      }

      .ant-select,
      .ant-form-item-control-input {
        width: 184px;
      }
    }
  }
</style>
