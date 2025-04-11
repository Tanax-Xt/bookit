import { Dynamic, DynamicProps } from "@corvu/utils/dynamic";
import { ComponentProps, JSX, splitProps, ValidComponent } from "solid-js";

import styles from "./styles";

export type DialogFooterProps<T extends ValidComponent = "footer"> = ComponentProps<T>;

const DialogFooter = <T extends ValidComponent = "footer">(
  props: DynamicProps<T, DialogFooterProps<T>>,
): JSX.Element => {
  const [variantProps, otherProps] = splitProps(props as DialogFooterProps, ["class"]);
  return <Dynamic as="footer" class={styles().footer(variantProps)} {...otherProps} />;
};

export default DialogFooter;
