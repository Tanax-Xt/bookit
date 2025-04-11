import { A, AnchorProps } from "@solidjs/router";
import { Component } from "solid-js";

import Button, { RootProps as ButtonRootProps } from "@/shared/ui/button";

export type NavLinkProps = ButtonRootProps & AnchorProps;

const NavLink: Component<NavLinkProps> = (props) => {
  return <Button as={A} align="start" variant="ghost" appearance="primary" stretched {...props} />;
};

export default NavLink;
