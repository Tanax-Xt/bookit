import { Dynamic, DynamicProps } from "@corvu/utils/dynamic";
import { splitProps, ParentProps, ValidComponent } from "solid-js";

import styles from "./styles";

import IconIcRoundChevronRight from "~icons/ic/round-chevron-right";

export type CellChevronBaseProps = ParentProps;

export type CellChevronSharedProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = typeof IconIcRoundChevronRight,
> = {
  /**
   * The `class` attribute of the group label element.
   */
  class: string | undefined;
};

export type CellChevronRenderProps = CellChevronSharedProps;

export type CellChevronProps<T extends ValidComponent = typeof IconIcRoundChevronRight> = CellChevronBaseProps &
  Partial<CellChevronSharedProps<T>>;

export const CellChevron = <T extends ValidComponent = typeof IconIcRoundChevronRight>(
  props: DynamicProps<T, CellChevronProps<T>>,
) => {
  const [variantProps, otherProps] = splitProps(props, ["class"]);

  return (
    <Dynamic<CellChevronRenderProps>
      as={IconIcRoundChevronRight}
      // === SharedProps ===
      class={styles().chevron(variantProps)}
      // === RenderProps ===
      {...otherProps}
    />
  );
};

export default CellChevron;
