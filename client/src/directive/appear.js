export const appear = {
  beforeMount(element) {
    element.style.visibility = "hidden";
  },
  updated(element, binding, node) {
    if (!binding.value === !binding.oldValue || node.transition === null) {
      return;
    }

    if (!binding.value) {
      node.transition.leave(element, () => {
        element.style.visibility = "hidden";
      });
      return;
    }

    node.transition.beforeEnter(element);
    element.style.visibility = "";
    node.transition.enter(element);
  },
};
