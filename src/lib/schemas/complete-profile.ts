import {
  type InferOutput,
  array,
  maxLength,
  maxValue,
  minLength,
  minValue,
  number,
  object,
  optional,
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

export const completeProfileDetailsSchema = object({
  biography: pipe(string(), minLength(10), maxLength(100)),
  birth_year: pipe(
    number(),
    minValue(1900),
    maxValue(new Date().getFullYear()),
  ),
  postal_address: optional(pipe(string(), minLength(1), maxLength(10))),
  website_url: optional(pipe(string(), minLength(1), maxLength(100))),
  instagram: optional(pipe(string(), minLength(1), maxLength(100))),
  facebook: optional(pipe(string(), minLength(1), maxLength(100))),
  twitter: optional(pipe(string(), minLength(1), maxLength(100))),
  tiktok: optional(pipe(string(), minLength(1), maxLength(100))),
});

export type CompleteProfileType = InferOutput<
  typeof completeProfileDetailsSchema
>;
export const userServicesSchema = object({
  services: pipe(array(string()), minLength(1)),
});

export type UserServicesType = InferOutput<typeof userServicesSchema>;
