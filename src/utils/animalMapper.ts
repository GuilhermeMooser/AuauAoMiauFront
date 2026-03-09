import {Animal, AnimalFormData} from "@/types/animal";

const toDate = (value: string | Date | null | undefined): Date | undefined => {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const date = new Date(value);
  return isNaN(date.getTime()) ? undefined : date;
};

const toNumber = (
  value: string | number | null | undefined,
): number | undefined => {
  if (value === null || value === undefined || value === "") return undefined;
  const num = Number(value);
  return isNaN(num) ? undefined : num;
};

export const mapAnimalToFormData = (
  animal: Animal,
): Partial<AnimalFormData> => ({
  id: animal.id,
  name: animal.name ?? "",
  age: toNumber(animal.age),
  breed: animal.breed ?? "",
  color: animal.color ?? "",
  dtOfBirth: toDate(animal.dtOfBirth),
  dtOfDeath: toDate(animal.dtOfDeath),
  dtOfRescue: toDate(animal.dtOfRescue),
  dtOfAdoption: toDate(animal.dtOfAdoption),
  locationOfRescue: animal.locationOfRescue ?? "",
  typeId: animal.type.id,
  size: animal.size ?? "",
  gender: animal.gender ?? "",
  additionalInfo: animal.additionalInfo ?? "",
  castrated: animal.castrated ?? false,
  expenses: (animal.expenses ?? []).map((e) => ({
    id: e.id,
    value: toNumber(e.value) ?? 0,
    description: e.description ?? "",
    paymentType: e.paymentType ?? "",
  })),
  animalProcedures: (animal.animalProcedures ?? []).map((proc) => ({
    id: proc.id,
    description: proc.description ?? "",
    procedureType: proc.procedureType,
    dtOfProcedure: toDate(proc.dtOfProcedure),
    veterinarian: proc.veterinarian ?? undefined,
    observation: proc.observation ?? undefined,
    expenses: (proc.expenses ?? []).map((e) => ({
      id: e.id,
      value: toNumber(e.value) ?? 0,
      description: e.description ?? "",
      paymentType: e.paymentType ?? "",
    })),
    // VACCINE
    vaccineName: proc.vaccineName ?? undefined,
    vaccineType: proc.vaccineType ?? undefined,
    batch: proc.batch ?? undefined,
    manufacturer: proc.manufacturer ?? undefined,
    dtOfExpiration: toDate(proc.dtOfExpiration),
    // MEDICINE
    medicineName: proc.medicineName ?? undefined,
    reason: proc.reason ?? undefined,
    dosage: proc.dosage ?? undefined,
    frequency: proc.frequency ?? undefined,
    dtOfStart: toDate(proc.dtOfStart),
    dtOfEnd: toDate(proc.dtOfEnd),
    recomendations: proc.recomendations ?? undefined,
    // SURGERY
    surgeryName: proc.surgeryName ?? undefined,
    surgeryType: proc.surgeryType ?? undefined,
    local: proc.local ?? undefined,
    dtOfDuration: toDate(proc.dtOfDuration),
  })),
});
