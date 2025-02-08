import type { ExtractId } from "./extract-id";

export function mapToId<T, K extends keyof T>(
  items: T[],
  key: K,
): ExtractId<T, K>[] {
  return items.map((item) => {
    const { [key]: originalId, ...rest } = item;
    return {
      ...rest,
      id: originalId,
    } as ExtractId<T, K>;
  });
}
