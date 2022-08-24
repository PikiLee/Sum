import { createApp, h } from "vue";
import { createPinia } from "pinia";
import AppNotisPlugin from "./plugins/noti";
import { db } from "./db/db";
import materialData from "./db/materialData";
import { useTDEEStore } from "./stores/TDEE";
import ProgressBarPlugin from "./plugins/progressBar/progressBar";

import App from "./App.vue";
import router from "./router";

import "./assets/main.scss";

const app = createApp({
  render() {
    /**
     * Set up database
     */

    const materialDbVersion = Number(localStorage.getItem("materialDbVersion"));
    const currentVersion = 1.1;
    if (!materialDbVersion || materialDbVersion < currentVersion) {
      db.materials
        .bulkPut(materialData)
        .then(() =>
          localStorage.setItem("materialDbVersion", String(currentVersion))
        );
    }

    /**
     * Get TDEE from LocalStorage
     */
    const TDEEStore = useTDEEStore();

    const TDEE = Number(localStorage.getItem("TDEE"));
    TDEEStore.setTDEE(TDEE);

    return h(App);
  },
});

app.use(createPinia());
app.use(router);
app.use(AppNotisPlugin, { duration: 3000 });
app.use(ProgressBarPlugin);

/**
 * fontawesome icons
 */
/* import the fontawesome core */
import { library } from "@fortawesome/fontawesome-svg-core";

/* import font awesome icon component */
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

/* import specific icons */
import {
  faHouse,
  faLayerGroup,
  faGear,
  faXmark,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";

/* add icons to the library */
library.add(faHouse, faLayerGroup, faGear, faXmark, faChartSimple);

app.component("font-awesome-icon", FontAwesomeIcon);

app.mount("#app");
