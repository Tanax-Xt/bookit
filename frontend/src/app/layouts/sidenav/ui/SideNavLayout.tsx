import { useBeforeLeave } from "@solidjs/router";
import { ParentComponent, Show } from "solid-js";

import { useBreakpoints } from "@/shared/lib/breakpoints";
import Button from "@/shared/ui/button";
import Drawer from "@/shared/ui/drawer";
import { Logo, Nav } from "@/widgets/nav";

import IconIcRoundMenu from "~icons/ic/round-menu";

const SideNavLayout: ParentComponent = (props) => {
  const breakpoints = useBreakpoints();

  return (
    <div class="relative mx-auto flex min-h-dvh flex-col items-stretch lg:flex-row">
      <Show
        when={!breakpoints.lg}
        fallback={
          <aside class="sticky top-0 h-dvh w-2xs max-w-2xs border-e border-r border-bg-primary px-4 py-6 pe-4">
            <Nav />
          </aside>
        }
      >
        <Drawer>
          {(context) => {
            useBeforeLeave(() => {
              if (context.open) {
                context.setOpen(false);
              }
            });

            return (
              <>
                <header class="sticky top-0 z-40 flex w-full items-center justify-between bg-bg-body p-4">
                  <Logo />

                  <Drawer.Trigger
                    as={Button}
                    shape="circle"
                    spacing="sm"
                    variant="ghost"
                    appearance="tertiary"
                    aria-label="Открыть навигацию"
                  >
                    <IconIcRoundMenu class="size-6" />
                  </Drawer.Trigger>
                </header>

                <Drawer.Content forceMount>
                  <Nav />
                </Drawer.Content>
              </>
            );
          }}
        </Drawer>
      </Show>

      <main class="flex grow flex-col px-4 pb-4 lg:mx-auto lg:max-w-3xl lg:py-4">{props.children}</main>
    </div>
  );
};

export default SideNavLayout;
