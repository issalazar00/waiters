import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import vSelect from 'vue-select'
import './assets/main.css'
import './assets/tailwind.css'
import 'vue-select/dist/vue-select.css';
import 'bootstrap-icons/font/bootstrap-icons.css'
// import "bootstrap/dist/css/bootstrap.min.css"
import { TailwindPagination } from 'laravel-vue-pagination';

import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

import axios from 'axios'
import VueAxios from 'vue-axios'
axios.defaults.baseURL = 'http://restaurant.test/';


// const {createApp}
const app = createApp(App)
// app.use(createPinia())
app.use(router)
app.use(VueAxios, axios)
app.use(VueSweetalert2);
app.component('v-select', vSelect)
app.component('TailwindPagination', TailwindPagination)
app.mount('#app')

// import "bootstrap/dist/js/bootstrap.js"
// import $ from 'jquery'
// window.$ = $