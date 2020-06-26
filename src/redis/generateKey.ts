export function generateKey(
  keys: Array<string | undefined>,
  withEnd = false,
  delimiter = "/"
): string {
  const key = keys.filter(Boolean).join(delimiter);
  if (!key) return "";

  return withEnd ? [key, delimiter].join("") : key;
}
