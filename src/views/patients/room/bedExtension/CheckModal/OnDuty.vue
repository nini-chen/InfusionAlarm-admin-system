<template>
  <div>
    <div class="pb-4 pt-1 font-bold">
      <Badge color="blue" text="值班医护信息" />
    </div>
    <div class="table w-full">
      <table
        class="w-full text-sm text-black text-opacity-80 bg-white border border-gray-300 border-b-0"
      >
        <tr class="flex py-3 border-b border-gray-300">
          <td class="flex-1 text-center">日期</td>
          <td class="flex-1 text-center" v-for="item of dateData" :key="item" :title="item">{{
            item
          }}</td>
        </tr>
        <tr class="flex py-3 border-b border-gray-300">
          <td class="flex-1 text-center">星期</td>
          <td class="flex-1 text-center" v-for="item of weeks" :key="item" :title="item">{{
            item
          }}</td>
        </tr>
        <tr class="flex py-3 border-b border-gray-300">
          <td class="flex-1 text-center">值班医生</td>
          <td class="flex-1 text-center" v-for="item of doctorData" :key="item" :title="item">{{
            item
          }}</td>
        </tr>
        <tr class="flex py-3 border-b border-gray-300">
          <td class="flex-1 text-center">值班护士</td>
          <td class="flex-1 text-center" v-for="item of nurseData" :key="item" :title="item">{{
            item
          }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { Badge } from 'ant-design-vue';
  import { getOnDutyApi } from '/@/api/patients/bedExtension';
  import { ICUBedListRecord } from '/@/api/patients/model/bedExtensionModel';
  import moment from 'moment';

  const props = defineProps({
    bedData: { type: Object as ICUBedListRecord, default: () => ({}) },
  });
  const defaultValue: string[] = new Array(7).fill('无');

  function setCurrentDays() {
    let result: string[] = [];
    for (let i = 1; i < 8; i++) {
      result?.push(moment().day(i).format('YYYY/MM/DD'));
    }
    return result;
  }

  const dateData = ref<string[]>([]);
  const doctorData = ref<string[]>([]);
  const nurseData = ref<string[]>([]);
  const weeks = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

  async function fetch() {
    dateData.value = [];
    doctorData.value = [];
    nurseData.value = [];
    console.log(props.bedData, {
      bed_id: props.bedData.bed_id,
      partition_id: props.bedData.partition_id,
    });
    const res = await getOnDutyApi({
      bed_id: props.bedData.bed_id,
      partition_id: props.bedData.partition_id,
    });
    if (res) {
      res.forEach((d) => {
        dateData.value.push(d?.date?.replaceAll('-', '/') || '无');
        doctorData.value.push(d.doctor.map((x) => x.staff_name).toString() || '无');
        nurseData.value.push(d.nurse.map((x) => x.staff_name).toString() || '无');
      });
    } else {
      dateData.value = setCurrentDays();
      doctorData.value = defaultValue;
      nurseData.value = defaultValue;
    }
  }
  onMounted(() => {
    fetch();
  });
</script>
