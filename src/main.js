import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vSelect from 'vue-select'
import './assets/main.css'
import './assets/tailwind.css'
import 'vue-select/dist/vue-select.css';

import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.baseURL = 'http://restaurant.test/';

// const {createApp}
const app = createApp(App)
// app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.component('v-select', vSelect)
app.mount('#app')

