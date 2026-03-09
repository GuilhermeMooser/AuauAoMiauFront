import {getAuth} from "@/utils/auth";
import {AnimalFormProps} from ".";
import {useFieldArray, useForm} from "react-hook-form";
import {AnimalFormData, CreateAnimalDto, UpdateAnimalDto} from "@/types/animal";
import {zodResolver} from "@hookform/resolvers/zod";
import {animalSchema} from "@/validations/Animal/schemas";
import {useFormError} from "@/hooks/useFormError";
import {useError} from "@/hooks/useError";
import {Role} from "@/constants/roles";
import {useModal} from "@/hooks/useModal";
import {useMutation, useQuery} from "@tanstack/react-query";
import {
  createAnimal,
  deleteAnimal,
  getAnimalTypes,
  updateAnimal,
} from "@/services/animal";
import {animalTypesCache} from "@/constants/cacheNames";
import {
  AnimalProcedureEnum,
  AnimalProcedures,
  BaseProcedure,
  BaseProcedureUpdate,
  CreateAnimalProcedureDispatcherDto,
  MedicinePayload,
  MedicinePayloadUpdate,
  MiscellaneousPayload,
  MiscellaneousPayloadUpdate,
  SurgeryPayload,
  SurgeryPayloadUpdate,
  UpdateAnimalProcedureDispatcherDto,
  VaccinePayload,
  VaccinePayloadUpdate,
} from "@/types/animalProcedures";
import {type} from "os";
import {useState} from "react";
import {toast} from "@/hooks/use-toast";
import {mutationErrorHandling} from "@/utils/errorHandling";
import {mapAnimalToFormData} from "@/utils/animalMapper";
import {CreateExpenseDto, UpdateExpenseDto} from "@/types/expenses";

type Props = {
  animal: AnimalFormProps["animal"];
  mode: AnimalFormProps["mode"];
  onCancel: AnimalFormProps["onCancel"];
  onCreateSuccess: AnimalFormProps["onCreateSuccess"];
  onUpdateSuccess: AnimalFormProps["onUpdateSuccess"];
  onDeleteSuccess: AnimalFormProps["onDeleteSuccess"];
};

