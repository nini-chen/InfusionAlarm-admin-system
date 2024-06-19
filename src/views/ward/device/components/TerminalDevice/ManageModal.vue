<template>
  <div class="manage-modal">
    <BasicModal
      v-bind="$attrs"
      destroyOnClose
      @register="registerModal"
      @visible-change="handleCancel"
    >
      <div class="w-full">
        <BasicForm @register="register">
          <template #device_name="{ model, field }">
            <span class="text-gray-500">{{ model[field] ? model[field] : '--' }}</span>
          </template>
          <template #partition_name="{ model, field }">
            <span class="text-gray-500">{{ model[field] ? model[field] : '--' }}</span>
          </template>
          <template #device_code="{ model, field }">
            <span class="text-gray-500">{{ model[field] ? model[field] : '--' }}</span>
          </template>
          <template #device_mac="{ model, field }">
            <span class="text-gray-500">{{ model[field] ? model[field] : '--' }}</span>
          </template>
          <template #device_ip="{ model, field }">
            <div v-if="model[field]" class="flex">
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['ipAddress'].i"
                class="text-gray-500 inline-block w-40px"
              />
              <span class="spot">.</span>
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['ipAddress'].p"
                class="text-gray-500 inline-block w-40px"
              />
              <span class="spot">.</span>
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['ipAddress'].d"
                class="text-gray-500 inline-block w-40px"
              />
              <span class="spot">.</span>
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['ipAddress'].s"
                class="text-gray-500 inline-block w-40px"
              />
            </div>
            <div v-else> -- </div>
          </template>

          <template #device_subnet_mask="{ model, field }">
            <div v-if="model[field]" class="flex">
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['maskAddress'].i"
                class="text-gray-500 inline-block w-40px"
              />
              <span class="spot">.</span>
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['maskAddress'].p"
                class="text-gray-500 inline-block w-40px"
              />
              <span class="spot">.</span>
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['maskAddress'].d"
                class="text-gray-500 inline-block w-40px"
              />
              <span class="spot">.</span>
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['maskAddress'].s"
                class="text-gray-500 inline-block w-40px"
              />
            </div>
            <div v-else> -- </div>
          </template>

          <template #device_gateway="{ model, field }">
            <div v-if="model[field]" class="flex">
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['wayAddress'].i"
                class="text-gray-500 inline-block w-40px"
              />
              <span class="spot">.</span>
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['wayAddress'].p"
                class="text-gray-500 inline-block w-40px"
              />
              <span class="spot">.</span>
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['wayAddress'].d"
                class="text-gray-500 inline-block w-40px"
              />
              <span class="spot">.</span>
              <InputNumber
                :min="0"
                :max="255"
                :readonly="true"
                v-model:value="model['wayAddress'].s"
                class="text-gray-500 inline-block w-40px"
              />
            </div>
            <div v-else> -- </div>
          </template>
          <template #remarks="{ model, field }">
            <span class="text-gray-500">{{ model[field] ? model[field] : '--' }}</span>
          </template>
        </BasicForm>
      </div>

      <div class="w-full bg-gray-100 px-2 pt-3">
        <div class="titleTips text-gray-500">
          <div>绑定方式：填写【设备位置】【设备名称】【设备编号】并确认提交</div>
          <div>不绑定/解绑方式：不填写【设备位置】并提交</div>
        </div>
        <Tabs v-model:activeKey="tabActive" type="card" @change="handleChange">
          <TabPane key="1" tab="病床分机">
            <BasicTable :pagination="false" @register="registerTable" :canResize="false">
              <template #room_id="{ text, record, index, column }">
                <span
                  ><Select
                    placeholder="请选择"
                    v-model:value="record.room_id"
                    :fieldNames="{ label: 'hospital_room_name', value: 'id' }"
                    :options="record.roomOptions"
                    @change="roomChange($event, index, record.bed_id)"
                    allowClear
                    :getPopupContainer="getPopupContainer"
                  />
                  房
                  <Select
                    placeholder="请选择"
                    v-model:value="record.bed_id"
                    :fieldNames="{ label: 'hospital_bed_name', value: 'id' }"
                    :options="record.bedOptions"
                    @change="bedChange($event, index, record)"
                    allowClear
                    :getPopupContainer="getPopupContainer"
                  />
                  床</span
                >
              </template>

              <template #device_name="{ text, record, index, column }">
                <span><Input v-model:value="record.device_name" :maxlength="20" /></span>
              </template>

              <template #device_code="{ text, record, index, column }">
                <span><InputNumber v-model:value="record.device_code" :maxlength="15" /></span>
              </template>
            </BasicTable>
          </TabPane>
          <TabPane key="2" tab="洗手间报警按钮">
            <BasicTable :pagination="false" @register="registerTable2" :canResize="false">
              <template #device_local="{ text, record, index, column }">
                <span>
                  <Select
                    placeholder="请选择"
                    v-model:value="record.room_id"
                    :fieldNames="{ label: 'hospital_room_name', value: 'id' }"
                    :options="record.roomOptions"
                    allowClear
                    @dropdownVisibleChange="dropdownVisibleSos($event, index, record)"
                    @change="changeSos($event, index, record)"
                    :getPopupContainer="getPopupContainer"
                  />
                  房
                </span>
              </template>

              <template #device_name="{ text, record, index, column }">
                <span><Input v-model:value="record.device_name" :maxlength="20" /></span>
              </template>

              <template #device_code="{ text, record, index, column }">
                <span><InputNumber v-model:value="record.device_code" :maxlength="15" /></span>
              </template>
            </BasicTable>
          </TabPane>
        </Tabs>
        <div class="sendData bg-gray-100 px-2">
          <Button type="primary" @click="handleSubmit"> 确认 </Button>
        </div>
      </div>
    </BasicModal>

    <Modal
      v-model:visible="bindVisible"
      width="446"
      centered
      title="提示"
      okText="确认"
      :okButtonProps="{
        loading: isBinding,
      }"
      @ok="confirmBind"
    >
      <div class="px-24px py-30px">
        <div class="flex justify-center items-center">
          <Icon icon="ant-design:exclamation-circle-filled" color="#FF4F4F" size="23" />
          <span class="flex-1 rounded-sm ml-2 p-8px text-base leading-initial">
            {{
              tabActive == '1'
                ? `确认绑定 ${getListIndex()} 通道吗？`
                : `确认绑定 ${getListIndex()} 接口吗？`
            }}
          </span>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import moment from 'moment';
  import { ref, computed, nextTick, watch } from 'vue';
  import { Icon } from '/@/components/Icon';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { BasicTable, useTable } from '/@/components/Table';
  import { Tabs, TabPane, Select, Input, InputNumber, Button, Modal } from 'ant-design-vue';
  import { useUserStore } from '/@/store/modules/user';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { getPopupContainer } from '/@/utils';

  import { extensionList, modalFormSchemas, extensionSosList } from '../table.data';
  import {
    getDeviceSickbed,
    getDeviceSos,
    getAllHospitalBed,
    bindDeviceSickbed,
    bindDeviceSos,
  } from '/@/api/ward/equipment';
  import { getAllHospitalRoom } from '/@/api/ward/patient';

  const props = defineProps({
    type: { type: String, default: '' },
    active: { type: String, default: '1' },
  });

  defineEmits(['success', 'register']);

  const tabActive = ref('1');

  const bedList = ref<any>([]);
  const info = ref<any>({});
  const roomOptions = ref([]); //病床分机病房
  const sosRroomOptions = ref([]); //0报警按钮病房

  const policeList = ref<any>([]);

  const selectBedIds = ref<number[]>([]); //已经被选中保存了的床

  // 绑定提示
  const bindVisible = ref<boolean>(false);
  const isBinding = ref<boolean>(false); // 正在绑定中，需要禁止按钮重复点击
  let paramsData: any = ref('');

  const userStore = useUserStore();
  // 当前用户所处的病区的id
  const partitionId = computed(() => userStore.getCurrentPartition.id);

  const { createMessage } = useMessage();

  //表单
  const [register, { getFieldsValue, setFieldsValue, clearValidate, validate }] = useForm({
    labelWidth: 100,
    schemas: modalFormSchemas,
    colon: true,
    showActionButtonGroup: false,
  });

  //弹窗
  const [registerModal, { setModalProps, closeModal }] = useModalInner((data) => {
    info.value = data.data;
    setModalProps({
      title: '音频转发器管理',
      showCancelBtn: props.type == 'details' ? false : true,
      showOkBtn: false,
      cancelText: '关闭',
    });
    if (JSON.stringify(data) != '{}') {
      //设备IP
      let { device_ip, device_subnet_mask, device_gateway } = data.data;
      let obj = {
        i: device_ip?.split('.')[0],
        p: device_ip?.split('.')[1],
        d: device_ip?.split('.')[2],
        s: device_ip?.split('.')[3],
      };
      data.data = Object.assign(data.data, { ipAddress: obj });

      //子网掩码
      let mask = {
        i: device_subnet_mask?.split('.')[0],
        p: device_subnet_mask?.split('.')[1],
        d: device_subnet_mask?.split('.')[2],
        s: device_subnet_mask?.split('.')[3],
      };
      data.data = Object.assign(data.data, { maskAddress: mask });
      //网关
      let way = {
        i: device_gateway?.split('.')[0],
        p: device_gateway?.split('.')[1],
        d: device_gateway?.split('.')[2],
        s: device_gateway?.split('.')[3],
      };
      data.data = Object.assign(data.data, { wayAddress: way });
      setFieldsValue({
        id: data.data.id,
        device_name: data.data.device_name,
        partition_name: data.data.partition_name,
        device_code: data.data.device_code,
        device_ip: data.data.device_ip,
        ipAddress: data.data.ipAddress,
        maskAddress: data.data.maskAddress,
        wayAddress: data.data.wayAddress,
        device_mac: data.data.device_mac,
        remarks: data.data.remarks,
        device_gateway: data.data.device_gateway,
        device_subnet_mask: data.data.device_subnet_mask,
      });
    }

    //获取病房列表
    getRoomList();

    clearValidate();
  });

  watch(
    bedList,
    (newVal) => {
      if (newVal.length > 0) {
        selectBedIds.value = newVal.filter((v) => v.bed_id).map((s) => s.bed_id);
      }
    },
    {
      deep: true,
      immediate: true,
    },
  );

  //病床分机表格
  const [registerTable, { setLoading: setLoading1 }] = useTable({
    dataSource: bedList,
    columns: extensionList,
    useSearchForm: false,
    bordered: true,
    clickToRowSelect: false,
    showIndexColumn: false,
    rowKey: 'id',
  });

  //报警按钮表格
  const [registerTable2, { setLoading: setLoading2 }] = useTable({
    dataSource: policeList,
    columns: extensionSosList,
    useSearchForm: false,
    bordered: true,
    clickToRowSelect: false,
    showIndexColumn: false,
    rowKey: 'id',
  });

  //获取所有病房
  async function getRoomList() {
    let params = {
      partition_id: partitionId.value,
    };
    let res = await getAllHospitalRoom(params);
    let list = <any>[];
    res.forEach((v: { id: number; hospital_room_name: string }) => {
      let obj = {
        value: v.id,
        label: v.hospital_room_name.split('房')[0],
        disabled: false,
      };
      list.push(obj);
    });
    roomOptions.value = JSON.parse(JSON.stringify(list));
    sosRroomOptions.value = JSON.parse(JSON.stringify(list));

    if (props.active == '2') {
      tabActive.value = props.active;
      nextTick(() => {
        getSosList();
      });
    } else {
      //获取病床分机的列表
      getSickBedList();
    }
  }

  //获取病床分机
  async function getSickBedList() {
    setLoading1(true);
    const { id } = info.value;
    let params = {
      id,
    };
    let res = await getDeviceSickbed(params);
    res.forEach((v) => {
      if (v.room_id == 0) {
        v.room_id = null;
      }
      if (v.bed_id == 0) {
        v.bed_id = null;
      }
      v = Object.assign(v, { roomOptions: roomOptions.value, bedOptions: [] });
    });

    bedList.value = res;
    bedList.value.forEach(async (v, index) => {
      if (v.bed_id) {
        await getRoomBedList(v.room_id, index, v.bed_id);
      }
    });
    setLoading1(false);
  }

  //获取所有按钮报警器
  async function getSosList() {
    setLoading2(true);
    const { id } = info.value;
    let params = {
      id,
    };
    let res = await getDeviceSos(params);

    res.forEach((v) => {
      if (v.room_id == 0) {
        v.room_id = null;
      }
      v = Object.assign(v, { roomOptions: sosRroomOptions.value, bedOptions: [] });
    });
    policeList.value = res;
    setLoading2(false);
  }

  //病房变化
  function roomChange(value: any, index: any, bed_id: any) {
    bedList.value[index]['bed_id'] = null;
    bedList.value[index]['device_name'] = '';
    bedList.value[index]['device_code'] = '';
    bedList.value[index]['bedOptions'] = '';
    if (value) {
      getRoomBedList(value, index, bed_id);
    }
  }

  //选择病床的变化
  function bedChange(value: any, index: any, record: any) {
    if (value) {
      let roomName = record.roomOptions.find((v) => v.value == record.room_id)?.label;
      let bedName = record.bedOptions.find((v) => v.value == value)?.label;
      bedList.value[index]['device_name'] = `${roomName}房${bedName}床病房分机`;
      bedList.value[index]['device_code'] = moment().format('YYYYMMDDHHmmss');
    } else {
      bedList.value[index]['device_name'] = '';
      bedList.value[index]['device_code'] = '';
    }

    getRoomBedList(record.room_id, index, value);
  }

  //打开洗手间按钮报警下拉
  function dropdownVisibleSos(value: any, index: any, record: any) {
    //筛选出已经被选择了的房间
    // let selectRoom = policeList.value.filter((c) => c.room_id).map((s) => s.room_id);
    // unref(sosRroomOptions).forEach((v, inx) => {
    //   v.disabled = selectRoom.includes(v.value) ? true : false;
    // });

    policeList.value.forEach((v, inx) => {
      v['roomOptions'] = sosRroomOptions.value;
    });
  }

  //洗手间报警按钮的变化
  function changeSos(value: any, index: any, record: any) {
    if (value) {
      let roomName = record.roomOptions.find((v) => v.value == record.room_id)?.label;
      policeList.value[index]['device_name'] = `${roomName}房洗手间报警按钮`;
      policeList.value[index]['room_name'] = `${roomName}房`;
      policeList.value[index]['device_code'] = moment().format('YYYYMMDDHHmmss');
    } else {
      policeList.value[index]['device_name'] = '';
      policeList.value[index]['device_code'] = '';
    }
  }

  //根据病房获取病床
  async function getRoomBedList(room_id: number, index: number, bed_id: any) {
    let pamams = {
      partition_id: partitionId.value,
      room_id,
    };
    let res = await getAllHospitalBed(pamams);
    let list = <any>[];
    res.forEach((v: { id: any; hospital_bed_name: string; bed_id: any; is_bind: number }) => {
      let obj = {
        value: v.id,
        label: v.hospital_bed_name.split('床')[0],
        disabled: selectBedIds.value.includes(v.id) ? true : false,
      };

      list.push(obj);
    });

    //筛选出同一个病房然后更新他们的床位
    let newBedList = bedList.value.filter((v) => {
      if (room_id == v.room_id) {
        return v;
      }
    });

    //更改所有选择这个病房的病床列表
    bedList.value.forEach((v, inx) => {
      newBedList.forEach((item, ind) => {
        if (item.id == v.id) {
          v['bedOptions'] = list;
        }
      });
    });
  }

  // 获取已经选了病房的设备的通道（实际就table中的排列序号）
  function getListIndex() {
    let sortArray: string[] = [];
    if (paramsData.value) {
      paramsData.value.devicelist?.forEach((device, index) => {
        if (device.room_id && device.room_id > 0) {
          sortArray.push(`${index + 1}`);
        }
      });
    }
    return sortArray.toString().replaceAll(',', '、');
  }

  async function handleSubmit() {
    await validate();
    const { id } = getFieldsValue();
    //病床分机
    if (tabActive.value == '1') {
      let selectCode = false;
      let selectBed = false;
      bedList.value.forEach((v) => {
        if (v.room_id && !v.bed_id) {
          selectBed = true;
        }

        if (v.bed_id && (!v.device_code || !v.device_name)) {
          selectCode = true;
        }
      });

      if (selectBed) {
        createMessage.warning('病房和病床需要同时绑定');
        selectCode = false;
        return false;
      }

      //选中了列表就必须要填写设备编号
      if (selectCode) {
        createMessage.warning('病房分机需要设置设备名称和设备编号');
        selectCode = false;
        return false;
      }

      //绑定病床分机传输给后端的数据接口
      let devicelist = bedList.value.map((v) => {
        let obj = {
          device_id: v.id,
          device_code: v.bed_id ? v.device_code : '',
          room_id: v.room_id || 0,
          bed_id: v.bed_id || 0,
          flag: v.bed_id ? 1 : 0,
          device_name: v.bed_id ? v.device_name : '',
        };
        return obj;
      });

      let data = {
        switch_id: id,
        devicelist: devicelist,
      };
      paramsData.value = data;
      bindVisible.value = true;
    }

    //SOS报警器
    if (tabActive.value == '2') {
      let selectCode2 = false;
      policeList.value.forEach((v) => {
        if (v.room_id && (!v.device_code || !v.device_name)) {
          selectCode2 = true;
        }
      });

      //选中了列表就必须要填写设备编号
      if (selectCode2) {
        createMessage.warning('洗手间报警按钮需要设备名称和设备编号');
        selectCode2 = false;
        return false;
      }
      //绑定SOS报警器
      let sosList = policeList.value.map((v) => {
        let obj = {
          device_id: v.id,
          device_code: v.room_id ? v.device_code : '',
          room_id: v.room_id,
          room_name: v.room_name,
          device_name: v.room_id ? v.device_name : '',
        };
        return obj;
      });
      let params2 = {
        switch_id: id,
        devicelist: sosList,
      };

      paramsData.value = params2;
      bindVisible.value = true;
    }

    getListIndex();
  }

  function closeModelReset() {
    paramsData.value = '';
    bindVisible.value = false;
    isBinding.value = false;
    closeModal();
  }

  // 病床分机的绑定操作
  async function sureBindSickBed() {
    try {
      const res = await bindDeviceSickbed(paramsData.value);
      if (res.data === false) {
        bindVisible.value = false;
        isBinding.value = false;
        createMessage.error(res?.return_message || '操作失败');
      } else {
        createMessage.success('操作成功');
        getSickBedList();
        closeModelReset();
      }
    } catch (error) {
      createMessage.error('操作失败');
    } finally {
    }
  }

  // 卫生间报警绑定操作
  async function sureBindSos() {
    try {
      const res = await bindDeviceSos(paramsData.value);
      if (res.data === false) {
        bindVisible.value = false;
        isBinding.value = false;
        createMessage.error(res?.return_message || '操作失败');
      } else {
        createMessage.success('操作成功');
        getSosList();
        closeModelReset();
      }
    } catch (error) {
      createMessage.error('操作失败');
    } finally {
    }
  }

  // 确定绑定
  function confirmBind() {
    // 禁止重复点击
    if (isBinding.value) return;
    isBinding.value = true;

    switch (tabActive.value) {
      case '1':
        sureBindSickBed();
        break;
      case '2':
        sureBindSos();
        break;
      default:
        break;
    }
  }

  function handleChange(active: any) {
    if (active == 2) {
      //获取报警按钮的列表
      nextTick(() => {
        getSosList();
      });
    }
    if (!bedList || bedList.value.length == 0) {
      nextTick(() => {
        getSickBedList();
      });
    }
  }

  function handleCancel(val) {
    !val && (tabActive.value = '1');
  }
</script>

<style lang="less" scoped>
  :deep(.ant-form-item) {
    margin-bottom: 0;
  }

  :deep(.ant-select) {
    min-width: 90px;
  }

  :deep(.ant-input-number) {
    width: 60px;
    min-width: 60px;
    margin-right: 10px;
  }

  :deep(.ant-input-number-handler-wrap) {
    display: none;
  }

  :deep(.ant-tabs .ant-input-number) {
    width: 100%;
  }

  :deep(.ant-tabs-tab) {
    margin-right: 0 !important;
    border: none !important;
  }

  .sendData {
    position: absolute;
    bottom: 0;
    left: 14px;
    text-align: right;
    width: 98%;
    > button {
      width: 80px;
      border-radius: 3px;
      margin-right: 16px;
    }
  }

  .titleTips {
    width: 100%;
    text-align: right;
    height: 0;
    transform: translate(0, 0);
    font-size: 12px;
  }

  .spot {
    position: relative;
    left: -5px;
    top: 10px;
    font-weight: bold;
  }
</style>
