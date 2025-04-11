import { mergeRefs } from "@corvu/utils/reactivity";
import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { Popover } from "@kobalte/core/popover";
import { Description, ErrorMessage, Input, Label, Root } from "@kobalte/core/text-field";
import {
  JSX,
  Show,
  ValidComponent,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  on,
  splitProps,
} from "solid-js";
import { VariantProps } from "tailwind-variants";

import Calendar, { RootProps as CalendarRootProps } from "../calendar";
import ClearInputValueButton from "../clear";
import Collapse from "../collapse";
import DateTime from "../date-time";
import styles from "./styles";

export type DateFieldRootVariantProps = VariantProps<typeof styles>;

export type DateFieldRootBaseProps = {
  value?: string | number | Date;
  label?: JSX.Element;
  description?: JSX.Element;
  error?: JSX.Element;
  clearable?: boolean;
  before?: JSX.Element;
  after?: JSX.Element;
  options?: Omit<CalendarRootProps, "value" | "onValueChange">;
  closeOnValueChange?: boolean | undefined;
  onValueChange?: (value: Date | null) => void;
  onInput?: JSX.EventHandler<HTMLInputElement | HTMLTextAreaElement, InputEvent>;
};

export type DateFieldRootProps = JSX.InputHTMLAttributes<HTMLInputElement> &
  DateFieldRootVariantProps &
  DateFieldRootBaseProps;

export const DateFieldRoot = <T extends ValidComponent = "div">(
  props: PolymorphicProps<T, DateFieldRootProps>,
): JSX.Element => {
  const defaultedProps = mergeProps(
    {
      value: "",
    } satisfies Partial<DateFieldRootProps>,
    props,
  );

  const [variantBaseProps, localProps, inputProps] = splitProps(
    defaultedProps,
    ["plain"],
    [
      "ref",
      "class",
      "value",
      "label",
      "description",
      "placeholder",
      "error",
      "clearable",
      "before",
      "after",
      "options",
    ],
  );

  const variantProps = {
    ...variantBaseProps,
    required: inputProps.required,
  } satisfies DateFieldRootVariantProps;

  const [open, setOpen] = createSignal<boolean>(false);
  const [value, setValue] = createSignal<Date | null>(null);
  const [inputRef, setInputRef] = createSignal<HTMLInputElement | null>(null);
  const validationState = createMemo<"valid" | "invalid" | undefined>(() => (localProps.error ? "invalid" : undefined));

  const displayValue = createMemo(() => {
    const val = value();
    if (val === null) {
      return "";
    }

    const year = String(val.getFullYear()).padStart(4, "0");
    const month = String(val.getMonth() + 1).padStart(2, "0");
    const date = String(val.getDate()).padStart(2, "0");

    return `${year}-${month}-${date}`;
  });

  createEffect(() => {
    if (typeof props.value === "string" && props.value !== "") {
      setValue(new Date(Date.parse(props.value)));
    }
  });

  createEffect(
    on(
      value,
      () => {
        const input = inputRef();

        if (input === null) {
          return;
        }

        input.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
      },
      { defer: true },
    ),
  );

  return (
    <Popover open={open()} onOpenChange={setOpen} placement="bottom-end" gutter={8}>
      <Root
        id={inputProps.id}
        name={inputProps.name}
        required={inputProps.required}
        disabled={inputProps.disabled}
        readOnly={inputProps.readOnly}
        validationState={validationState()}
        class={styles().root({ ...variantProps, class: localProps.class })}
        aria-label={typeof localProps.label === "string" ? localProps.label : inputProps.placeholder}
      >
        <Show when={localProps.label}>{(label) => <Label class={styles().label(variantProps)}>{label()}</Label>}</Show>

        <Input
          type="date"
          ref={mergeRefs(localProps.ref, setInputRef)}
          class="sr-only"
          value={displayValue()}
          tabIndex={-1}
          {...inputProps}
        />

        <Popover.Trigger class={styles().wrapper(variantProps)} disabled={inputProps.disabled || inputProps.readOnly}>
          <Show when={localProps.before}>
            {(before) => <div class={styles().before(variantProps)}>{before()}</div>}
          </Show>

          <span class={styles().input()} data-placeholder-shown={value() === null ? true : undefined}>
            <Show when={value()} fallback={props.placeholder} keyed>
              {(value) => (
                <DateTime
                  options={{
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  }}
                >
                  {value}
                </DateTime>
              )}
            </Show>
          </span>

          <Show when={localProps.after}>{(after) => <div class={styles().after(variantProps)}>{after()}</div>}</Show>

          <Show when={localProps.clearable && value() !== null}>
            <ClearInputValueButton class={styles().after(variantProps)} onClear={() => setValue(null)} />
          </Show>
        </Popover.Trigger>

        <Show when={localProps.description}>
          {(description) => <Description class={styles().description(variantProps)}>{description()}</Description>}
        </Show>

        <Collapse>
          <ErrorMessage class={styles().error(variantProps)}>{localProps.error}</ErrorMessage>
        </Collapse>
      </Root>

      <Popover.Portal>
        <Popover.Content class={styles().content()}>
          <Calendar
            value={value()}
            onValueChange={(value) => {
              setValue(value);
              props.onValueChange?.(value);
              if (props.closeOnValueChange) {
                setOpen(false);
              }
            }}
            {...localProps.options}
          />
        </Popover.Content>
      </Popover.Portal>
    </Popover>
  );
};

export default DateFieldRoot;
