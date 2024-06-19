<template>
  <BasicModal
    title="详情"
    v-bind="$attrs"
    @register="register"
    cancelText="关闭"
    :showOkBtn="false"
    destroyOnClose
  >
    <div class="pt-3px pr-3px min-h-200px">
      <Description :column="1" :data="descriptionData" :schema="schemaDescription" />
    </div>
  </BasicModal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description, DescItem, useDescription } from '/@/components/Description/index';
  import { getDeviceClassifyName } from '/@/views/ward/device/components/table.data';

  const customEmptyRender = (curVal) => (curVal ? curVal : '--');

  const descriptionData = ref([]);
  const schemaDescription: DescItem[] = [
    {
      field: 'device_type',
      label: '设备类型',
      render: (curVal) => getDeviceClassifyName(curVal),
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'room_name',
      label: '设备位置',
      show: ({ device_type }) => {
        return device_type == 'doorway';
      },
      render: customEmptyRender,
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'device_name',
      label: '设备名称',
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      // 走廊屏的默认显示文字
      field: 'default_word',
      label: '默认显示文字',
      show: ({ device_type }) => {
        return device_type == 'passageway';
      },
      render: customEmptyRender,
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'partition_name',
      label: '所属病区',
      labelMinWidth: 100,
      contentMinWidth: 300,
    },

    {
      // 安卓版病床分机-房
      show: ({ device_type }) => {
        return device_type == 'apk_sickbed';
      },
      field: 'room_name',
      label: '房',
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      // 安卓版病床分机-床
      show: ({ device_type }) => {
        return device_type == 'apk_sickbed';
      },
      field: 'bed_name',
      label: '床',
      labelMinWidth: 100,
      contentMinWidth: 300,
    },

    {
      field: 'device_code',
      label: '设备编号',
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'width',
      label: '像素宽度',
      show: ({ device_type }) => {
        return device_type == 'passageway';
      },
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'height',
      label: '像素高度',
      show: ({ device_type }) => {
        return device_type == 'passageway';
      },
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'device_ip',
      label: 'IP地址',
      labelMinWidth: 100,
      contentMinWidth: 300,
      render: customEmptyRender,
    },
    {
      field: 'device_subnet_mask',
      label: '子网掩码',
      labelMinWidth: 100,
      contentMinWidth: 300,
      render: customEmptyRender,
    },
    {
      field: 'device_gateway',
      label: '网关',
      labelMinWidth: 100,
      contentMinWidth: 300,
      render: customEmptyRender,
    },
    {
      field: 'device_mac',
      label: 'MAC地址',
      labelMinWidth: 100,
      contentMinWidth: 300,
      render: customEmptyRender,
    },
    {
      field: 'remarks',
      label: '备注',
      render: customEmptyRender,
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
  ];

  useDescription({
    title: 'useDescription',
    data: descriptionData,
    schema: schemaDescription,
  });

  defineEmits(['register']);

  const [register, {}] = useModalInner((data) => {
    descriptionData.value = data.record;
  });
</script>
