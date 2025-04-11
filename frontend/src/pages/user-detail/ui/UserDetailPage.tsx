import { createAsync, useAction, useParams } from "@solidjs/router";
import { createMemo, Show, Suspense } from "solid-js";

import { getRoleDisplayName, getUser, updateUserRoleAction } from "@/entities/user";
import { UpdateUserEmailCell, UpdateUserNameCell } from "@/features/user";
import { RoleEnum } from "@/shared/api/types";
import Avatar from "@/shared/ui/avatar";
import Cell from "@/shared/ui/cell";
import DateTime from "@/shared/ui/date-time";
import Group from "@/shared/ui/group";
import Select from "@/shared/ui/select";
import { Navigation } from "@/widgets/nav";

import { UserDetailPageSkeleton } from "./UserDetailPageSkeleton";

import IconIcRoundEditCalendar from "~icons/ic/round-edit-calendar";
import IconIcRoundPersonAdd from "~icons/ic/round-person-add";
import IconIcRoundTag from "~icons/ic/round-tag";
import IconIcRoundTheaterComedy from "~icons/ic/round-theater-comedy";
import IconLogosTelegram from "~icons/logos/telegram";

const UserDetailPage = () => {
  const params = useParams();

  const updateUserRole = useAction(updateUserRoleAction);
  const id = createMemo(() => (typeof params.id === "string" ? params.id : undefined));

  return (
    <section class="flex grow flex-col space-y-4">
      <Navigation label="Редактирование пользователя" back="/users" />

      <Show when={id()} fallback={"ID неправильный"}>
        {(username) => {
          const user = createAsync(() => getUser(username()));

          return (
            <Suspense fallback={<UserDetailPageSkeleton />}>
              <Show when={user()} fallback={"Пользователь не найден"}>
                {(user) => (
                  <>
                    <Avatar alt={user().username} class="size-24 self-center text-4xl" />

                    <h2 class="mb-8 self-center text-3xl font-semibold">{user().username}</h2>

                    <Group>
                      <Group.Content>
                        <UpdateUserNameCell name={user().name} user_id={user().id} />
                        <UpdateUserEmailCell email={user().email} user_id={user().id} />
                      </Group.Content>
                    </Group>

                    <Group>
                      <Group.Content>
                        <Cell>
                          <IconIcRoundTheaterComedy class="size-6 shrink-0" role="presentation" />
                          <Cell.Group>
                            <Cell.Label>Роль</Cell.Label>
                          </Cell.Group>
                          <Select
                            plain
                            value={user().role}
                            class="text-fg-tertiary select-none"
                            onChange={async (e) => await updateUserRole(user().id, e.currentTarget.value as RoleEnum)}
                            options={(["admin", "guest", "student"] as RoleEnum[]).map((role) => ({
                              label: getRoleDisplayName(role),
                              value: role,
                            }))}
                            allowDuplicateSelectionEvents={false}
                            disallowEmptySelection
                          />
                        </Cell>
                      </Group.Content>
                    </Group>

                    <Group>
                      <Group.Content>
                        <Cell>
                          <IconIcRoundPersonAdd class="size-6 shrink-0" role="presentation" />
                          <Cell.Group>
                            <Cell.Label>Создан</Cell.Label>
                          </Cell.Group>
                          <Cell.Value>
                            <DateTime
                              options={{
                                year: "numeric",
                                month: "long",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: false,
                                day: "numeric",
                                timeZone: "+06",
                              }}
                            >
                              {new Date(user().created_at)}
                            </DateTime>
                          </Cell.Value>
                        </Cell>
                        <Cell>
                          <IconIcRoundEditCalendar class="size-6 shrink-0" role="presentation" />
                          <Cell.Group>
                            <Cell.Label>Изменён</Cell.Label>
                          </Cell.Group>
                          <Cell.Value>
                            <DateTime
                              options={{
                                year: "numeric",
                                month: "long",
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                                hour12: false,
                                day: "numeric",
                                timeZone: "+06",
                              }}
                            >
                              {new Date(user().updated_at)}
                            </DateTime>
                          </Cell.Value>
                        </Cell>
                      </Group.Content>
                    </Group>

                    <Group>
                      <Group.Content>
                        <Cell>
                          <IconIcRoundTag class="size-6 shrink-0" role="presentation" />
                          <Cell.Group>
                            <Cell.Label>ID</Cell.Label>
                          </Cell.Group>
                          <Cell.Value class="font-mono">{user().id}</Cell.Value>
                        </Cell>
                      </Group.Content>
                    </Group>

                    <Group>
                      <Group.Content>
                        <Cell>
                          <IconLogosTelegram class="size-6 shrink-0" role="presentation" />
                          <Cell.Group>
                            <Cell.Label>Telegram</Cell.Label>
                          </Cell.Group>
                          <Cell.Value classList={{ "font-mono": !!user().telegram_id }}>
                            {user().telegram_id ?? "не привязано"}
                          </Cell.Value>
                        </Cell>
                      </Group.Content>
                    </Group>
                  </>
                )}
              </Show>
            </Suspense>
          );
        }}
      </Show>
    </section>
  );
};

export default UserDetailPage;
