import Vue from "vue";
import App from "./App.vue";
import vueCountryRegionSelect from "vue-country-region-select";
import "./quasar";

Vue.use(vueCountryRegionSelect);
Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");
