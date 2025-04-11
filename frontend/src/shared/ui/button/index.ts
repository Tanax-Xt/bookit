import Root, {
  ButtonRootBaseProps as RootBaseProps,
  ButtonRootElementProps as RootElementProps,
  ButtonRootProps as RootProps,
  ButtonRootSharedElementProps as RootSharedElementProps,
  ButtonRootVariantProps as RootVariantProps,
} from "./Root";
import styles from "./styles";

export type { RootBaseProps, RootElementProps, RootProps, RootSharedElementProps, RootVariantProps };

export { Root, styles };

const Button = Root;

export default Button;
