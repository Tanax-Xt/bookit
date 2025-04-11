import { Image, ImageRootProps } from "@kobalte/core/image";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { mergeProps, splitProps, ValidComponent } from "solid-js";
import { VariantProps } from "tailwind-variants";

import { parseInitials } from "@/shared/lib/case";
import { hash } from "@/shared/lib/hash";

import styles from "./styles";

export type AvatarRootBaseProps = {
  alt?: string;
  src?: string;
};

export type AvatarRootRenderProps = {
  class?: string;
};

export type AvatarRootVariantProps = VariantProps<typeof styles>;

export type AvatarRootProps<T extends ValidComponent = "span"> = ImageRootProps<T> &
  AvatarRootVariantProps &
  AvatarRootRenderProps &
  AvatarRootBaseProps;

const APPEARANCES = Object.keys(styles.variants.appearance) as (keyof typeof styles.variants.appearance)[];

const AvatarRoot = <T extends ValidComponent = "span">(props: PolymorphicProps<T, AvatarRootProps<T>>) => {
  const [imgProps, localProps, otherProps] = splitProps(
    props as AvatarRootProps,
    ["src", "alt"],
    ["class", "appearance"],
  );

  const variantProps = mergeProps({
    appearance:
      localProps.appearance ||
      (imgProps.alt ? APPEARANCES[Math.abs(hash(imgProps.alt)) % APPEARANCES.length] : undefined),
  } satisfies AvatarRootProps<T>);

  return (
    <Image class={styles().root({ ...variantProps, class: localProps.class })} {...otherProps}>
      <Image.Img class={styles().img(variantProps)} {...imgProps} />
      <Image.Fallback class={styles().fallback(variantProps)}>{parseInitials(imgProps.alt)}</Image.Fallback>
    </Image>
  );
};

export default AvatarRoot;
