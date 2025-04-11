import {
  Close,
  CloseCorvuProps,
  CloseElementProps,
  CloseProps,
  CloseSharedElementProps,
  ContextValue,
  Root,
  RootChildrenProps,
  RootProps,
  Trigger,
  TriggerCorvuProps,
  TriggerElementProps,
  TriggerProps,
  TriggerSharedElementProps,
  useContext,
} from "@corvu/dialog";

import Content, { DialogContentProps as ContentProps } from "./Content";
import Description, { DialogDescriptionProps as DescriptionProps } from "./Description";
import Dismiss from "./Dismiss";
import Footer, { DialogFooterProps as FooterProps } from "./Footer";
import Header, { DialogHeaderProps as HeaderProps } from "./Header";
import Label, { DialogLabelProps as TitleProps } from "./Label";
import styles from "./styles";

export type {
  CloseCorvuProps,
  CloseElementProps,
  CloseProps,
  CloseSharedElementProps,
  ContentProps,
  ContextValue,
  DescriptionProps,
  FooterProps,
  HeaderProps,
  RootChildrenProps,
  RootProps,
  TitleProps,
  TriggerCorvuProps,
  TriggerElementProps,
  TriggerProps,
  TriggerSharedElementProps,
};

export { Close, Content, Description, Dismiss, Footer, Header, Label, Root, styles, Trigger, useContext };

const Dialog = Object.assign(Root, {
  Trigger,
  Content,
  Close,
  Dismiss,
  Header,
  Label,
  Description,
  Footer,
  useContext,
});

export default Dialog;
