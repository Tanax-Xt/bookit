import Content, {
  GroupContentBaseProps as ContentBaseProps,
  GroupContentProps as ContentProps,
  GroupContentRenderProps as ContentRenderProps,
  GroupContentSharedProps as ContentSharedProps,
} from "./Content";
import Description, {
  GroupDescriptionBaseProps as DescriptionBaseProps,
  GroupDescriptionProps as DescriptionProps,
  GroupDescriptionRenderProps as DescriptionRenderProps,
  GroupDescriptionSharedProps as DescriptionSharedProps,
} from "./Description";
import Label, {
  GroupLabelBaseProps as LabelBaseProps,
  GroupLabelProps as LabelProps,
  GroupLabelRenderProps as LabelRenderProps,
  GroupLabelSharedProps as LabelSharedProps,
} from "./Label";
import Root, {
  GroupRootBaseProps as RootBaseProps,
  GroupRootProps as RootProps,
  GroupRootRenderProps as RootRenderProps,
  GroupRootSharedProps as RootSharedProps,
} from "./Root";
import useContext, { GroupContextValue as ContextValue } from "./context";
import styles, { GroupVariantProps as VariantProps } from "./styles";

export type {
  ContentBaseProps,
  ContentProps,
  ContentRenderProps,
  ContentSharedProps,
  ContextValue,
  DescriptionBaseProps,
  DescriptionProps,
  DescriptionRenderProps,
  DescriptionSharedProps,
  LabelBaseProps,
  LabelProps,
  LabelRenderProps,
  LabelSharedProps,
  RootBaseProps,
  RootProps,
  RootRenderProps,
  RootSharedProps,
  VariantProps,
};

export { Content, Description, Label, Root, styles, useContext };

const Group = Object.assign(Root, {
  Content,
  Description,
  Label,
  useContext,
});

export default Group;
