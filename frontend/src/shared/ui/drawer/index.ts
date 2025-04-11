import {
  Close,
  CloseCorvuProps,
  CloseElementProps,
  CloseProps,
  CloseSharedElementProps,
  ContextValue,
  Description,
  DescriptionCorvuProps,
  DescriptionElementProps,
  DescriptionProps,
  DescriptionSharedElementProps,
  DialogContextValue,
  Label,
  LabelCorvuProps,
  LabelElementProps,
  LabelProps,
  LabelSharedElementProps,
  RootChildrenProps,
  RootProps,
  Trigger,
  TriggerCorvuProps,
  TriggerElementProps,
  TriggerProps,
  TriggerSharedElementProps,
  useContext,
  useDialogContext,
} from "@corvu/drawer";

import Content, {
  DrawerContentBaseProps as ContentBaseProps,
  DrawerContentElementProps as ContentElementProps,
  DrawerContentProps as ContentProps,
  DrawerContentSharedElementProps as ContentSharedElementProps,
} from "./Content";
import Root from "./Root";
import styles from "./styles";

export type {
  CloseCorvuProps,
  CloseElementProps,
  CloseProps,
  CloseSharedElementProps,
  ContentBaseProps,
  ContentElementProps,
  ContentProps,
  ContentSharedElementProps,
  ContextValue,
  DescriptionCorvuProps,
  DescriptionElementProps,
  DescriptionProps,
  DescriptionSharedElementProps,
  DialogContextValue,
  LabelCorvuProps,
  LabelElementProps,
  LabelProps,
  LabelSharedElementProps,
  RootChildrenProps,
  RootProps,
  TriggerCorvuProps,
  TriggerElementProps,
  TriggerProps,
  TriggerSharedElementProps,
};

export { Close, Content, Description, Label, Root, styles, Trigger, useContext, useDialogContext };

const Drawer = Object.assign(Root, {
  Close,
  Content,
  Description,
  Label,
  Trigger,
  useContext,
  useDialogContext,
});

export default Drawer;
