import '/@/design/index.less';
import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import 'virtual:windi-utilities.css';
// Register icon sprite
import 'virtual:svg-icons-register';
import App from './App.vue';
import { createApp } from 'vue';
import { initAppConfigStore } from '/@/logics/initAppConfig';
import { setupErrorHandle } from '/@/logics/error-handle';
import { router, setupRouter } from '/@/router';
import { setupRouterGuard } from '/@/router/guard';
import { setupStore } from '/@/store';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { registerGlobComp } from '/@/components/registerGlobComp';

// Importing on demand in local development will increase the number of browser requests by around 20%.
// This may slow down the browser refresh speed.
// Therefore, only enable on-demand importing in production environments .
if (import.meta.env.DEV) {
  import('ant-design-vue/dist/antd.less');
}
import uploader from 'vue-simple-uploader';
import 'vue-simple-uploader/dist/style.css';

async function bootstrap() {
  const app = createApp(App);

  // use uploader
  app.use(uploader);

  // 文件预览路径的前缀
  app.config.globalProperties.$filePrefix = import.meta.env.DEV
    ? import.meta.env.VITE_FILE_PREFIX
    : '';

  // Configure store
  setupStore(app);

  // Initialize internal system configuration
  initAppConfigStore();

  // Register global components
  registerGlobComp(app);

  // Multilingual configuration
  // Asynchronous case: language files may be obtained from the server side
  await setupI18n(app);

  // Configure routing
  setupRouter(app);

  // router-guard
  setupRouterGuard(router);

  // Register global directive
  setupGlobDirectives(app);

  // Configure global error handling
  setupErrorHandle(app);

  // https://next.router.vuejs.org/api/#isready
  // await router.isReady();

  app.mount('#app');
}

bootstrap();
