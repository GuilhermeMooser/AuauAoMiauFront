import {Audit} from "./audit";
import {CreateExpenseDto, MinimalExpenses, UpdateExpenseDto} from "./expenses";

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

export type UpdateAnimalProcedureDispatcherDto =
  | (BaseProcedureUpdate & {
      procedureType: AnimalProcedureEnum.VACCINE;
      payload: VaccinePayloadUpdate;
    })
  | (BaseProcedureUpdate & {
      procedureType: AnimalProcedureEnum.SURGERY;
      payload: SurgeryPayloadUpdate;
    })
  | (BaseProcedureUpdate & {
      procedureType: AnimalProcedureEnum.MEDICINE;
      payload: MedicinePayloadUpdate;
    })
  | (BaseProcedureUpdate & {
      procedureType: AnimalProcedureEnum.MISCELLANEOUS;
      payload: MiscellaneousPayloadUpdate;
    });

type BaseProcedureUpdate = {
  procedureType: AnimalProcedureEnum;
  dtOfProcedure: Date;
  description: string;
  veterinarian: string;
  observation: string;
  expenses: UpdateExpenseDto[];
};

export type SurgeryPayloadUpdate = {
  id: string;
  surgeryName: string;
  surgeryType?: string;
  local?: string;
  reason?: string;
  dtOfDuration?: Date;
  recomendations?: string;
};

export type VaccinePayloadUpdate = {
  id: string;
  vaccineName: string;
  vaccineType?: string;
  batch?: string;
  manufacturer?: string;
  dtOfExpiration?: Date;
};

export type MedicinePayloadUpdate = {
  id: string;
  medicineName: string;
  reason?: string;
  dosage?: string;
  frequency?: string;
  dtOfStart?: Date;
  dtOfEnd?: Date;
};

export type MiscellaneousPayloadUpdate = {
  id: string;
  reason: string;
  recomendations?: string;
};

export type CreateAnimalProcedureDispatcherDto =
  | (BaseProcedure & {
      procedureType: AnimalProcedureEnum.VACCINE;
      payload: VaccinePayload;
    })
  | (BaseProcedure & {
      procedureType: AnimalProcedureEnum.SURGERY;
      payload: SurgeryPayload;
    })
  | (BaseProcedure & {
      procedureType: AnimalProcedureEnum.MEDICINE;
      payload: MedicinePayload;
    })
  | (BaseProcedure & {
      procedureType: AnimalProcedureEnum.MISCELLANEOUS;
      payload: MiscellaneousPayload;
    });

export type BaseProcedure = {
  procedureType: AnimalProcedureEnum;
  dtOfProcedure?: Date;
  description: string;
  veterinarian?: string;
  observation?: string;
  expenses?: CreateExpenseDto[];
};

export type SurgeryPayload = {
  surgeryName: string;
  surgeryType?: string;
  local?: string;
  reason?: string;
  dtOfDuration?: Date;
  recomendations?: string;
};

export type VaccinePayload = {
  vaccineName: string;
  vaccineType?: string;
  batch?: string;
  manufacturer?: string;
  dtOfExpiration?: Date;
};

export type MedicinePayload = {
  medicineName: string;
  reason?: string;
  dosage?: string;
  frequency?: string;
  dtOfStart?: Date;
  dtOfEnd?: Date;
};

export type MiscellaneousPayload = {
  reason: string;
  recomendations?: string;
};

