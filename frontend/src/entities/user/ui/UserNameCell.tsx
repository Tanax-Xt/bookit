import { DynamicProps } from "@corvu/utils/dynamic";
import { ValidComponent } from "solid-js";

import Cell from "@/shared/ui/cell";

import IconIcRoundPerson from "~icons/ic/round-person";

export type UserNameCellProps = {
  name?: string | null | undefined;
};

export const UserNameCell = <T extends ValidComponent = typeof Cell>(props: DynamicProps<T, UserNameCellProps>) => {
  return (
    <Cell {...(props as UserNameCellProps)}>
      <IconIcRoundPerson class="size-6 shrink-0" role="presentation" />
      <Cell.Group>
        <Cell.Label>ФИО</Cell.Label>
      </Cell.Group>
      <Cell.Value>{props.name ?? "не указано"}</Cell.Value>
      <Cell.Chevron />
    </Cell>
  );
};
