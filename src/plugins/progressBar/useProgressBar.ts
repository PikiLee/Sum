import { ref } from "vue";

// 0: done 1: start 2: restart
type IsProgressing = 0 | 1 | 2;
export const isProgressing = ref<IsProgressing>(0);

export const progressBar = {
  start: () => {
    isProgressing.value = isProgressing.value === 1 ? 2 : 1;
  },
  done: () => {
    isProgressing.value = 0;
  },
};

export const useProgressBar = () => progressBar;
