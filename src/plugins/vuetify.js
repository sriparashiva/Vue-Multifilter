import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#5e2121", // #E53935
        secondary: "#f1eded", // #FFCDD2
        accent: "#d1af83", // #3F51B5
      },
    },
  },
});
