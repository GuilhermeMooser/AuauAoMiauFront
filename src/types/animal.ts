import {animalFiltersSchema, animalSchema} from "@/validations/Animal/schemas";
import z from "zod";
import {Pagination} from "./pagination";
import {Audit} from "./audit";
import {AnimalType} from "./animalType";
import {MinimalExpenses} from "./expenses";
import {AnimalProcedureEnum, AnimalProcedures} from "./animalProcedures";
import {MinimalAdopter} from "./adopter";

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
  adopter?: MinimalAdopter; //Just for view
  // terms?: TermOutput[]; //Just for view
  type: AnimalType;
  size: string;
  gender: string;
  additionalInfo?: string;
  castrated?: boolean;
  animalProcedures?: AnimalProcedures[]; //FALTA
  expenses?: MinimalExpenses[]; //FALTA
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

export type AnimalFormData = z.infer<typeof animalSchema>;
// PEDIR PRA IA FZER OS FORM

export type AnimalFilterFormData = z.infer<typeof animalFiltersSchema>;

export const procedureConfig = {
  VACCINE: {
    label: "Vacinas",
    singularLabel: "Vacina",
    icon: "Syringe",
    badgeVariant: "outline" as const,
  },
  MEDICINE: {
    label: "Medicamentos",
    singularLabel: "Medicamento",
    icon: "Pill",
    badgeVariant: "outline" as const,
  },
  SURGERY: {
    label: "Cirurgias",
    singularLabel: "Cirurgia",
    icon: "Scissors",
    badgeVariant: "outline" as const,
  },
  MISCELLANEOUS: {
    label: "Procedimentos Gerais",
    singularLabel: "Procedimento",
    icon: "ClipboardList",
    badgeVariant: "outline" as const,
  },
} as const;

export type ProcedureType = keyof typeof procedureConfig;
