import { Dynamic, DynamicProps } from "@corvu/utils/dynamic";
import { FieldValues, FormStore, ResponseData } from "@modular-forms/solid";
import { createMemo, ParentProps, Show, splitProps, ValidComponent } from "solid-js";
import { VariantProps } from "tailwind-variants";

import Collapse from "../collapse";
import styles from "./styles";

export type FormResponseRootVariantProps = VariantProps<typeof styles>;

export type FormResponseRootBaseProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined,
> = {
  of: FormStore<TFieldValues, TResponseData>;
};

export type FormResponseRootSharedElementProps<
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  T extends ValidComponent = "p",
> = {
  class: string | undefined;
};

export type FormResponseRootElementProps = ParentProps<FormResponseRootSharedElementProps>;

export type FormResponseRootProps<
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined,
  T extends ValidComponent = "p",
> = FormResponseRootVariantProps &
  FormResponseRootBaseProps<TFieldValues, TResponseData> &
  Partial<FormResponseRootSharedElementProps<T>>;

const FormResponseRoot = <
  TFieldValues extends FieldValues,
  TResponseData extends ResponseData = undefined,
  T extends ValidComponent = "p",
>(
  props: DynamicProps<T, FormResponseRootProps<TFieldValues, TResponseData>>,
) => {
  const [localProps, variantProps, otherProps] = splitProps(
    props as FormResponseRootProps<TFieldValues, TResponseData>,
    ["of", "class"],
    styles.variantKeys,
  );

  const status = createMemo(() => localProps.of.response.status);
  const message = createMemo(() => localProps.of.response.message);

  return (
    <Collapse>
      <Show when={message()}>
        {(message) => (
          <Dynamic<FormResponseRootElementProps>
            as="p"
            // === SharedElementProps ===
            class={styles({ status: status(), ...variantProps, class: localProps.class })}
            {...otherProps}
          >
            {message()}
          </Dynamic>
        )}
      </Show>
    </Collapse>
  );
};

export default FormResponseRoot;
