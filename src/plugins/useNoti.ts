import { ref } from "vue";

interface Noti {
  type: "info" | "success" | "error";
  message: string;
}

export const notis = ref<Noti[]>([]);

function removeNoti(noti: Noti) {
  notis.value.splice(notis.value.indexOf(noti), 1);
}

export const notier = {
  duration: 2000,
  setDuration: function (duration: number) {
    this.duration = duration;
  },
  info: function (message: string) {
    const noti: Noti = {
      type: "info",
      message,
    };
    notis.value.push(noti);
    setTimeout(() => removeNoti(noti), this.duration);
  },
  error: function (message: string) {
    const noti: Noti = {
      type: "error",
      message,
    };
    notis.value.push(noti);
    setTimeout(() => removeNoti(noti), this.duration);
  },
  success: function (message: string) {
    const noti: Noti = {
      type: "success",
      message,
    };
    notis.value.push(noti);
    setTimeout(() => removeNoti(noti), this.duration);
  },
};

export const useNoti = () => notier;
