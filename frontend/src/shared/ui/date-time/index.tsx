import { useLocale } from "@kobalte/core/i18n";
import { Polymorphic, PolymorphicProps } from "@kobalte/core/polymorphic";
import { createMemo, splitProps, ValidComponent } from "solid-js";

export type DateTimeOptions = {
  children: Date;
  options: Intl.DateTimeFormatOptions;
};

export type DateTimeProps = DateTimeOptions;

export const DateTime = <T extends ValidComponent = "span">(props: PolymorphicProps<T, DateTimeProps>) => {
  const locale = useLocale();

  const [localProps, otherProps] = splitProps(props as DateTimeProps, ["children", "options"]);
  const value = createMemo(() =>
    new Intl.DateTimeFormat(locale.locale(), localProps.options).format(localProps.children),
  );

  return (
    <Polymorphic as="span" {...otherProps}>
      {value()}
    </Polymorphic>
  );
};

export default DateTime;
