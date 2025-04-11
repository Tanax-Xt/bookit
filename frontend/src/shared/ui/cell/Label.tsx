import { Dynamic, DynamicProps } from "@corvu/utils/dynamic";
import { ParentProps, ValidComponent, createEffect, onCleanup, splitProps } from "solid-js";

import { useCellPrivateContext } from "./context";
import styles from "./styles";

export type CellLabelBaseProps = ParentProps;

export type CellLabelSharedProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = "h3",
> = {
  /**
   * The `class` attribute of the group label element.
   */
  class: string | undefined;
};

export type CellLabelRenderProps = CellLabelSharedProps & {
  id: string | undefined;
};

export type CellLabelProps<T extends ValidComponent = "h3"> = CellLabelBaseProps & Partial<CellLabelSharedProps<T>>;

export const CellLabel = <T extends ValidComponent = "h3">(props: DynamicProps<T, CellLabelProps<T>>) => {
  const [variantProps, otherProps] = splitProps(props, ["class"]);

  const context = useCellPrivateContext();

  createEffect(() => {
    context.registerLabelId();
    onCleanup(() => context.unregisterLabelId());
  });

  return (
    <Dynamic<CellLabelRenderProps>
      as="h3"
      // === SharedProps ===
      class={styles().label(variantProps)}
      // === RenderProps ===
      id={context.labelId}
      {...otherProps}
    />
  );
};

export default CellLabel;
