// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractError = (error: any) => {
  // eslint-disable-next-line no-console
  console.log(error);
  if (typeof error === "string") {
    return error;
  } else if (typeof error.error === "string") {
    return error.error;
  } else if (typeof error?.detail === "string") {
    return error.detail;
  } else if (error?.detail?.[0]?.msg) {
    return error?.detail[0]?.msg;
  }
  return "Произошла неизвестная ошибка, повторите попытку позже";
};