export const useAnimalForm = ({
  animal,
  mode,
  onCancel,
  onCreateSuccess,
  onDeleteSuccess,
  onUpdateSuccess,
}: Props) => {
  const auth = getAuth();

  /** Form */
  console.log(animal);
  const form = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: animal
      ? mapAnimalToFormData(animal)
      : {
          name: "",
          age: undefined,
          breed: "",
          color: "",
          typeId: 0,
          size: "",
          gender: "",
          castrated: false,
          animalProcedures: [],
          expenses: [],
        },
  });
  const {onError} = useFormError<AnimalFormData>();
  const {clearError, errorMessage, setErrorMessage} = useError();

  const isReadOnly = mode === "view";

  /** Expenses Fields */
  const {
    fields: expensesFields,
    append: appendExpense,
    remove: removeExpense,
  } = useFieldArray({
    control: form.control,
    name: "expenses",
  });

  /** Animal Procedures Fields */
  const {
    fields: animalProceduresFields,
    append: appendAnimalProcedures,
    remove: removeAnimalProcedures,
  } = useFieldArray({
    control: form.control,
    name: "animalProcedures",
  });

  /** Animal Procedures Expenses Fields */
  const {
    fields: animalProceduresExpensesFields,
    append: animalProceduresAppendExpense,
    remove: animalProceduresRemoveExpense,
  } = useFieldArray({
    control: form.control,
    name: "expenses",
  });

  const handleAddAnimalProcedureExpense = (
    procedureIndex: number,
    expense: {
      id: string;
      description: string;
      value: number;
      paymentType: string;
    },
  ) => {
    const current =
      form.getValues(`animalProcedures.${procedureIndex}.expenses`) ?? [];
    form.setValue(
      `animalProcedures.${procedureIndex}.expenses`,
      [...current, expense],
      {shouldDirty: true},
    );
  };

  const handleRemoveAnimalProcedureExpense = (
    procedureIndex: number,
    expenseIndex: number,
  ) => {
    const current =
      form.getValues(`animalProcedures.${procedureIndex}.expenses`) ?? [];
    form.setValue(
      `animalProcedures.${procedureIndex}.expenses`,
      current.filter((_, i) => i !== expenseIndex),
      {shouldDirty: true},
    );
  };

  const getProceduresByType = (typeString: string) => {
    const type = typeString as AnimalProcedureEnum;
    return animalProceduresFields
      .map((field, index) => ({...field, originalIndex: index}))
      .filter((field) => field.procedureType === type);
  };

  /** Fetch AnimalTypes */
  const {data: animalTypesData, isLoading: isLoadingAnimalType} = useQuery({
    queryKey: [animalTypesCache],
    queryFn: () => getAnimalTypes(),
  });

  /** Mutations */

  const {mutate: createAnimalMutation} = useMutation({
    mutationFn: async (createAnimalDto: CreateAnimalDto) => {
      return (await createAnimal(createAnimalDto)).data;
    },
    onSuccess: (data) => {
      setSubmitting(false);
      toast({
        title: "Sucesso",
        description: "Animal criado com sucesso",
        variant: "success",
      });
      if (onCreateSuccess) {
        onCreateSuccess(data);
      }
      handleCloseModal();
    },
    onError: (error) => {
      setSubmitting(false);
      console.log(error);
      mutationErrorHandling(error, "Falha ao criar o animal", setErrorMessage);
    },
  });

  const {mutate: updateAnimalMutation} = useMutation({
    mutationFn: async (updateAnimalDto: UpdateAnimalDto) => {
      return (await updateAnimal({...updateAnimalDto})).data;
    },
    onSuccess: (data) => {
      setSubmitting(false);
      toast({
        title: "Sucesso",
        description: "Adotante atualizado com sucesso",
        variant: "success",
      });
      if (onUpdateSuccess) {
        onUpdateSuccess(data);
      }
      handleCloseModal();
    },
    onError: (error) => {
      setSubmitting(false);
      mutationErrorHandling(
        error,
        "Falha ao atualizar o adotante",
        setErrorMessage,
      );
    },
  });

  /** Actions */
  const [submitting, setSubmitting] = useState<boolean>(false);
  JSON.stringify(form.formState.errors, null, 2);
  const handleButtonConfirm = (data: AnimalFormData) => {
    setSubmitting(true);
    console.log(JSON.stringify(data, null, 3));

    if (mode === "create") {
      const dto: CreateAnimalDto = {
        ...data,
        animalProcedures: mapProceduresToCreateDto(data.animalProcedures),
      };
      createAnimalMutation(dto);
    } else if (mode === "edit") {
      if (!animal?.id) {
        setErrorMessage("O código do animal não pode ser nulo");
        return;
      }
      const dto: UpdateAnimalDto = {
        ...data,
        id: animal.id,
        expenses: mapExpensesToCreateOrUpdateDto(data.expenses),
        animalProcedures: mapProceduresToUpdateDto(data.animalProcedures),
      };

      updateAnimalMutation(dto);
    }
  };

  const mapExpensesToCreateOrUpdateDto = (
    expenses: AnimalFormData["expenses"],
  ): (CreateExpenseDto | UpdateExpenseDto)[] => {
    if (!expenses) return [];
    return expenses.map((e) =>
      e.id
        ? {
            id: e.id,
            value: e.value,
            description: e.description,
            paymentType: e.paymentType,
          }
        : {
            value: e.value,
            description: e.description,
            paymentType: e.paymentType,
          },
    );
  };

  const mapProceduresToUpdateDto = (
    procedures: AnimalFormData["animalProcedures"],
  ): (CreateAnimalProcedureDispatcherDto | UpdateAnimalProcedureDispatcherDto)[] => {
    if (!procedures) return [];

    return procedures.map((proc) => {
      const base: BaseProcedureUpdate = {
        procedureType: proc.procedureType,
        dtOfProcedure: proc.dtOfProcedure,
        description: proc.description,
        veterinarian: proc.veterinarian,
        observation: proc.observation,
        expenses: mapExpensesToCreateOrUpdateDto(proc.expenses),
      };

      switch (proc.procedureType) {
        case AnimalProcedureEnum.VACCINE:
          return {
            ...base,
            procedureType: AnimalProcedureEnum.VACCINE,
            payload: {
              id: proc.id,
              vaccineName: proc.vaccineName ?? "",
              vaccineType: proc.vaccineType,
              batch: proc.batch,
              manufacturer: proc.manufacturer,
              dtOfExpiration: proc.dtOfExpiration,
            } satisfies VaccinePayloadUpdate,
          };

        case AnimalProcedureEnum.MEDICINE:
          return {
            ...base,
            procedureType: AnimalProcedureEnum.MEDICINE,
            payload: {
              medicineName: proc.medicineName ?? "",
              reason: proc.reason,
              dosage: proc.dosage,
              frequency: proc.frequency,
              dtOfStart: proc.dtOfStart,
              dtOfEnd: proc.dtOfEnd,
            } satisfies MedicinePayloadUpdate,
          };

        case AnimalProcedureEnum.SURGERY:
          return {
            ...base,
            procedureType: AnimalProcedureEnum.SURGERY,
            payload: {
              surgeryName: proc.surgeryName ?? "",
              surgeryType: proc.surgeryType,
              local: proc.local,
              reason: proc.reason,
              dtOfDuration: proc.dtOfDuration,
              recomendations: proc.recomendations,
            } satisfies SurgeryPayloadUpdate,
          };

        case AnimalProcedureEnum.MISCELLANEOUS:
          return {
            ...base,
            procedureType: AnimalProcedureEnum.MISCELLANEOUS,
            payload: {
              reason: proc.reason ?? "",
              recomendations: proc.recomendations,
            } satisfies MiscellaneousPayloadUpdate,
          };
      }
    });
  };

  const mapProceduresToCreateDto = (
    procedures: AnimalFormData["animalProcedures"],
  ): CreateAnimalProcedureDispatcherDto[] => {
    if (!procedures) return [];

    return procedures.map((proc) => {
      const base: BaseProcedure = {
        procedureType: proc.procedureType,
        dtOfProcedure: proc.dtOfProcedure,
        description: proc.description,
        veterinarian: proc.veterinarian,
        observation: proc.observation,
        expenses: proc.expenses,
      };

      switch (proc.procedureType) {
        case AnimalProcedureEnum.VACCINE:
          return {
            ...base,
            procedureType: AnimalProcedureEnum.VACCINE,
            payload: {
              vaccineName: proc.vaccineName ?? "",
              vaccineType: proc.vaccineType,
              batch: proc.batch,
              manufacturer: proc.manufacturer,
              dtOfExpiration: proc.dtOfExpiration,
            } satisfies VaccinePayload,
          };

        case AnimalProcedureEnum.MEDICINE:
          return {
            ...base,
            procedureType: AnimalProcedureEnum.MEDICINE,
            payload: {
              medicineName: proc.medicineName ?? "",
              reason: proc.reason,
              dosage: proc.dosage,
              frequency: proc.frequency,
              dtOfStart: proc.dtOfStart,
              dtOfEnd: proc.dtOfEnd,
            } satisfies MedicinePayload,
          };

        case AnimalProcedureEnum.SURGERY:
          return {
            ...base,
            procedureType: AnimalProcedureEnum.SURGERY,
            payload: {
              surgeryName: proc.surgeryName ?? "",
              surgeryType: proc.surgeryType,
              local: proc.local,
              reason: proc.reason,
              dtOfDuration: proc.dtOfDuration,
              recomendations: proc.recomendations,
            } satisfies SurgeryPayload,
          };

        case AnimalProcedureEnum.MISCELLANEOUS:
          return {
            ...base,
            procedureType: AnimalProcedureEnum.MISCELLANEOUS,
            payload: {
              reason: proc.reason ?? "",
              recomendations: proc.recomendations,
            } satisfies MiscellaneousPayload,
          };
      }
    });
  };

  const handleCloseModal = () => {
    onCancel();
    form.reset();
  };

  /** Delete Animal */
  const canExcludeAnimal =
    mode === "edit" && auth?.user.role.name === Role.Admin;

  const {
    isModalOpen: isModalDeleteAnimalOpen,
    handleOpenModal: handleOpenDeleteAnimalModal,
    handleCloseModal: handleCloseDeleteAnimalModal,
  } = useModal();

  const handleDeleteAnimal = () => {
    handleOpenDeleteAnimalModal();
  };

  const handleDeleteAnimalConfirm = () => {
    if (!animal?.id) return;
    deleteAnimalMutation(animal.id);
  };

  const {mutate: deleteAnimalMutation} = useMutation({
    mutationFn: async (id: string) => {
      return (await deleteAnimal(id)).data;
    },
    onSuccess: () => {
      if (!animal?.id) return;
      if (onDeleteSuccess) {
        onDeleteSuccess(animal.id);
      }
      handleCloseDeleteAnimalModal();
      handleCloseModal();
    },
    onError: (error) => {
      console.log(error);
      mutationErrorHandling(
        error,
        "Falha ao excluir o animal",
        setErrorMessage,
      );
    },
  });

  return {
    form,
    isReadOnly,
    canExcludeAnimal,
    handleDeleteAnimal,
    animalTypesData,
    isLoadingAnimalType,
    expensesFields,
    appendExpense,
    removeExpense,
    animalProceduresFields,
    appendAnimalProcedures,
    removeAnimalProcedures,
    animalProceduresExpensesFields,
    animalProceduresAppendExpense,
    animalProceduresRemoveExpense,
    handleAddAnimalProcedureExpense,
    handleRemoveAnimalProcedureExpense,
    getProceduresByType,
    handleCloseModal,
    submitting,
    handleButtonConfirm,
    onError,
    errorMessage,
    clearError,
    isModalDeleteAnimalOpen,
    handleCloseDeleteAnimalModal,
    handleDeleteAnimalConfirm,
  };
};
