import ProgressBar from "./ProgressBar.vue";
import { progressBar } from "./useProgressBar";

import type { App } from "vue";
export default {
  install: (app: App) => {
    app.component("ProgressBar", ProgressBar);

    app.config.globalProperties = progressBar;
  },
};
