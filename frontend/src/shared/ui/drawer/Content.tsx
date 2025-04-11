import Drawer, { ContentSharedElementProps, DynamicProps, ContentProps } from "@corvu/drawer";
import { Component, ParentProps, Show, splitProps, ValidComponent } from "solid-js";

import styles from "./styles";

const OVERLAY_DARKEN_PERCENTAGE = 0.5;

export type DrawerContentBaseProps = {};

export type DrawerContentSharedElementProps<T extends ValidComponent = "div"> = ContentSharedElementProps<T> &
  ParentProps<{
    class: string | undefined;
  }>;

export type DrawerContentElementProps = DrawerContentSharedElementProps;

export type DrawerContentProps<T extends ValidComponent = "div"> = ContentProps<T> &
  DrawerContentBaseProps &
  Partial<DrawerContentSharedElementProps<T>>;

const DrawerContent = <T extends ValidComponent = "div">(props: DynamicProps<T, DrawerContentProps>) => {
  const context = Drawer.useContext();

  const [localProps, otherProps] = splitProps(props as DrawerContentProps, ["class"]);

  return (
    <Drawer.Portal forceMount={otherProps.forceMount}>
      <Drawer.Overlay
        class={styles().overlay()}
        style={{
          "background-color": `rgb(0 0 0 / ${context.openPercentage() * OVERLAY_DARKEN_PERCENTAGE})`,
        }}
      />
      <Drawer.Content<Component<Omit<DrawerContentElementProps, keyof ContentSharedElementProps>>>
        as="div"
        // === SharedElementProps ===
        class={styles().content({ side: context.side(), class: localProps.class })}
        {...otherProps}
      >
        <Show when={context.side() === "bottom"}>
          <div class={styles().handle()} />
        </Show>

        {props.children}
      </Drawer.Content>
    </Drawer.Portal>
  );
};

export default DrawerContent;
