import createRegister from "@corvu/utils/create/register";
import { Dynamic, DynamicProps } from "@corvu/utils/dynamic";
import { createMemo, createUniqueId, mergeProps, ParentProps, splitProps, ValidComponent } from "solid-js";

import { CellContext, CellPrivateContext } from "./context";
import styles, { CellVariantProps } from "./styles";

export type CellRootBaseProps = ParentProps<{
  /**
   * The `id` attribute of the cell element.
   * @defaultValue `createUniqueId()`
   */
  groupId?: string;

  /**
   * The `id` attribute of the cell label element.
   * @defaultValue `createUniqueId()`
   */
  labelId?: string;

  /**
   * The `id` attribute of the cell description element.
   * @defaultValue `createUniqueId()`
   */
  descriptionId?: string;
}>;

export type CellRootSharedProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = "div",
> = {
  /**
   * The `role` attribute of the cell element.
   * @defaultValue `"group"`
   */
  role: "group" | "region" | undefined;

  /**
   * The `class` attribute of the group label element.
   */
  class: string | undefined;
};

export type CellRootRenderProps = CellRootSharedProps & {
  id: string | undefined;
  "aria-labelledby": string | undefined;
  "aria-describedby": string | undefined;
};

export type CellRootProps<T extends ValidComponent = "div"> = CellRootBaseProps &
  Partial<CellRootSharedProps<T>> &
  CellVariantProps;

export const CellRoot = <T extends ValidComponent = "div">(props: DynamicProps<T, CellRootProps<T>>) => {
  const defaultedProps = mergeProps(
    {
      role: "group" as const,
      groupId: createUniqueId(),
      labelId: createUniqueId(),
      descriptionId: createUniqueId(),
    } satisfies Partial<CellRootProps<T>>,
    props as CellRootProps<T>,
  );

  const [variantProps, localProps, otherProps] = splitProps(
    defaultedProps,
    ["class", "clickable"],
    ["role", "groupId", "labelId", "descriptionId"],
  );

  const groupId = createMemo(() => localProps.groupId);

  const [labelId, registerLabelId, unregisterLabelId] = createRegister({
    value: () => localProps.labelId,
  });

  const [descriptionId, registerDescriptionId, unregisterDescriptionId] = createRegister({
    value: () => localProps.descriptionId,
  });

  return (
    <CellContext.Provider
      value={{
        get role() {
          return localProps.role;
        },
        get groupId() {
          return groupId();
        },
        get labelId() {
          return labelId();
        },
        get descriptionId() {
          return descriptionId();
        },
      }}
    >
      <CellPrivateContext.Provider
        value={{
          get role() {
            return localProps.role;
          },
          get groupId() {
            return groupId();
          },
          get labelId() {
            return labelId();
          },
          registerLabelId,
          unregisterLabelId,
          get descriptionId() {
            return descriptionId();
          },
          registerDescriptionId,
          unregisterDescriptionId,
        }}
      >
        <Dynamic<CellRootRenderProps>
          as="div"
          // === SharedProps ===
          role={localProps.role}
          class={styles().root(variantProps)}
          // === RenderProps ===
          id={groupId()}
          aria-labelledby={labelId()}
          aria-describedby={descriptionId()}
          {...otherProps}
        />
      </CellPrivateContext.Provider>
    </CellContext.Provider>
  );
};

export default CellRoot;
