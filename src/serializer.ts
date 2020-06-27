export function serialize(data?: any): string {
  if (typeof data === "undefined") data = null;
  return JSON.stringify(data);
}

export function deserialize<T>(data?: string): T | null {
  try {
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}
