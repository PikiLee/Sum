import AppNotis from "../components/AppNotis.vue";
import { notier } from "./useNoti";
import type { App } from "vue";

interface Options {
  duration: number;
}

export default {
  install: (app: App, { duration }: Options) => {
    app.component("AppNotis", AppNotis);

    notier.setDuration(duration);

    app.config.globalProperties.$notier = notier;

    // const notis = ref([]);

    // function removeNoti(noti) {
    //   notis.value.splice(notis.value.indexOf(noti), 1);
    // }
    // app.config.globalProperties.$noti = {
    //   info: (message) => {
    //     const noti = {
    //       type: "info",
    //       message,
    //     };
    //     notis.value.push(noti);
    //     setTimeout(() => removeNoti(noti), 2000);
    //   },
    //   error: (message) => {
    //     const noti = {
    //       type: "error",
    //       message,
    //     };
    //     notis.value.push(noti);
    //     setTimeout(() => removeNoti(noti), 2000);
    //   },
    //   success: (message) => {
    //     const noti = {
    //       type: "success",
    //       message,
    //     };
    //     notis.value.push(noti);
    //     setTimeout(() => removeNoti(noti), 2000);
    //   },
    // };
  },
};
