import { Dynamic, DynamicProps } from "@corvu/utils/dynamic";
import { A } from "@solidjs/router";
import { ParentProps, splitProps, ValidComponent } from "solid-js";
import { tv } from "tailwind-variants";

export const styles = tv({
  slots: {
    root: [
      "relative flex gap-2 transition",
      "hover:opacity-75",
      "active:opacity-50 active:transition-none",
      "has-focus-visible:opacity-75",
    ],
    img: "size-6",
    a: "font-medium outline-none before:absolute before:inset-0",
  },
});

export type LogoElementProps = ParentProps<{
  class: string | undefined;
}>;

export type LogoProps = Partial<LogoElementProps>;

const Logo = <T extends ValidComponent = "div">(props: DynamicProps<T, LogoProps>) => {
  const [localProps, otherProps] = splitProps(props as LogoProps, ["class"]);

  return (
    <Dynamic<LogoElementProps> as="div" class={styles().root({ class: localProps.class })} {...otherProps}>
      <img src="/favicon.svg" alt="Логотип" class={styles().img()} />
      <A href="/" class={styles().a()}>
        BookIT
      </A>
    </Dynamic>
  );
};

export default Logo;
