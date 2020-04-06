import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import firebase from "firebase";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;

const firebaseConfig = {
  apiKey: 'AIzaSyDMoejdgkSxvy2Lx0VZTkNc0mT1I1V_qVE',
  authDomain: 'fire-hue.firebaseapp.com',
  databaseURL: 'https://fire-hue.firebaseio.com',
  projectId: 'fire-hue',
  storageBucket: 'fire-hue.appspot.com',
  messagingSenderId: '54824235660',
  appId: '1:54824235660:web:5ff762418362cfe335c1a9'
};
firebase.initializeApp(firebaseConfig);



// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
