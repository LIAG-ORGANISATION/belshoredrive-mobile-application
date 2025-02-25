/**
 * ExtractId takes a generic object `T` and a key `K` (which extends keyof T),
 * and returns a new type where:
 *  - That key is removed.
 *  - A new `id` property (of the same type) is added.
 */
export type ExtractId<T, K extends keyof T> = Omit<T, K> & { id: T[K] };
