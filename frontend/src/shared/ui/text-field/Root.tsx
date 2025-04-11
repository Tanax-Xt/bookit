import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Description, ErrorMessage, Input, Label, Root, TextArea } from "@kobalte/core/text-field";
import { createEffect, createMemo, createSignal, JSX, mergeProps, Show, splitProps, ValidComponent } from "solid-js";
import { VariantProps } from "tailwind-variants";

import Clear from "../clear";
import Collapse from "../collapse";
import styles from "./styles";

export type TextFieldRootVariantProps = VariantProps<typeof styles>;

export type TextFieldRootBaseProps = {
  label?: JSX.Element;
  value?: string | undefined;
  description?: JSX.Element;
  error?: JSX.Element;
  multiline?: boolean;
  clearable?: boolean;
  before?: JSX.Element;
  after?: JSX.Element;
  onInput?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
};

export type TextFieldRootProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, "onInput"> &
  TextFieldRootVariantProps &
  TextFieldRootBaseProps;

const TextFieldRoot = <T extends ValidComponent = "div">(props: PolymorphicProps<T, TextFieldRootProps>) => {
  const defaultedProps = mergeProps(
    {
      value: "",
    } satisfies Partial<TextFieldRootProps>,
    props as TextFieldRootProps,
  );

  const [variantBaseProps, localProps, inputProps] = splitProps(
    defaultedProps,
    ["plain"],
    ["class", "value", "label", "description", "error", "multiline", "clearable", "before", "after"],
  );

  const variantProps = {
    ...variantBaseProps,
    required: inputProps.required,
  } satisfies TextFieldRootVariantProps;

  const [value, setValue] = createSignal<string>();
  const validationState = createMemo<"valid" | "invalid" | undefined>(() => (localProps.error ? "invalid" : undefined));

  createEffect(() => {
    setValue(localProps.value);
  });
  return (
    <Root
      id={inputProps.id}
      name={inputProps.name}
      value={value()}
      onChange={setValue}
      required={inputProps.required}
      disabled={inputProps.disabled}
      readOnly={inputProps.readOnly}
      validationState={validationState()}
      class={styles().root({ ...variantProps, class: localProps.class })}
      aria-label={typeof localProps.label === "string" ? localProps.label : inputProps.placeholder}
    >
      <Show when={localProps.label}>{(label) => <Label class={styles().label(variantProps)}>{label()}</Label>}</Show>

      <div class={styles().wrapper(variantProps)}>
        <Show when={localProps.before}>{(before) => <div class={styles().before(variantProps)}>{before()}</div>}</Show>

        <Show
          when={localProps.multiline}
          fallback={<Input class={styles().input(variantProps)} value={value()} {...inputProps} />}
        >
          <TextArea class={styles().input(variantProps)} autoResize value={value()} {...inputProps} />
        </Show>

        <Show when={localProps.after}>{(after) => <div class={styles().after(variantProps)}>{after()}</div>}</Show>

        <Show when={localProps.clearable && value()}>
          <Clear class={styles().after(variantProps)} />
        </Show>
      </div>

      <Show when={localProps.description}>
        {(description) => <Description class={styles().description(variantProps)}>{description()}</Description>}
      </Show>

      <Collapse>
        <ErrorMessage class={styles().error(variantProps)}>{localProps.error}</ErrorMessage>
      </Collapse>
    </Root>
  );
};

export default TextFieldRoot;
