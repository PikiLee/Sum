import { ref } from "vue";

// 0: done 1: start 2: restart
export const isProgressing = ref(0);

export const progressBar = {
  start: () => {
    isProgressing.value = isProgressing.value === 1 ? 2 : 1;
  },
  done: () => {
    isProgressing.value = 0;
  },
};

export const useProgressBar = () => progressBar
