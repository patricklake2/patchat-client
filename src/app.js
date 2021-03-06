import Vue from 'vue/dist/vue.runtime.esm';
import App from './components/App.vue';

export function init(el, siteId, opts = {}) {
  el.innerHTML = '<div id="patchat"></div>';
  new Vue({
    data: { siteId, opts },
    render: (h) => h(App),
  }).$mount('#patchat')
}