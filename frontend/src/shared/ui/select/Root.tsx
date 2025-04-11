import { PolymorphicProps } from "@kobalte/core/polymorphic";
import {
  Content,
  Description,
  ErrorMessage,
  HiddenSelect,
  Icon,
  Item,
  ItemIndicator,
  ItemLabel,
  Label,
  Listbox,
  Portal,
  Root,
  SelectRootProps as RootProps,
  Trigger,
  Value,
} from "@kobalte/core/select";
import { createEffect, createMemo, createSignal, JSX, Show, splitProps, ValidComponent } from "solid-js";
import { VariantProps } from "tailwind-variants";

import Button from "../button";
import Collapse from "../collapse";
import { styles as baseStyles } from "../text-field";
import styles from "./styles";

import IconIcRoundCheck from "~icons/ic/round-check";
import IconIcRoundClear from "~icons/ic/round-clear";
import IconIcRoundKeyboardArrowDown from "~icons/ic/round-keyboard-arrow-down";

export type SelectRootOption = {
  label: string;
  value: string;
  before?: JSX.Element;
  after?: JSX.Element;
};

export type SelectRootVariantProps = VariantProps<typeof baseStyles>;

export type SelectRootBaseProps = {
  name?: string;
  label?: JSX.Element;
  placeholder?: JSX.Element;
  description?: JSX.Element;
  value?: string | undefined;
  error?: JSX.Element;
  options: SelectRootOption[];
  clearable?: boolean | undefined;
  before?: JSX.Element;
  after?: JSX.Element;
};

export type SelectRootProps<T extends ValidComponent = "div"> = JSX.HTMLAttributes<HTMLSelectElement> &
  SelectRootVariantProps &
  SelectRootBaseProps &
  Omit<RootProps<T>, "multiple" | "options" | "value" | "onChange">;

const SelectRoot = <T extends ValidComponent = "div">(props: PolymorphicProps<T, SelectRootProps>) => {
  const [variantBaseProps, localProps, rootProps, selectProps] = splitProps(
    props as SelectRootProps,
    ["plain"],
    ["class", "before", "after"],
    ["placeholder", "options", "required", "disabled", "disallowEmptySelection", "allowDuplicateSelectionEvents"],
  );

  const variantProps = {
    ...variantBaseProps,
    required: rootProps.required,
  } satisfies SelectRootVariantProps;

  const [value, setValue] = createSignal<SelectRootOption>();
  const validationState = createMemo<"valid" | "invalid" | undefined>(() => (props.error ? "invalid" : undefined));

  createEffect(() => {
    setValue(props.options.find((option) => props.value === option.value));
  });

  return (
    <Root<SelectRootOption>
      modal
      gutter={4}
      value={value()}
      onChange={setValue}
      class={styles().root({ ...variantProps, class: localProps.class })}
      optionValue="value"
      optionTextValue="label"
      validationState={validationState()}
      itemComponent={(props) => (
        <Item class={styles().item(variantProps)} item={props.item}>
          <Show when={props.item.rawValue.before}>{(before) => <div class="me-1">{before()}</div>}</Show>
          <ItemLabel class="grow">{props.item.textValue}</ItemLabel>
          <ItemIndicator as={IconIcRoundCheck} class="size-5 text-fg-accent" />
          <Show when={props.item.rawValue.after}>{(after) => <div class="ms-1">{after()}</div>}</Show>
        </Item>
      )}
      aria-label={
        typeof selectProps.label === "string"
          ? selectProps.label
          : typeof rootProps.placeholder === "string"
            ? rootProps.placeholder
            : undefined
      }
      {...rootProps}
    >
      <Show when={props.label}>{(label) => <Label class={styles().label(variantProps)}>{label()}</Label>}</Show>

      <HiddenSelect {...selectProps} />

      <Trigger class={styles().wrapper(variantProps)}>
        <Show when={localProps.before}>{(before) => <div class={styles().before(variantProps)}>{before()}</div>}</Show>

        <Value<SelectRootOption> class={styles().input(variantProps)}>
          {(state) => (
            <>
              <span class="grow">{state.selectedOption().label}</span>
              <Show when={props.clearable}>
                <div class="-m-1.5 flex items-center pe-0.5">
                  <Button
                    aria-label="Очистить"
                    spacing="xs"
                    appearance="tertiary"
                    variant="gray"
                    tabIndex={-1}
                    onClick={state.clear}
                    onPointerDown={(e) => e.stopPropagation()}
                  >
                    <IconIcRoundClear class="size-5" />
                  </Button>
                </div>
              </Show>
            </>
          )}
        </Value>

        <Show when={localProps.after}>{(after) => <div class={styles().after(variantProps)}>{after()}</div>}</Show>

        <div class={styles().after({ ...variantProps, class: !variantProps.plain && "me-2" })}>
          <Icon as={IconIcRoundKeyboardArrowDown} class="size-5 text-fg-tertiary data-expanded:rotate-180" />
        </div>
      </Trigger>

      <Show when={props.description}>
        {(description) => <Description class={styles().description(variantProps)}>{description()}</Description>}
      </Show>

      <Collapse>
        <ErrorMessage class={styles().error(variantProps)}>{props.error}</ErrorMessage>
      </Collapse>

      <Portal>
        <Content class={styles().content(variantProps)}>
          <Listbox class={styles().listbox(variantProps)} />
        </Content>
      </Portal>
    </Root>
  );
};

export default SelectRoot;
