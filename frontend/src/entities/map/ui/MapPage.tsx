import { debounce } from "@solid-primitives/scheduled";
import { createAsync, useAction, useNavigate, useParams } from "@solidjs/router";
import { createEffect, createMemo, createSignal, mergeProps, Show } from "solid-js";
import { createStore } from "solid-js/store";

import { TimeSlider } from "@/entities/map";
import { createBookingAction, editBookingAction } from "@/entities/map/api/actions";
import { Map } from "@/entities/map/ui/Map";
import { getCurrentUser } from "@/entities/user";
import { BookingResponse, PlaceAvailableResponse } from "@/shared/api/types";
import { formatDateToYYYYMMDD, isBeforeToday, parseYYYYMMDDToDate } from "@/shared/lib/date";
import Button from "@/shared/ui/button";
import DateField from "@/shared/ui/date-field";

import { getAvailablePlaces, getBooking } from "../api/queries";
import { PageType } from "../types";
import { MapPageSkeleton } from "./MapPageSkeleton";
import toast from "@/shared/ui/toast";
import { extractError } from "@/shared/api";

const DEFAULT_TIME: [number, number] = [11 * 60 * 60, 13 * 60 * 60];

type Props = {
  isEditPage?: boolean;
  isPreviewPage?: boolean;
  booking?: BookingResponse;
};

type PlacesStore = {
  places: PlaceAvailableResponse[];
};

const MapPage = (selfProps: Props) => {
  const props = mergeProps({ isEditPage: false, isPreviewPage: false }, selfProps);

  const navigate = useNavigate();
  const params = useParams();
  const createBooking = useAction(createBookingAction);
  const editBooking = useAction(editBookingAction);

  const user = createAsync(() => getCurrentUser());

  const [activePlaceId, setActivePlaceId] = createSignal<string | undefined>();
  const [time, setTime] = createSignal<[number, number]>(DEFAULT_TIME);
  const [day, setDay] = createSignal<Date>(new Date());
  const [error, setError] = createSignal<string>();

  const currentUser = createAsync(() => getCurrentUser());
  const [placesStore, setPlacesStore] = createStore<PlacesStore>({ places: [] });
  createEffect(async () => {
    const start_second = pageType() === "admin-static-view" ? 0 : time()[0];
    const end_second = pageType() === "admin-static-view" ? 24 * 60 * 60 - 1 : time()[1];
    const newPlaces = await getAvailablePlaces(day(), start_second, end_second);
    if (newPlaces?.length) {
      setPlacesStore(
        "places",
        newPlaces.map((place) => {
          // TODO: проверка пересечения с чужим бронированиемс на этом же месте
          if (["edit", "preview"].includes(pageType()) && place.id === booking()?.place.id)
            return {
              ...place,
              is_available: true,
            };
          return place;
        }),
      );
    }
  });

  const booking = createAsync(async () => {
    let book: BookingResponse | undefined = props.booking;

    if (!book && params.id) {
      const { data, error } = await getBooking(params.id);

      if (error) {
        return setError(extractError(error));
      }
      if (!data) {
        return navigate("/reservations");
      }

      book = data;
    }

    if (book) {
      setTime([book.start_second, book.end_second]);
      setDay(parseYYYYMMDDToDate(book.date));
      setActivePlaceId(book.place.id);
    }

    return book;
  });

  const pageType = createMemo<PageType>(() => {
    if (props.isEditPage) return "edit";
    if (props.isPreviewPage) return "preview";
    if (currentUser()?.role === "admin") return "admin-static-view";
    return "create";
  });

  const showPage = createMemo(() => {
    // не показываем пустую карту, пока загружаются данные для страницы редактирования
    if (pageType() === "edit") return Boolean(booking() && placesStore.places.length);
    return placesStore.places.length;
  });

  createEffect(() => {
    if (pageType() === "admin-static-view") return;

    // Если выбранное место недоступно в данный отрезок времени, сбрасываем выбор
    const place = placesStore.places.find((item) => item.id === activePlaceId());
    if (!place) return;
    if (!place.is_available) {
      setActivePlaceId(undefined);
    }
  });

  const onTimeChange = debounce((numbers: number[]) => {
    const value: [number, number] =
      numbers[0] != undefined && numbers[1] != undefined ? [numbers[0], numbers[1]] : DEFAULT_TIME;
    setTime(value);
  }, 200);

  const onDayChange = (value: null | Date) => {
    if (value === null) return;
    setDay(value);
  };

  const submitCreateBooking = async () => {
    if (!activePlaceId()) return;
    const { status, error } = await createBooking(activePlaceId()!, day(), time()[0], time()[1], user()?.email);
    if (status !== 200) {
      setError(extractError(error));
    } else {
      toast("Бронирование успешно создано", "positive");
      navigate("/reservations");
    }
  };

  const submitEditBooking = async () => {
    if (!activePlaceId()) return;
    if (!params.id) return;

    const { status, error } = await editBooking(
      booking()!.id,
      formatDateToYYYYMMDD(day()),
      time()![0],
      time()![1],
      activePlaceId()!,
      user()?.email,
    );
    if (status != 204) {
      setError(extractError(error));
    } else {
      toast("Бронирование успешно изменено", "positive");
      if (user()?.role === "admin") {
        navigate("/");
      } else {
        navigate("/reservations");
      }
    }
  };

  const onSubmit = () => {
    if (pageType() === "admin-static-view") return;
    if (pageType() === "create") return submitCreateBooking();
    if (pageType() === "edit") return submitEditBooking();
  };

  return (
    <section class="flex flex-col gap-y-4">
      <Show when={showPage()} fallback={<MapPageSkeleton />}>
        <Show when={pageType() !== "preview"}>
          <div class="flex items-center justify-between">
            <DateField
              plain
              class="-mx-1.5 ms-auto text-lg font-semibold text-fg-secondary underline decoration-current decoration-dotted underline-offset-4 hover:text-fg-body hover:decoration-solid"
              value={formatDateToYYYYMMDD(day())}
              onValueChange={onDayChange}
              options={{
                required: true,
                disabled: isBeforeToday,
              }}
              disabled={pageType() === "preview"}
              closeOnValueChange
            />
          </div>
        </Show>

        <Show when={["edit", "create"].includes(pageType()) && time()}>
          <TimeSlider
            step={60 * 15}
            maxRange={8 * 60 * 60}
            defaultValues={time()!}
            minStepsBetweenThumbs={8}
            onChange={onTimeChange}
          />
        </Show>

        <Map
          activeId={activePlaceId()}
          onChange={setActivePlaceId}
          time={time()!}
          day={day()}
          pageType={pageType()}
          onSubmit={onSubmit}
          error={error()}
          setError={setError}
          places={placesStore.places}
        />

        <Show when={pageType() === "edit"}>
          <Show when={error()}>
            <p class="mx-auto text-center text-fg-destructive">{error()}</p>
          </Show>
          <Button onClick={onSubmit} size="lg" spacing="lg" appearance="accent" class="mx-auto block">
            Сохранить
          </Button>
        </Show>
      </Show>
    </section>
  );
};

export default MapPage;
