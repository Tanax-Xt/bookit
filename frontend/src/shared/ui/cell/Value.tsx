import { Dynamic, DynamicProps } from "@corvu/utils/dynamic";
import { splitProps, ParentProps, ValidComponent, mergeProps } from "solid-js";

import styles from "./styles";

export type CellValueBaseProps = ParentProps;

export type CellValueSharedProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = "span",
> = {
  /**
   * The `role` attribute of the cell value element.
   * @defaultValue `"presentation"`
   */
  role: "presentation" | undefined;

  /**
   * The `class` attribute of the group label element.
   */
  class: string | undefined;
};

export type CellValueRenderProps = CellValueSharedProps;

export type CellValueProps<T extends ValidComponent = "span"> = CellValueBaseProps & Partial<CellValueSharedProps<T>>;

export const CellValue = <T extends ValidComponent = "span">(props: DynamicProps<T, CellValueProps<T>>) => {
  const defaultedProps = mergeProps(
    {
      role: "presentation" as const,
    } satisfies Partial<CellValueProps<T>>,
    props as CellValueProps<T>,
  );

  const [variantProps, localProps, otherProps] = splitProps(defaultedProps, ["class"], ["role"]);

  return (
    <Dynamic<CellValueRenderProps>
      as="span"
      // === SharedProps ===
      role={localProps.role}
      class={styles().value(variantProps)}
      // === RenderProps ===
      {...otherProps}
    />
  );
};

export default CellValue;
