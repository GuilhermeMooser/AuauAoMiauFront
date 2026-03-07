import {Audit} from "./audit";
import {MinimalExpenses} from "./expenses";

export enum AnimalProcedureEnum {
  VACCINE = "VACCINE",
  MEDICINE = "MEDICINE",
  SURGERY = "SURGERY",
  MISCELLANEOUS = "MISCELLANEOUS",
}

export type AnimalProcedures = {
  id: string;
  description: string;
  procedureType: AnimalProcedureEnum;
  dtOfProcedure?: Date;
  veterinarian?: string;
  observation?: string;
  expenses?: MinimalExpenses[];
  medicineName?: string;
  reason?: string;
  dosage?: string;
  frequency?: string;
  dtOfStart?: Date;
  dtOfEnd?: Date;
  recomendations?: string;
  surgeryName?: string;
  surgeryType?: string;
  local?: string;
  dtOfDuration?: Date;
  vaccineName?: string;
  vaccineType?: string;
  batch?: string;
  manufacturer?: string;
  dtOfExpiration?: Date;
  audit: Audit;
};
