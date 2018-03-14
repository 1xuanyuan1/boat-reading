import App from './App.vue'
const mixins = require('../../mixins')
Vue.mixin(mixins)
App.el = '#root'
new Vue(App)
