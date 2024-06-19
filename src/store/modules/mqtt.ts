/** 对接mqtt协议，获取病床和病房状态 */

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { buildUUID } from '/@/utils/uuid';
import { getOfflineDevicesApi } from '/@/api/sys/menu';

export interface MqCallResRecord {
  timestamp: number; // 操作时间戳
  // sickbed床位事件 sos房间事件
  type: string; // bed 床位事件；room 房间事件
  // 病床id
  info_id: number;
  // 呼叫状态 取值 0/1/2/3/4/5/6 0--离线  1--空闲   2--护理中   3--呼叫增援   4--普通呼叫中  5--换药换液提醒中
  text: string; // type字段为room的时候，本字段返回正在报警的卫生间的提示
  status: number;
}

export interface MqOnlineResRecord {
  timestamp: number;
  // 设备id
  id: number;
  // 病床id
  bed_id: number;
  // IP地址
  ip: string;
  // MAC地址
  mac: string;
  // 0--离线1--在线（空闲）2--在线（忙碌）
  status: number;
  // 通道 取值 1-16，默认为0
  channel: number;
}

export interface MqResult {
  company: string;
  device_name: string;
  // 主题路径 （重要-用于判断是哪条协议）
  topic: string;
  // 具体的数据 （重要-用于页面交互）
  data: MqCallResRecord | MqOnlineResRecord[];
}

export interface MqttState {
  client: any;
  msg: Nullable<MqResult>;
  offDevicesCounts: number;
}

// 随机生成一个clientId格式： 'pc-17位数'
function getClientId(): string {
  const uuid = buildUUID().slice(-14);
  return `pc-${uuid}`;
}

// 离线设备的订阅地址
const deviceSubscribeUrl = '/device/web/get/#';

export const useMqttStore = defineStore({
  id: 'bed&room-mqtt',
  state: (): MqttState => ({
    client: null,
    msg: null,
    // 离线设备数量
    offDevicesCounts: 0,
  }),
  getters: {
    getOffDevicesCounts(): number {
      return this.offDevicesCounts;
    },
  },
  actions: {
    setOffDevicesCounts(counts: number) {
      this.offDevicesCounts = counts || 0;
    },
    // 获取离线设备
    async getAllOffDevices() {
      try {
        const { data_sum } = await getOfflineDevicesApi();
        data_sum && this.setOffDevicesCounts(data_sum);
      } catch (error) {
        console.log('获取离线设备失败', error);
      }
    },
    // 处理mqtt返回值
    checkoutResponse(msg: Nullable<MqResult>) {
      if (!msg) return;
      const { topic } = msg;
      switch (topic) {
        case '/device/web/get/status/change':
          this.getAllOffDevices();
          break;

        default:
          break;
      }
    },
    // 连接mqtt
    mqConnect() {
      const host = import.meta.env.DEV ? import.meta.env.VITE_GLOB_HOSTNAME : location.hostname;
      const port = 8083;
      const clientId = getClientId();

      const Paho = (window as any).Paho;
      this.client = new Paho.Client(host, port, clientId);
      // connect the client
      this.client.connect({
        timeout: 4000, // 连接超时时间/秒
        keepAliveInterval: 20, // 1800秒内没有活动自动断开连接 默认值为60秒 心跳
        cleanSession: true, // 如果为true(默认值)，则在成功连接时删除客户端和服务器持久化状态
        useSSL: false, // 如果存在且为true，则使用SSL Websocket连接
        invocationContext: {}, // 传递给onSuccess回调或onFailure回调

        reconnect: true, // 设置如果连接丢失，客户端是否自动尝试重新连接到服务器 如果设置为false，当连接丢失时，客户端将不会尝试自动重新连接到服务器。  如果设置为true，当连接丢失时，客户端将尝试重新连接服务器。 在尝试重新连接之前，它最初将等待1秒，对于每一次失败的重新连接尝试，延迟将加倍，直到达到2分钟，此时延迟将保持在2分钟。
        userName: 'test',
        password: '123456',
        // 连接mqtt成功后，订阅web端的离线设备数据通知
        onSuccess: () => {
          this.client.subscribe(deviceSubscribeUrl, {
            qos: 2,
          });
        },
        // 连接失败
        onFailure: (err) => {
          console.warn('Mqtt connection fail', err);
        },
      });

      // called when the client loses its connection
      this.client.onConnectionLost = (responseObject) => {
        if (responseObject.errorCode !== 0) {
          console.log('onConnectionLost:' + responseObject.errorMessage);
        }
      };
      // called when a message arrives
      this.client.onMessageArrived = (message) => {
        this.msg = {
          topic: message.topic,
          ...JSON.parse(message.payloadString),
        };
        // console.log('onMessageArrived:' + JSON.stringify(this.msg));
        this.checkoutResponse(this.msg);
      };
    },
    // 手动关闭
    close() {
      // 关闭离线设备的订阅
      // this.client?.unsubscribe(deviceSubscribeUrl, {});
      // 端开mqtt连接
      // this.client.isConnected() && this.client?.disconnect();
      this.client?.disconnect();
      this.client = null;
    },
  },
});

// Need to be used outside the setup
export function useMqttStoreWithOut() {
  return useMqttStore(store);
}
