import {
  type InferOutput,
  maxLength,
  minLength,
  object,
  pipe,
  string,
} from "valibot";

export const usernameSchema = object({
  username: pipe(string(), minLength(3), maxLength(20)),
});

export type UsernameType = InferOutput<typeof usernameSchema>;

export const completeProfileSchema = object({
  username: usernameSchema,
});
