import { DynamicProps } from "@corvu/utils/dynamic";
import { ValidComponent } from "solid-js";

import Cell from "@/shared/ui/cell";

import IconIcRoundKey from "~icons/ic/round-key";

export type UserPasswordCellProps = {};

export const UserPasswordCell = <T extends ValidComponent = typeof Cell>(
  props: DynamicProps<T, UserPasswordCellProps>,
) => {
  return (
    <Cell {...(props as UserPasswordCellProps)}>
      <IconIcRoundKey class="size-6 shrink-0" role="presentation" />
      <Cell.Group>
        <Cell.Label>Пароль</Cell.Label>
      </Cell.Group>
      <Cell.Value class="font-mono">********</Cell.Value>
      <Cell.Chevron />
    </Cell>
  );
};
