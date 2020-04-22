import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import vuegunui from '@/components/index.js'

Vue.config.productionTip = false

Vue.use(vuegunui)

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
