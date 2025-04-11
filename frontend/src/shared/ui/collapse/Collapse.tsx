import { ParentProps, splitProps } from "solid-js";
import { Transition } from "solid-transition-group";

import { createCollapseTransition } from "./transition";

export type CollapseRootProps = ParentProps<KeyframeAnimationOptions>;

const CollapseRoot = (props: CollapseRootProps) => {
  const [localProps, otherProps] = splitProps(props, [
    "composite",
    "delay",
    "direction",
    "duration",
    "easing",
    "endDelay",
    "fill",
    "id",
    "iterationComposite",
    "iterationStart",
    "iterations",
    "playbackRate",
    "pseudoElement",
    "timeline",
  ]);

  return <Transition {...createCollapseTransition(localProps)}>{otherProps.children}</Transition>;
};

export default CollapseRoot;
