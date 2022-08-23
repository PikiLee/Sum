<script lang="ts">
import { h, defineComponent } from "vue";
import BaseTab from "../elements/BaseTab.vue";
import { gsap } from "gsap";
import { computed, Transition } from "vue";
export default defineComponent({
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
    const tabs = computed(() => {
      // slots.default?
      if (slots.default) {
        return slots.default();
      }
      return null;
    });

    const activeTab = computed(() => {
      if (tabs.value && tabs.value.length > 0) {
        return tabs.value[0].children[props.activeIndex];
      }

      return null;
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
          "onUpdate:activeIndex": (index: number) => emit("toggle", index),
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
});
</script>

<style lang="scss" scoped></style>
