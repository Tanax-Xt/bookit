import { createMemo } from "solid-js";

import { PlaceAvailableResponse } from "@/shared/api/types";
import { PageType } from "../types";

const ACCESS_LEVEL_NUMBER = {
  guest: 0,
  student: 1,
  admin: 2,
};

type Position = {
  top: number;
  left: number;
  bottom?: number;
  right?: number;
  angle: number;
};

const POSITIONS: Record<string, Position> = {
  "3fa85f64-5717-4562-b3fc-2c963f66afa6": { top: 23.5, left: 23.5, angle: 0 },
  "c8b70475-af22-4991-8d51-442ab164b1d9": { top: 23.5, left: 33, angle: 0 },
  "a6abc93b-5c12-47b2-b1b4-01ba1ece6dda": { top: 37, left: 23.5, angle: 0 },
  "3e41d3b6-822d-4518-ae7a-9ed0bdf39b0a": { top: 37, left: 33, angle: 0 },
  "87b50544-4eda-491b-994a-aa6b6ea894ad": { top: 45, left: 23.5, angle: 0 },
  "081cd80a-4ce4-41ab-ac2b-7c6e0ec200a9": { top: 45, left: 33, angle: 0 },
  "77f0161b-8dfb-4be6-81ce-9c200a426506": { top: 61, left: 4, right: 57, bottom: 3, angle: 0 },
  "9c35ca25-7947-4fb4-ac4e-d17863671a30": { top: 62, left: 54, right: 6, bottom: 3, angle: 0 },
  "21f64010-560a-46ac-b8d4-aae36e1a9e26": { top: 3, left: 60, right: 6, bottom: 50, angle: 0 },
};

type PlaceProps = {
  place: PlaceAvailableResponse;
  isActive: boolean;
  pageType: PageType;
  role: "guest" | "student" | "admin";
  onClick: (place: PlaceAvailableResponse | undefined) => void;
};

type Color = "green" | "red" | "gray";

export const Place = (props: PlaceProps) => {
  const position = createMemo(() => POSITIONS[props.place.id]);
  // eslint-disable-next-line solid/components-return-once
  if (!position()) return undefined;
  const placeLevel = createMemo(() => ACCESS_LEVEL_NUMBER[props.place.access_level]);
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  const userLevel = createMemo<number>(() => ACCESS_LEVEL_NUMBER[props.role]);
  const placeForbidden = createMemo(() => placeLevel() > userLevel());
  const displayAvailable = createMemo(
    () => (!placeForbidden() && props.place.is_available) || props.pageType === "preview",
  );

  const hasOnClick = createMemo(
    () => props.pageType === "admin-static-view" || (["create", "edit"].includes(props.pageType) && displayAvailable()),
  );
  const onClick = () => {
    if (hasOnClick()) props.onClick(props.place);
  };

  const color = createMemo<Color>(() => {
    if (props.pageType === "edit" || props.pageType === "create") {
      if (placeForbidden()) {
        return "gray";
      } else if (displayAvailable()) {
        return "green";
      }
      return "red";
    } else if (props.pageType === "admin-static-view") {
      if (props.place.is_available) {
        return "gray";
      }
      return "green";
    } else if (props.pageType === "preview") {
      if (props.isActive) {
        return "green";
      }
      return "gray";
    }
    return "gray";
  });

  return (
    <div
      class="absolute box-border flex touch-none items-center justify-center rounded border border-dark text-light transition select-none"
      classList={{
        "bg-bg-positive/70": color() === "green",
        "bg-bg-secondary/80 !text-dark": color() === "gray",
        "!bg-bg-destructive/50": color() === "red",
        "!cursor-not-allowed": !hasOnClick(),
        "border-2 scale-105 !bg-bg-accent/80": props.isActive,
        "cursor-pointer hover:bg-bg-accent/70": hasOnClick(),
        "h-16 w-16": props.place.type === "seat",
      }}
      style={{
        top: `${position()!.top}%`,
        left: `${position()!.left}%`,
        bottom: `${position()!.bottom}%`,
        right: `${position()!.right}%`,
        transform: `rotate(${position()!.angle}turn)`,
      }}
      onClick={onClick}
    >
      {props.place.name}
    </div>
  );
};
