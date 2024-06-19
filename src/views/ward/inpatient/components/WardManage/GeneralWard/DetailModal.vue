<template>
  <BasicModal
    title="病房详情"
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
  import { ref, computed } from 'vue';

  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { Description, DescItem, useDescription } from '/@/components/Description/index';
  import { useUserStore } from '/@/store/modules/user';
  const descriptionData = ref([]);
  const userStore = useUserStore();
  const partitionOptions = computed(() => userStore.getAllPartitions);
  // 当前用户所处的病区的id
  let partitionId = computed(() => userStore.getCurrentPartition.id);

  defineEmits(['register']);

  const schemaDescription: DescItem[] = [
    {
      field: 'partition_name',
      label: '所属病区',
      labelMinWidth: 100,
      contentMinWidth: 300,
      render: () => {
        const obj = partitionOptions.value.find((v) => v.id == partitionId.value);
        return obj?.partition_name || '--';
      },
    },
    {
      field: 'hospital_room_name',
      label: '病房名称',
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'hospital_bed_num',
      label: '病床数量',
      labelMinWidth: 100,
      contentMinWidth: 300,
    },
    {
      field: 'remarks',
      label: '备注',
      render: (curVal) => {
        return curVal ? curVal : '--';
      },
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
