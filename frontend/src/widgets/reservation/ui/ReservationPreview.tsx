import MapPage from "@/entities/map/ui/MapPage";
import { getRoleDisplayName } from "@/entities/user";
import { BookingResponse, UserResponse } from "@/shared/api/types";
import { formatTime } from "@/shared/lib/date";
import Avatar from "@/shared/ui/avatar";
import Cell from "@/shared/ui/cell";
import DateTime from "@/shared/ui/date-time";
import Group from "@/shared/ui/group";

import IconIcRoundAccessTime from "~icons/ic/round-access-time";
import IconIcRoundCalendarMonth from "~icons/ic/round-calendar-month";
import IconIcRoundPinDrop from "~icons/ic/round-pin-drop";

export type ReservationPreviewProps = {
  booking: BookingResponse;
  user: UserResponse;
};

export const ReservationPreview = (props: ReservationPreviewProps) => {
  return (
    <div class="space-y-4">
      <Group>
        <Group.Label>Посетитель</Group.Label>
        <Group.Content>
          <Cell>
            <Avatar alt={props.user.username} class="size-6 shrink-0 text-xs" />
            <Cell.Group>
              <Cell.Label>{props.user.username}</Cell.Label>
            </Cell.Group>
            <Cell.Value>{getRoleDisplayName(props.user.role)}</Cell.Value>
          </Cell>
        </Group.Content>
      </Group>

      <Group>
        <Group.Label>Бронирование</Group.Label>
        <Group.Content>
          <Cell>
            <IconIcRoundPinDrop class="size-6 shrink-0" role="presentation" />
            <Cell.Group>
              <Cell.Label>Место</Cell.Label>
            </Cell.Group>
            <Cell.Value>{props.booking.place.name}</Cell.Value>
          </Cell>
        </Group.Content>
      </Group>

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
                {new Date(props.booking.date)}
              </DateTime>
            </Cell.Value>
          </Cell>
          <Cell>
            <IconIcRoundAccessTime class="size-6 shrink-0" role="presentation" />
            <Cell.Group>
              <Cell.Label>Время</Cell.Label>
            </Cell.Group>
            <Cell.Value>
              {formatTime(props.booking.start_second)} – {formatTime(props.booking.end_second)}
            </Cell.Value>
          </Cell>
        </Group.Content>
      </Group>

      

      <MapPage booking={props.booking} isPreviewPage />
    </div>
  );
};
