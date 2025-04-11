import createRegister from "@corvu/utils/create/register";
import { Dynamic, DynamicProps } from "@corvu/utils/dynamic";
import { createMemo, createUniqueId, mergeProps, splitProps, ValidComponent } from "solid-js";

import { GroupContext, GroupPrivateContext } from "./context";
import styles, { GroupVariantProps } from "./styles";

export type GroupRootBaseProps = {
  /**
   * The `id` attribute of the group element.
   * @defaultValue `createUniqueId()`
   */
  groupId?: string;

  /**
   * The `id` attribute of the group label element.
   * @defaultValue `createUniqueId()`
   */
  labelId?: string;

  /**
   * The `id` attribute of the group description element.
   * @defaultValue `createUniqueId()`
   */
  descriptionId?: string;
};

export type GroupRootSharedProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = "div",
> = {
  /**
   * The `role` attribute of the group element.
   * @defaultValue `"group"`
   */
  role: "group" | "region" | undefined;

  /**
   * The `class` attribute of the group element.
   */
  class: string | undefined;
};

export type GroupRootRenderProps = GroupRootSharedProps & {
  id: string | undefined;
  "aria-labelledby": string | undefined;
  "aria-describedby": string | undefined;
};

export type GroupRootProps<T extends ValidComponent = "div"> = GroupVariantProps &
  GroupRootBaseProps &
  Partial<GroupRootSharedProps<T>>;

/**
 * A component for semantic grouping of content.
 */
export const GroupRoot = <T extends ValidComponent = "div">(props: DynamicProps<T, GroupRootProps<T>>) => {
  const defaultedProps = mergeProps(
    {
      role: "group" as const,
      groupId: createUniqueId(),
      labelId: createUniqueId(),
      descriptionId: createUniqueId(),
    } satisfies Partial<GroupRootProps<T>>,
    props as GroupRootProps<T>,
  );

  const [variantProps, localProps, otherProps] = splitProps(
    defaultedProps,
    ["class"],
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
    <GroupContext.Provider
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
      <GroupPrivateContext.Provider
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
        <Dynamic<GroupRootRenderProps>
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
      </GroupPrivateContext.Provider>
    </GroupContext.Provider>
  );
};

export default GroupRoot;
