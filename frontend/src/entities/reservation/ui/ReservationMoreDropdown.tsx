import { PolymorphicProps } from "@kobalte/core/polymorphic";
import { useAction, useNavigate, useSubmission } from "@solidjs/router";
import { splitProps, ValidComponent } from "solid-js";

import { BookingResponse } from "@/shared/api/types";
import Button, { RootProps as ButtonRootProps } from "@/shared/ui/button";
import Dropdown from "@/shared/ui/dropdown";

import { deleteReservationAction } from "../api/actions";

import DeleteIcon from "~icons/ic/round-cancel";
import EditIcon from "~icons/ic/round-mode-edit";
import MoreIcon from "~icons/ic/round-more-vert";
import toast from "@/shared/ui/toast";
import { extractError } from "@/shared/api";

export type ExerciseMoreDropdownOptions = {
  booking: BookingResponse;
  onDelete?: VoidFunction;
};

export type ExerciseMoreDropdownProps<T extends ValidComponent = "button"> = ButtonRootProps<T> &
  ExerciseMoreDropdownOptions;

export const ReservationMoreDropdown = <T extends ValidComponent = "button">(
  props: PolymorphicProps<T, ExerciseMoreDropdownProps<T>>,
) => {
  const [localProps, otherProps] = splitProps(props as ExerciseMoreDropdownOptions, ["booking"]);

  const navigate = useNavigate();
  const deleteReservation = useAction(deleteReservationAction);
  const deleteReservationSubmission = useSubmission(deleteReservationAction);

  const onCancel = async () => {
    const { error } = await deleteReservation(localProps.booking.id);
    if (error) {
      toast(extractError(error), "destructive");
    } else {
      toast("Бронь отменена", "positive");
    }
  };

  return (
    <Dropdown gutter={4} placement="bottom-end">
      <Button
        as={Dropdown.Trigger}
        shape="circle"
        spacing="sm"
        variant="ghost"
        appearance="tertiary"
        aria-label="Ещё"
        {...otherProps}
      >
        <MoreIcon class="size-6" />
      </Button>
      <Dropdown.Content>
        <Dropdown.Item onSelect={() => navigate(`/reservations/${props.booking.id}/edit`)}>
          <EditIcon role="presentation" class="size-6" />
          <Dropdown.ItemLabel>Редактировать</Dropdown.ItemLabel>
        </Dropdown.Item>
        <Dropdown.Item class="text-fg-destructive" disabled={deleteReservationSubmission.pending} onSelect={onCancel}>
          <DeleteIcon role="presentation" class="size-6" />
          <Dropdown.ItemLabel>Отменить</Dropdown.ItemLabel>
        </Dropdown.Item>
      </Dropdown.Content>
    </Dropdown>
  );
};
