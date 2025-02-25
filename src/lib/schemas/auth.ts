import { type InferOutput, email, object, pipe, string } from "valibot";

export const emailLoginSchema = object({
	email: pipe(string(), email()),
});

export type EmailLoginType = InferOutput<typeof emailLoginSchema>;

export const phoneLoginSchema = object({
	countryCode: string(),
	phoneNumber: string(),
});

export type PhoneLoginType = InferOutput<typeof phoneLoginSchema>;
