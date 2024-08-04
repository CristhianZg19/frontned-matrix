import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import 'bootstrap/dist/css/bootstrap.min.css';

// Importa Bootstrap JS
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createApp(App)
  .use(router)
  .use(store)
  .mount('#app');
