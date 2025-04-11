import { DynamicProps } from "@corvu/utils/dynamic";
import { ValidComponent } from "solid-js";

import Cell from "@/shared/ui/cell";

import IconIcRoundAlternativeEmail from "~icons/ic/round-alternate-email";

export type UserUsernameCellProps = {
  username: string;
};

export const UserUsernameCell = <T extends ValidComponent = typeof Cell>(
  props: DynamicProps<T, UserUsernameCellProps>,
) => {
  return (
    <Cell {...(props as UserUsernameCellProps)}>
      <IconIcRoundAlternativeEmail class="size-6 shrink-0" role="presentation" />
      <Cell.Group>
        <Cell.Label>Имя пользователя</Cell.Label>
      </Cell.Group>
      <Cell.Value>{props.username}</Cell.Value>
      <Cell.Chevron />
    </Cell>
  );
};
