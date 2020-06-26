export function generateKey(
  keys: Array<string | undefined>,
  delimiter = "/",
  withEnd = false
): string {
  const key = keys.filter(Boolean).join(delimiter);
  if (!key) return "";

  return withEnd ? [key, delimiter].join("") : key;
}
