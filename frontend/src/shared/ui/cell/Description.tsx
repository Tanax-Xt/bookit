import { Dynamic, DynamicProps } from "@corvu/utils/dynamic";
import { ParentProps, ValidComponent, createEffect, onCleanup, splitProps } from "solid-js";

import { useCellPrivateContext } from "./context";
import styles from "./styles";

export type CellDescriptionBaseProps = ParentProps;

export type CellDescriptionSharedProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = "p",
> = {
  /**
   * The `class` attribute of the group label element.
   */
  class: string | undefined;
};

export type CellDescriptionRenderProps = CellDescriptionSharedProps;

export type CellDescriptionProps<T extends ValidComponent = "p"> = CellDescriptionBaseProps &
  Partial<CellDescriptionSharedProps<T>>;

export const CellDescription = <T extends ValidComponent = "p">(props: DynamicProps<T, CellDescriptionProps<T>>) => {
  const [variantProps, otherProps] = splitProps(props, ["class"]);

  const context = useCellPrivateContext();

  createEffect(() => {
    context.registerDescriptionId();
    onCleanup(() => context.unregisterDescriptionId());
  });

  return (
    <Dynamic<CellDescriptionRenderProps>
      as="p"
      // === SharedProps ===
      class={styles().description(variantProps)}
      // === RenderProps ===
      id={context.descriptionId}
      {...otherProps}
    />
  );
};

export default CellDescription;
