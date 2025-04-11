import { Show } from "solid-js";

import { CurrentUserResponse, PlaceAvailableResponse } from "@/shared/api/types";
import { formatTime } from "@/shared/lib/date";
import Button from "@/shared/ui/button";
import Cell from "@/shared/ui/cell";
import Collapse from "@/shared/ui/collapse";
import DateTime from "@/shared/ui/date-time";
import Group from "@/shared/ui/group";

import IconIcRoundAccessTime from "~icons/ic/round-access-time";
import IconIcRoundCalendarMonth from "~icons/ic/round-calendar-month";
import IconIcRoundPerson from "~icons/ic/round-person";

type BookingPanelFormProps = {
  onCancel: VoidFunction;
  day: Date;
  time: [number, number];
  activeId?: string;
  user?: CurrentUserResponse;
  place?: PlaceAvailableResponse;
  error?: string;
  onSubmit: VoidFunction;
};

export const BookingPanelForm = (props: BookingPanelFormProps) => {
  return (
    <div class="flex grow flex-col space-y-4">
      <h2 class="text-xl font-semibold">{props.place?.name}</h2>

      <Show when={props.place?.is_available}>
        <Group>
          <Group.Content>
            <Cell>
              <div class="size-6 shrink-0 rounded-full bg-bg-positive" role="presentation" />
              <Cell.Group>
                <Cell.Label>Статус</Cell.Label>
              </Cell.Group>
              <Cell.Value>Доступно</Cell.Value>
            </Cell>
          </Group.Content>
        </Group>
      </Show>

      <Group>
        <Group.Content>
          <Cell>
            <IconIcRoundCalendarMonth class="size-6 shrink-0" role="presentation" />
            <Cell.Group>
              <Cell.Label>Дата</Cell.Label>
            </Cell.Group>
            <Cell.Value>
              <DateTime
                options={{
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }}
              >
                {new Date(props.day)}
              </DateTime>
            </Cell.Value>
          </Cell>
          <Cell>
            <IconIcRoundAccessTime class="size-6 shrink-0" role="presentation" />
            <Cell.Group>
              <Cell.Label>Время</Cell.Label>
            </Cell.Group>
            <Cell.Value>
              {formatTime(props.time[0])} – {formatTime(props.time[1])}
            </Cell.Value>
          </Cell>
        </Group.Content>
      </Group>

      <Group>
        <Group.Content>
          <Cell>
            <IconIcRoundPerson class="size-6 shrink-0" role="presentation" />
            <Cell.Group>
              <Cell.Label>Вместимость</Cell.Label>
            </Cell.Group>
            <Cell.Value>{props.place?.capacity}</Cell.Value>
          </Cell>
        </Group.Content>
      </Group>

      <Collapse>
        <Show when={props.error}>{(error) => <p class="text-sm text-fg-destructive">{error()}</p>}</Show>
      </Collapse>

      <div class="flex gap-2 max-lg:mt-auto max-lg:flex-col-reverse">
        <Button spacing="lg" variant="gray" appearance="secondary" onClick={props.onCancel} stretched>
          Отмена
        </Button>
        <Button
          spacing="lg"
          appearance="accent"
          disabled={!props.activeId || Boolean(props.error)}
          onClick={props.onSubmit}
          stretched
        >
          Забронировать
        </Button>
      </div>
    </div>
  );
};
