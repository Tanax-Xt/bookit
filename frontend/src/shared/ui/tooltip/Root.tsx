import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Content, Portal, Root, TooltipRootProps as RootProps, Trigger } from "@kobalte/core/tooltip";
import { JSX, ParentProps, splitProps, ValidComponent } from "solid-js";
import { VariantProps } from "tailwind-variants";

import styles from "./styles";

export interface TooltipRootBaseProps {
  value: JSX.Element;
}

export type TooltipRootVariantProps = VariantProps<typeof styles>;

export type TooltipRootProps = ParentProps<RootProps & TooltipRootBaseProps & TooltipRootVariantProps>;

const TooltipRoot = <T extends ValidComponent = "div">(props: PolymorphicProps<T, TooltipRootProps>) => {
  const [localProps, rootProps, otherProps] = splitProps(
    props as TooltipRootProps,
    ["value", "children"],
    [
      "arrowPadding",
      "closeDelay",
      "defaultOpen",
      "detachedPadding",
      "disabled",
      "placement",
      "fitViewport",
      "flip",
      "forceMount",
      "getAnchorRect",
      "gutter",
      "hideWhenDetached",
    ],
  );

  return (
    <Root gutter={8} placement="top" {...rootProps}>
      <Trigger as="div" {...otherProps}>
        {localProps.children}
      </Trigger>
      <Portal>
        <Content class={styles().content()}>{localProps.value}</Content>
      </Portal>
    </Root>
  );
};

export default TooltipRoot;
