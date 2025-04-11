import { Cell, CellTrigger, HeadCell, Label, Nav, Root, RootSingleProps, Table } from "@corvu/calendar";
import { useLocale } from "@kobalte/core/i18n";
import { createEffect, createMemo, Index, mergeProps, splitProps } from "solid-js";

import { capitalize } from "@/shared/lib/case";

import Button from "../button";
import DateTime from "../date-time";
import Select from "../select";
import styles from "./styles";

import ChevronLeft from "~icons/ic/round-chevron-left";
import ChevronRight from "~icons/ic/round-chevron-right";

export type CalendarRootBaseProps = {
  yearSelectOffset?: number;
};

export type CalendarRootProps = Omit<RootSingleProps, "children" | "mode"> & CalendarRootBaseProps;

const CalendarRoot = (props: CalendarRootProps) => {
  const locale = useLocale();

  const defaultedProps = mergeProps(
    {
      yearSelectOffset: 20,
    } satisfies Partial<CalendarRootProps>,
    props,
  );

  const [localProps, otherProps] = splitProps(defaultedProps, ["yearSelectOffset"]);

  const TODAY_DATE = new Date();

  const { format: formatMonth } = new Intl.DateTimeFormat(locale.locale(), {
    month: "long",
  });

  const { format: formatWeekdayLong } = new Intl.DateTimeFormat(locale.locale(), {
    weekday: "long",
  });

  return (
    <Root mode="single" {...otherProps}>
      {(context) => {
        const months = createMemo(() => {
          const months = [];
          for (let month = 0; month < 12; month++) {
            const newDate = new Date(context.month);
            newDate.setMonth(month);
            months.push({
              value: month.toString(),
              label: capitalize(formatMonth(newDate)),
            });
          }
          return months;
        });

        const years = createMemo(() => {
          const currentYear = context.month.getFullYear();
          const startYear = currentYear - localProps.yearSelectOffset;
          const endYear = currentYear + localProps.yearSelectOffset;

          return Array.from({ length: endYear - startYear + 1 }, (_, index) => startYear + index).map((year) => ({
            value: year.toString(),
            label: year.toString(),
          }));
        });

        createEffect(() => {
          if (context.value !== null) {
            context.setFocusedDay(context.value);
          } else {
            context.setFocusedDay(TODAY_DATE);
          }
        });

        return (
          <>
            <div class={styles().header()}>
              <Label class={styles().label()}>
                <Select
                  plain
                  value={context.month.getMonth().toString()}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    if (value === "") {
                      return;
                    }
                    const newDate = new Date(context.month);
                    newDate.setMonth(Number(value));
                    if (newDate.valueOf() !== context.month.valueOf()) {
                      context.setMonth(newDate);
                    }
                  }}
                  options={months()}
                />
                <Select
                  plain
                  value={context.month.getFullYear().toString()}
                  onChange={(event) => {
                    const value = event.currentTarget.value;
                    if (value === "") {
                      return;
                    }
                    const newDate = new Date(context.month);
                    newDate.setFullYear(Number(value));
                    if (newDate.valueOf() !== context.month.valueOf()) {
                      context.setMonth(newDate);
                    }
                  }}
                  options={years()}
                />
              </Label>
              <Nav
                as={Button}
                appearance="tertiary"
                variant="gray"
                spacing="xs"
                action="prev-month"
                tabIndex={-1}
                aria-label="Перейти к предыдущему месяцу"
              >
                <ChevronLeft class="size-5" />
              </Nav>
              <Nav
                as={Button}
                spacing="xs"
                appearance="tertiary"
                variant="gray"
                action="next-month"
                tabIndex={-1}
                aria-label="Перейти к следующему месяцу"
              >
                <ChevronRight class="size-5" />
              </Nav>
            </div>
            <Table class={styles().table()}>
              <thead class={styles().thead()}>
                <tr class={styles().tr()}>
                  <Index each={context.weekdays}>
                    {(weekday) => (
                      <DateTime
                        as={HeadCell}
                        class={styles().headcell()}
                        abbr={formatWeekdayLong(weekday())}
                        options={{
                          weekday: "short",
                        }}
                      >
                        {weekday()}
                      </DateTime>
                    )}
                  </Index>
                </tr>
              </thead>
              <tbody class={styles().tbody()}>
                <Index each={context.weeks}>
                  {(week) => (
                    <tr class={styles().tr()}>
                      <Index each={week()}>
                        {(day) => (
                          <Cell>
                            <CellTrigger
                              as={Button}
                              day={day()}
                              appearance="primary"
                              variant="gray"
                              spacing="xs"
                              class={styles().celltrigger()}
                            >
                              {day().getDate()}
                            </CellTrigger>
                          </Cell>
                        )}
                      </Index>
                    </tr>
                  )}
                </Index>
              </tbody>
            </Table>
          </>
        );
      }}
    </Root>
  );
};

export default CalendarRoot;
