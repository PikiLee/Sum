import { ref } from "vue";

export const notis = ref([]);

function removeNoti(noti) {
  notis.value.splice(notis.value.indexOf(noti), 1);
}

export const notier = {
  duration: 2000,
  setDuration: function (duration) {
    this.duration = duration;
  },
  info: function (message) {
    const noti = {
      type: "info",
      message,
    };
    notis.value.push(noti);
    setTimeout(() => removeNoti(noti), this.duration);
  },
  error: function (message) {
    const noti = {
      type: "error",
      message,
    };
    notis.value.push(noti);
    setTimeout(() => removeNoti(noti), this.duration);
  },
  success: function (message) {
    const noti = {
      type: "success",
      message,
    };
    notis.value.push(noti);
    setTimeout(() => removeNoti(noti), this.duration);
  },
};

export const useNoti = () => notier;
