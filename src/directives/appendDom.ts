/**
 * 全局自定义转移dom指令
 * 指令必须传入需要转移到的目标dom的id值（请确保id唯一性）
 * @Example v-appendToDom="`targetId`" / v-append-to-dom="`targetId`"
 */
import type { App, Directive } from 'vue';

let tryCounts = 0;
const appendDomToTarget = (el, binding: any) => {
  setTimeout(() => {
    const value = binding.value;
    if (!value) return;
    const parentNode = document.getElementById(value);
    if (parentNode) {
      parentNode.innerHTML = '';
      parentNode.appendChild(el);
      el.style = 'display:inline-block;';
      tryCounts = 0;
    } else {
      if (tryCounts > 100) return;
      tryCounts++;
      appendDomToTarget(el, binding);
    }
  }, 50);
};

const appendDirective: Directive = {
  mounted(el, binding: any) {
    el.style = 'display:none;';
    appendDomToTarget(el, binding);
  },
  unmounted(el) {
    el.parentNode?.removeChild(el);
  },
};

export function setupAppendDomDirective(app: App) {
  app.directive('appendToDom', appendDirective);
}

export default appendDirective;
