import Root, {
  SkeletonRootBaseProps as RootBaseProps,
  SkeletonRootProps as RootProps,
  SkeletonRootRenderProps as RootRenderProps,
  SkeletonRootSharedProps as RootSharedProps,
} from "./Root";
import styles from "./styles";

export type { RootBaseProps, RootProps, RootRenderProps, RootSharedProps };

export { Root, styles };

const Skeleton = Root;

export default Skeleton;
