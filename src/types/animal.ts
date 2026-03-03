import {animalFiltersSchema} from "@/validations/Animal/schemas";
import z from "zod";
import {Pagination} from "./pagination";
import {Audit} from "./audit";
import { AnimalType } from "./animalType";

export enum AnimalGender {
  Male = "M",
  Female = "F",
}

export type Animal = {
  id: string;
  name: string;
  age: number;
  breed: string;
  color: string;
  dtOfBirth?: Date;
  dtOfDeath?: Date;
  dtOfRescue?: Date;
  dtOfAdoption?: Date;
  locationOfRescue?: string;
  // adopter?: MinimalAdopter;
  // terms?: TermOutput[];
  type: AnimalType;
  size: string;
  gender: string;
  additionalInfo?: string;
  castrated?: boolean;
  // animalProcedures?: AnimalProcedureOutput[];
  // expenses?: MinimalExpensesOutput[];
  audit: Audit;
};

export type AnimalFilters = {
  createdAt?: Date | null;
  dtOfAdoption?: Date | null;
  dtOfRescue?: Date | null;
  dtOfDeath?: Date | null;
};

export type MinimalAnimal = {
  id: string;
  name: string;
  age: number;
  breed: string;
  dtOfRescue?: Date;
  dtOfDeath?: Date;
  dtOfAdoption?: Date;
  type: AnimalType;
  gender: string;
  castrated?: boolean;
  audit: Audit;
};

export type FindAllAnimalsPaginated = Pagination<MinimalAnimal>;

export type AnimalFilterFormData = z.infer<typeof animalFiltersSchema>;
