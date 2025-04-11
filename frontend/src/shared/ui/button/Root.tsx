import { ButtonRootRenderProps as RenderProps, Root, ButtonRootProps as RootProps } from "@kobalte/core/button";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Component, JSX, ParentProps, Show, splitProps, ValidComponent } from "solid-js";
import { VariantProps } from "tailwind-variants";

import styles from "./styles";

export type ButtonRootVariantProps = VariantProps<typeof styles>;

export type ButtonRootBaseProps = {
  before?: JSX.Element;
  after?: JSX.Element;
  loading?: boolean;
};

export type ButtonRootSharedElementProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = "button",
> = ParentProps<{
  class: string | undefined;
  disabled: boolean;
  "aria-busy": string | boolean | undefined;
}>;

export type ButtonRootElementProps = ButtonRootSharedElementProps;

export type ButtonRootProps<T extends ValidComponent = "button"> = RootProps<T> &
  ButtonRootVariantProps &
  ButtonRootBaseProps &
  Partial<ButtonRootSharedElementProps<T>>;

const ButtonRoot = <T extends ValidComponent = "button">(props: PolymorphicProps<T, ButtonRootProps<T>>) => {
  const [localProps, variantProps, otherProps] = splitProps(
    props as ButtonRootProps,
    ["children", "before", "after", "loading", "disabled", "class"],
    styles.variantKeys,
  );

  return (
    <Root<Component<Omit<ButtonRootElementProps, keyof RenderProps>>>
      as="button"
      // === SharedElementProps ===
      class={styles({ ...variantProps, class: localProps.class })}
      disabled={localProps.loading || localProps.disabled}
      aria-busy={localProps.loading}
      {...otherProps}
    >
      <Show when={localProps.before}>{(before) => <span role="presentation">{before()}</span>}</Show>
      <Show when={localProps.children}>{(children) => <span>{children()}</span>}</Show>
      <Show when={localProps.after}>{(after) => <span role="presentation">{after()}</span>}</Show>
    </Root>
  );
};

export default ButtonRoot;
