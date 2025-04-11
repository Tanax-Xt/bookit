import { RoleEnum } from "@/shared/api/types";

const translations: Record<RoleEnum, string> = {
  admin: "Админ",
  guest: "Гость",
  student: "Сотрудник",
};

export const getRoleDisplayName = (role: RoleEnum) => {
  return translations[role];
};
