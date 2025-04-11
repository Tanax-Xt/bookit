import { DynamicProps } from "@corvu/utils/dynamic";
import { ValidComponent } from "solid-js";

import Cell from "@/shared/ui/cell";

import IconIcRoundEmail from "~icons/ic/round-email";

export type UserEmailCellProps = {
  email?: string | null | undefined;
};

export const UserEmailCell = <T extends ValidComponent = typeof Cell>(props: DynamicProps<T, UserEmailCellProps>) => {
  return (
    <Cell {...(props as UserEmailCellProps)}>
      <IconIcRoundEmail class="size-6 shrink-0" role="presentation" />
      <Cell.Group>
        <Cell.Label>Почта</Cell.Label>
      </Cell.Group>
      <Cell.Value>{props.email ?? "не указано"}</Cell.Value>
      <Cell.Chevron />
    </Cell>
  );
};
