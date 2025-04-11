import { Dynamic, DynamicProps } from "@corvu/utils/dynamic";
import { ComponentProps, JSX, splitProps, ValidComponent } from "solid-js";

import styles from "./styles";

export type DialogHeaderProps<T extends ValidComponent = "header"> = ComponentProps<T>;

const DialogHeader = <T extends ValidComponent = "header">(
  props: DynamicProps<T, DialogHeaderProps<T>>,
): JSX.Element => {
  const [variantProps, otherProps] = splitProps(props as DialogHeaderProps, ["class"]);
  return <Dynamic as="header" class={styles().header(variantProps)} {...otherProps} />;
};

export default DialogHeader;
