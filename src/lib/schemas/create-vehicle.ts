import {
	type InferOutput,
	array,
	custom,
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

export const createVehicleSchema = object({
	brand_id: pipe(string(), minLength(1), maxLength(100)),
	model: pipe(string(), minLength(1), maxLength(100)),
	year: pipe(number(), minValue(1850), maxValue(new Date().getFullYear())),
	nickname: optional(pipe(string(), maxLength(100))),
	description: optional(pipe(string(), maxLength(300))),
	status_id: optional(pipe(string(), maxLength(100))),
});

export type CreateVehicleType = InferOutput<typeof createVehicleSchema>;

export const chooseBrandSchema = object({
	brand_id: pipe(string(), minLength(1), maxLength(100)),
});

export type ChooseBrandType = InferOutput<typeof chooseBrandSchema>;

export const chooseTagsSchema = object({
	tags: pipe(array(string()), minLength(1), maxLength(100)),
});

export type ChooseTagsType = InferOutput<typeof chooseTagsSchema>;

const checksForNumericValue = (value: unknown) => {
	if (
		typeof value === "string" &&
		value.length > 0 &&
		!Number.isNaN(Number(value))
	) {
		return true;
	}
	if (typeof value === "number" && value > 0) {
		return true;
	}
	return false;
};

export const vehicleDetailsSchema = object({
	mileage: optional(
		custom<string | number>(
			checksForNumericValue,
			"Kilométrage doit être un nombre",
		),
	),
	power: optional(
		custom<string | number>(
			checksForNumericValue,
			"Puissance doit être un nombre",
		),
	),
	transmission_id: optional(pipe(string(), minLength(1), maxLength(100))),
	motorization_id: optional(pipe(string(), minLength(1), maxLength(100))),
	max_speed: optional(
		custom<string | number>(
			checksForNumericValue,
			"Vitesse max doit être un nombre",
		),
	),
	purchase_date: optional(pipe(string(), maxLength(100))),
	driving_side: optional(pipe(string(), maxLength(100))),
});

export type VehicleDetailsType = InferOutput<typeof vehicleDetailsSchema>;

export const partsDetailsSchema = object({
	motorization: optional(pipe(string(), maxLength(200))),
	chassis: optional(pipe(string(), maxLength(200))),
	braking: optional(pipe(string(), maxLength(200))),
	exterior: optional(pipe(string(), maxLength(200))),
	technical_document: optional(pipe(string(), maxLength(200))),
});

export type PartsDetailsType = InferOutput<typeof partsDetailsSchema>;
