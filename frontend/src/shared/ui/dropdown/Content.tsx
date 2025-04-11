import { Content, DropdownMenuContentProps as ContentProps, Portal } from "@kobalte/core/dropdown-menu";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { JSX, ParentProps, splitProps, ValidComponent } from "solid-js";

import styles from "./styles";

export type DropdownContentProps<T extends ValidComponent = "div"> = ParentProps<
  ContentProps<T> & JSX.StylableSVGAttributes
>;

const DropdownContent = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DropdownContentProps<T>>,
): JSX.Element => {
  const [variantProps, otherProps] = splitProps(props as DropdownContentProps, ["class"]);
  return (
    <Portal>
      <Content class={styles().content(variantProps)} {...otherProps}>
        {props.children}
      </Content>
    </Portal>
  );
};

export default DropdownContent;
