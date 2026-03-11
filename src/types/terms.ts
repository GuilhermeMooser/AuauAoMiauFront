import {termFiltersSchema, termSchema} from "@/validations/Terms/schemas";
import z from "zod";
import {MinimalAnimal} from "./animal";
import {Audit} from "./audit";
import {MinimalAdopter} from "./adopter";
import { Pagination } from "./pagination";

export type Terms = {
  id: string;
  animal: MinimalAnimal;
  adopter: MinimalAdopter;
  audit: Audit;
};

export type TermFilters = {
  createdAt?: Date | null;
};

export type TermFilterFormData = z.infer<typeof termFiltersSchema>;

export type TermFormData = z.infer<typeof termSchema>;

export type FindAllTermsPaginated = Pagination<Terms>;