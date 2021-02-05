import Vue from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import vueCountryRegionSelect from "vue-country-region-select";
import './quasar'

Vue.use(vueCountryRegionSelect);
Vue.config.productionTip = false;

new Vue({
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
