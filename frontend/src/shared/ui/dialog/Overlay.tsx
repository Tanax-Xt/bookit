import { DynamicProps, Overlay, OverlayProps } from "@corvu/dialog";
import { JSX, splitProps, ValidComponent } from "solid-js";

import styles from "./styles";

export type DialogOverlayProps<T extends ValidComponent = "div"> = OverlayProps<T> & JSX.StylableSVGAttributes;

const DialogOverlay = <T extends ValidComponent = "div">(
  props: DynamicProps<T, DialogOverlayProps<T>>,
): JSX.Element => {
  const [variantProps, otherProps] = splitProps(props as DialogOverlayProps, ["class"]);
  return <Overlay class={styles().overlay(variantProps)} {...otherProps} />;
};

export default DialogOverlay;
