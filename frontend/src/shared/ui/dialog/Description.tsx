import { Description, DescriptionProps, DynamicProps } from "@corvu/dialog";
import { JSX, splitProps, ValidComponent } from "solid-js";

import styles from "./styles";

export type DialogDescriptionProps<T extends ValidComponent = "p"> = DescriptionProps<T> & JSX.StylableSVGAttributes;

const DialogDescription = <T extends ValidComponent = "p">(
  props: DynamicProps<T, DialogDescriptionProps<T>>,
): JSX.Element => {
  const [variantProps, otherProps] = splitProps(props as DialogDescriptionProps, ["class"]);
  return <Description class={styles().description(variantProps)} {...otherProps} />;
};

export default DialogDescription;
