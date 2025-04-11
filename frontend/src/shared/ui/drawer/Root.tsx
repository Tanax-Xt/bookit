import Drawer, { RootProps } from "@corvu/drawer";

const DrawerRoot = (props: RootProps) => {
  return <Drawer side="left" breakPoints={[0.2]} velocityFunction={(_, time) => (time > 150 ? 1 : 100)} {...props} />;
};

export default DrawerRoot;
