import { Content, ContentProps, Portal, DynamicProps } from "@corvu/dialog";
import { JSX, ParentProps, splitProps, ValidComponent } from "solid-js";

import Overlay from "./Overlay";
import styles from "./styles";

export type DialogContentProps<T extends ValidComponent = "div"> = ContentProps<T> &
  ParentProps &
  JSX.StylableSVGAttributes;

const DialogContent = <T extends ValidComponent = "div">(
  props: DynamicProps<T, DialogContentProps<T>>,
): JSX.Element => {
  const [variantProps, otherProps] = splitProps(props as DialogContentProps, ["class"]);

  return (
    <Portal>
      <Overlay />
      <Content class={styles().content(variantProps)} {...otherProps} />
    </Portal>
  );
};

export default DialogContent;
