import { ParentComponent } from "solid-js";

import { Logo } from "@/widgets/nav";

const BareLayout: ParentComponent = (props) => {
  return (
    <div class="relative mx-auto flex min-h-dvh flex-col items-stretch justify-center">
      <Logo as="header" class="mb-4 self-start px-4 py-6 lg:px-7" />

      <div class="mx-auto flex w-full max-w-md grow flex-col items-center justify-center px-4 py-6 lg:px-7">
        <main class="relative flex w-full items-center justify-center">{props.children}</main>
      </div>

      <footer class="mt-4 flex w-full flex-col items-center gap-1 px-4 py-6 text-sm text-fg-tertiary lg:px-7">
        <span class="font-medium">{import.meta.env.APP_NAME}</span>
        <span>Версия {import.meta.env.APP_VERSION}</span>
      </footer>
    </div>
  );
};

export default BareLayout;
