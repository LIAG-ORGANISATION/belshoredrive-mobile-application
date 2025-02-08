import {
  type InferInput,
  array,
  minLength,
  object,
  pipe,
  string,
} from "valibot";

export const regionsAndDepartments = object({
  viewable_departments: pipe(array(string()), minLength(1)),
});

export type RegionAndDepartmentsType = InferInput<typeof regionsAndDepartments>;

export const favoriteBrands = object({
  favorite_vehicle_brands: pipe(array(string()), minLength(1)),
});

export type FavoriteBrandsType = InferInput<typeof favoriteBrands>;
