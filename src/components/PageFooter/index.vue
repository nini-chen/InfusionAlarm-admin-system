

<template>
  <!-- v-if="props.total > props.size" -->
  <div class="pl-4 pr-4 h-12 bg-white flex justify-between items-center" v-if="props.total != 0">
    <div class="text-gray-500">
      <span>共{{ props.total }}条记录 </span>
      <span> 第{{props.page }} / {{ calc() }}页</span>
    </div>
    <a-pagination
      size="small"
      v-model:current="props.page"
      :total="props.total"
      :show-size-changer="!!calcPage(props.total).join()"
      :show-quick-jumper="calc() > 1"
      @showSizeChange="onShowSizeChange"
      @change="sizeChange"
      :pageSizeOptions="calcPage(props.total)"
    />
  </div>
</template>

<script lang="ts" setup>
  /*props*/
  interface Props {
    total: number;
    size: number;
    page: number;
  }
  const props = withDefaults(defineProps<Props>(), {
    total: 0,
    size: 0,
    page: 0,
  });

  /*emits*/
  const emit = defineEmits<{
    (e: 'onShowSizeChange', payload: any): void;
    (e: 'sizeChange', payload: any): void;
  }>();

  /*切换page和size*/
  function onShowSizeChange(current, size) {
    current == 0 && (current = 1);
    emit('onShowSizeChange', { current, size });
  }
  function sizeChange(page, pageSize) {
    page == 0 && (page = 1);
    emit('sizeChange', { page, pageSize });
  }

  /*计算*/
  function calc() {
    if (props.total == 0) return 1;
    return parseInt(props.total / props.size) + (props.total % props.size == 0 ? 0 : 1);
  }

  function calcPage(total) {
    total;
    // if (total < 10) return [''];
    // else if (total <= 20) return ['10'];
    // else if (20 <= total && total <= 50) return ['10', '20'];
    // else return ['10', '20', '50'];
    return ['10', '20', '50']
  }
</script>
