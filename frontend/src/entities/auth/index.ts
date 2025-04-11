import { loginAction, logoutAction, registerAction } from "./api/actions";
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERN,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
} from "./config";
import { guest } from "./hoc/guest";
import { protect } from "./hoc/protect";
import { PasswordSchema, UsernameSchema } from "./model/schema";
import { FastLogin } from "./ui/FastLoginPage";

export {
  FastLogin,
  guest,
  loginAction,
  logoutAction,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_PATTERN,
  PasswordSchema,
  protect,
  registerAction,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_PATTERN,
  UsernameSchema,
};
