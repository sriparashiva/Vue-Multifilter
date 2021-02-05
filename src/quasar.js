import Vue from "vue";

import "./styles/quasar.scss";
import "@quasar/extras/material-icons/material-icons.css";
import { Quasar } from "quasar";

Vue.use(Quasar, {
  config: {
    brand: {
      primary: "#5e2121",
      secondary: "#776551",
      accent: "#d1af83",

      dark: "#5f4444",

      positive: "#b69d7e",
      negative: "#9c5c5c",
      info: "#f1eded",
      warning: "#f2ce9f",
    },
  },
  plugins: {},
  components: ["QSelect"],
});
