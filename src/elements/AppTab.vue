<script>
import { h } from "vue";
import BaseTab from "../elements/BaseTab.vue";
import { gsap } from "gsap";
import { computed, Transition } from "vue";
export default {
  props: {
    tabTitles: {
      type: Array,
      required: true,
    },
    activeIndex: {
      type: Number,
      required: true,
    },
  },
  emits: ["toggle"],
  setup(props, { emit, slots }) {
    // get the active tab
    const tabs = computed(() => slots.default()[0]);
    const activeTab = computed(() => {
      return tabs.value.children[props.activeIndex];
    });

    /**
     * Animation
     */

    function enter(el, done) {
      gsap.fromTo(
        el,
        {
          xPercent: 150,
        },
        {
          xPercent: 0,
          duration: 0.5,
          ease: "back(2)",
          onComplete: () => {
            done();
          },
        }
      );
    }

    function leave(el, done) {
      gsap.to(el, {
        xPercent: -150,
        duration: 0.5,
        onComplete: () => {
          done();
        },
      });
    }

    return () =>
      h("div", { class: ["p-1", "mt-2"] }, [
        h(BaseTab, {
          tabTitles: props.tabTitles,
          activeIndex: props.activeIndex,
          "onUpdate:activeIndex": (index) => emit("toggle", index),
        }),
        h("div", { class: ["mt-2"] }, [
          h(
            Transition,
            { mode: "out-in", onEnter: enter, onLeave: leave },
            () => h(activeTab.value)
          ),
        ]),
      ]);
  },
};
</script>

<style lang="scss" scoped></style>
