import { Polymorphic, type PolymorphicProps } from "@kobalte/core/polymorphic";
import { mergeProps, splitProps, type ValidComponent } from "solid-js";
import { VariantProps } from "tailwind-variants";

import styles from "./styles";

export type SkeletonVariantProps = VariantProps<typeof styles>;

export type SkeletonRootBaseProps = {};

export type SkeletonRootSharedProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = "div",
> = {
  /**
   * The `role` attribute of the skeleton element.
   * @defaultValue `"alert"`
   */
  role: "alert" | undefined;

  /**
   * The `class` attribute of the skeleton element.
   */
  class: string | undefined;

  /**
   * The `aria-busy` attribute of the skeleton element.
   * @defaultValue `true`
   */
  "aria-busy": boolean | undefined;
};

export type SkeletonRootRenderProps = SkeletonRootSharedProps & {};

export type SkeletonRootProps<T extends ValidComponent = "div"> = SkeletonVariantProps &
  SkeletonRootBaseProps &
  Partial<SkeletonRootSharedProps<T>>;

const SkeletonRoot = <T extends ValidComponent = "div">(props: PolymorphicProps<T, SkeletonRootProps<T>>) => {
  const defaultedProps = mergeProps(
    {
      role: "alert" as const,
      "aria-busy": true,
    } satisfies Partial<SkeletonRootProps<T>>,
    props as SkeletonRootProps<T>,
  );

  const [variantProps, otherProps] = splitProps(defaultedProps, ["class", "opacity"]);

  return <Polymorphic<SkeletonRootRenderProps> as="div" class={styles(variantProps)} {...otherProps} />;
};

export default SkeletonRoot;
