import phone from "phone";
import { object, string, email, pipe, InferOutput, check } from "valibot";

export const emailLoginSchema = object({
  email: pipe(string(), email()),
});

export type EmailLoginType = InferOutput<typeof emailLoginSchema>;

export const phoneLoginSchema = object({
  phone: pipe(
    string(),
    check((value: string) => phone(value).isValid, "Invalid phone number")
  ),
});

export type PhoneLoginType = InferOutput<typeof phoneLoginSchema>;
