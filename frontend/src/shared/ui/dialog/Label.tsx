import { Label, LabelProps, DynamicProps } from "@corvu/dialog";
import { JSX, splitProps, ValidComponent } from "solid-js";

import styles from "./styles";

export type DialogLabelProps<T extends ValidComponent = "h2"> = LabelProps<T> & JSX.StylableSVGAttributes;

const DialogLabel = <T extends ValidComponent = "h2">(props: DynamicProps<T, DialogLabelProps<T>>): JSX.Element => {
  const [variantProps, otherProps] = splitProps(props as DialogLabelProps, ["class"]);
  return <Label class={styles().label(variantProps)} {...otherProps} />;
};

export default DialogLabel;
