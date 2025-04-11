import { Component, For, Show } from "solid-js";

import { ReservationCard } from "@/entities/reservation";
import { BookingResponse, RoleEnum } from "@/shared/api/types";
import { parseYYYYMMDDToDate } from "@/shared/lib/date";

export type ReservationListProps = {
  bookings: BookingResponse[] | undefined;
  role?: RoleEnum;
};

const groupBookingsByDate = (bookings: BookingResponse[]) => {
  const groupedBookings = [...bookings]
    .sort((a, b) => parseYYYYMMDDToDate(a.date).valueOf() - parseYYYYMMDDToDate(b.date).valueOf())
    .reduce(
      (acc, booking) => {
        const date = new Date(booking.date).toLocaleDateString("ru", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        if (!acc[date]) acc[date] = [];
        acc[date].push(booking);
        return acc;
      },
      {} as Record<string, BookingResponse[]>,
    );

  const sortedGroupedBookings = Object.keys(groupedBookings).reduce(
    (acc, date) => {
      acc[date] = groupedBookings[date]!.sort((a, b) => a.start_second - b.start_second);
      return acc;
    },
    {} as Record<string, BookingResponse[]>,
  );

  return sortedGroupedBookings;
};

export const ReservationList: Component<ReservationListProps> = (props) => {
  return (
    <div class="w-full space-y-4">
      <Show when={props.bookings}>
        {(bookings) => (
          <For each={Object.entries(groupBookingsByDate(bookings()))} fallback={<div>Нет букингов</div>}>
            {([date, bookings]) => (
              <div class="relative">
                <h5 class="sticky z-10 bg-bg-body py-3 text-xl font-bold max-lg:top-18 lg:top-0">{date}</h5>
                <div class="divide-y divide-bg-primary">
                  <For each={bookings}>{(booking) => <ReservationCard booking={booking} role={props.role} />}</For>
                </div>
              </div>
            )}
          </For>
        )}
      </Show>
    </div>
  );
};
