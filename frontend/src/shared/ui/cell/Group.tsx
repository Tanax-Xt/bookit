import { Dynamic, DynamicProps } from "@corvu/utils/dynamic";
import { mergeProps, splitProps, ParentProps, ValidComponent } from "solid-js";

import styles from "./styles";

export type CellGroupBaseProps = ParentProps;

export type CellGroupSharedProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = "div",
> = {
  /**
   * The `role` attribute of the group element.
   * @defaultValue `"presentation"`
   */
  role: "group" | undefined;

  /**
   * The `class` attribute of the group content element.
   */
  class: string | undefined;
};

export type CellGroupRenderProps = CellGroupSharedProps;

export type CellGroupProps<T extends ValidComponent = "div"> = CellGroupBaseProps & Partial<CellGroupSharedProps<T>>;

export const CellGroup = <T extends ValidComponent = "div">(props: DynamicProps<T, CellGroupProps<T>>) => {
  const defaultedProps = mergeProps(
    {
      role: "group",
    } satisfies Partial<CellGroupProps<T>>,
    props as CellGroupProps<T>,
  );

  const [variantProps, otherProps] = splitProps(defaultedProps, ["class"]);

  return (
    <Dynamic<CellGroupRenderProps>
      as="div"
      // === SharedProps ===
      class={styles().group(variantProps)}
      // === RenderProps ===
      {...otherProps}
    />
  );
};

export default CellGroup;
