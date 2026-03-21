import {animalFiltersSchema, animalSchema} from "@/validations/Animal/schemas";
import z from "zod";
import {Pagination} from "./pagination";
import {Audit} from "./audit";
import {AnimalType} from "./animalType";
import {CreateExpenseDto, MinimalExpenses, UpdateExpenseDto} from "./expenses";
import {
  AnimalProcedureEnum,
  AnimalProcedures,
  CreateAnimalProcedureDispatcherDto,
  UpdateAnimalProcedureDispatcherDto,
} from "./animalProcedures";
import {MinimalAdopter} from "./adopter";
import {Terms} from "./terms";

export enum AnimalGender {
  Male = "M",
  Female = "F",
}
export type AnimalSize = "pequeno" | "medio" | "grande";

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
  adopter?: MinimalAdopter;
  terms?: Terms[];
  type: AnimalType;
  size: string;
  gender: string;
  additionalInfo?: string;
  castrated?: boolean;
  animalProcedures?: AnimalProcedures[];
  expenses?: MinimalExpenses[];
  audit: Audit;
  totalCost?: number;
  imageUrl?: string;
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
  terms: Terms[];
  totalCost: number;
  size: string;
  imageUrl?: string;
};

export type FindAllAnimalsPaginated = Pagination<MinimalAnimal>;

export type AnimalFormData = z.infer<typeof animalSchema>;

export type AnimalFilterFormData = z.infer<typeof animalFiltersSchema>;

export type CreateAnimalDto = {
  name: string;
  age: number;
  breed: string;
  color: string;
  dtOfBirth?: Date;
  dtOfDeath?: Date;
  dtOfRescue?: Date;
  dtOfAdoption?: Date;
  locationOfRescue?: string;
  adopterId?: string;
  typeId: number;
  size: string;
  gender: string;
  additionalInfo?: string;
  castrated: boolean;
  expenses?: CreateExpenseDto[];
  animalProcedures?: CreateAnimalProcedureDispatcherDto[];
  imageFile?: File | null;
};

export type UpdateAnimalDto = Omit<
  CreateAnimalDto,
  "expenses" | "animalProcedures"
> & {
  id: string;
  expenses: (CreateExpenseDto | UpdateExpenseDto)[];
  animalProcedures: (
    | CreateAnimalProcedureDispatcherDto
    | UpdateAnimalProcedureDispatcherDto
  )[];
};

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
