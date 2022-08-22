import AppNotis from "../components/AppNotis.vue";
import { notier, notis } from "./useNoti";
export default {
  install: (app, { duration }) => {
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

    app.provide("AppNotis", {
      notis,
    });
  },
};
