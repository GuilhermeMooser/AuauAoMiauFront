import {City} from "./city";
import {Audit} from "./audit";
import {Pagination} from "./pagination";
import z from "zod";
import {
  adopterFiltersSchema,
  adopterSchema,
} from "@/validations/Adopter/schemas";
import {Terms} from "./terms";
import { Animal } from "./animal";

type ContactType = "telefone" | "celular" | "whatsapp";

type CivilStateType =
  | "solteiro"
  | "casado"
  | "divorciado"
  | "viuvo"
  | "uniao_estavel";

export type AdopterAddress = {
  id?: string;
  street: string;
  neighborhood: string;
  number?: number;
  city: City;
};

export type AdopterContact = {
  id?: string;
  value: string;
  type: ContactType;
  isPrincipal: boolean;
};

export type Adopter = {
  id: string;
  name: string;
  dtOfBirth: Date;
  rg?: string;
  cpf: string;
  email: string;
  contacts: AdopterContact[];
  profession: string;
  civilState: CivilStateType;
  addresses: AdopterAddress[];
  activeNotification: boolean;
  dtToNotify?: Date;
  animals: Animal[];
  terms?: Terms[];
  audit: Audit;
};

export type MinimalAdopter = {
  id: string;
  name: string;
  cpf: string;
  email: string;
  addresses: AdopterAddress[];
  contacts: AdopterContact[];
  activeNotification: boolean;
  audit: Audit;
  dtToNotify?: Date;
  dtOfBirth?: Date;
  animals?: Partial<Animal>[];
  civilState: string;
};

export type FindAllAdoptersPaginated = Pagination<MinimalAdopter>;

export type CreateAdopterDto = {
  name: string;
  dtOfBirth: Date;
  rg?: string;
  cpf: string;
  email: string;
  contacts: AdopterContact[] | null;
  profession: string;
  civilState: CivilStateType;
  addresses: AdopterAddress[] | null;
  activeNotification: boolean;
  dtToNotify?: Date | null;
  animalsIds?: string[];
};

export type UpdateAdopterDto = CreateAdopterDto & {
  id: string;
};

export type AdopterFormData = z.infer<typeof adopterSchema>;

export type AdopterFilterFormData = z.infer<typeof adopterFiltersSchema>;

export type AdopterFilters = {
  city?: string;
  stateUf?: string;
  createdAt?: Date | null;
  dtToNotify?: Date | null;
};
