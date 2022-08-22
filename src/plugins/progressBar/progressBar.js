import ProgressBar from "./ProgressBar.vue";
import { isProgressing, progressBar } from "./useProgressBar";
export default {
  install: (app, options) => {
    app.component("ProgressBar", ProgressBar);

    app.config.globalProperties = progressBar;

    app.provide("ProgressBar", {
      isProgressing,
      options,
    });
  },
};
