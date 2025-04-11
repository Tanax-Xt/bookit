import { Item, DropdownMenuItemProps as ItemProps } from "@kobalte/core/dropdown-menu";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { JSX, splitProps, ValidComponent } from "solid-js";

import styles from "./styles";

export type DropdownItemProps<T extends ValidComponent = "div"> = ItemProps<T> & JSX.StylableSVGAttributes;

const DropdownItem = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownItemProps<T>>,
): JSX.Element => {
  const [variantProps, otherProps] = splitProps(props as DropdownItemProps, ["class"]);
  return <Item class={styles().item(variantProps)} {...otherProps} />;
};

export default DropdownItem;
