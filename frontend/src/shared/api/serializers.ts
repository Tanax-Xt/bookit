// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function serializeFormData(body: any): FormData {
  const data = new FormData();
  for (const name in body) {
    data.append(name, body[name]);
  }
  return data;
}
