import { TransitionProps } from "solid-transition-group";

export const COLLAPSED_PROPERTIES = {
  opacity: 0,
  height: 0,
  marginTop: 0,
  marginBottom: 0,
  paddingTop: 0,
  paddingBottom: 0,
  borderTopWidth: 0,
  borderBottomWidth: 0,
  scale: 0.98,
};

const animateExit = (element: Element, done: VoidFunction, options: KeyframeAnimationOptions) => {
  element
    .animate(
      [
        {
          height: `${element.getBoundingClientRect().height}px`,
        },
        COLLAPSED_PROPERTIES,
      ],
      options,
    )
    .finished.then(done);
};

const animateEnter = (element: Element, done: VoidFunction, options: KeyframeAnimationOptions) => {
  element
    .animate(
      [
        COLLAPSED_PROPERTIES,
        {
          height: `${element.getBoundingClientRect().height}px`,
        },
      ],
      options,
    )
    .finished.then(done);
};

export const createCollapseTransition = (options: KeyframeAnimationOptions): TransitionProps => {
  options = { duration: 200, ...options };

  return {
    mode: "outin",
    onExit: (element: Element, done: VoidFunction) => animateExit(element, done, { easing: "ease-out", ...options }),
    onEnter: (element: Element, done: VoidFunction) => animateEnter(element, done, { easing: "ease-out", ...options }),
  };
};
