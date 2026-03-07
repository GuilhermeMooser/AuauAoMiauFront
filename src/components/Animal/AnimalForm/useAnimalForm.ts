import {getAuth} from "@/utils/auth";
import {AnimalFormProps} from ".";
import {useFieldArray, useForm} from "react-hook-form";
import {AnimalFormData} from "@/types/animal";
import {zodResolver} from "@hookform/resolvers/zod";
import {animalSchema} from "@/validations/Animal/schemas";
import {useFormError} from "@/hooks/useFormError";
import {useError} from "@/hooks/useError";
import {Role} from "@/constants/roles";
import {useModal} from "@/hooks/useModal";
import {useQuery} from "@tanstack/react-query";
import {getAnimalTypes} from "@/services/animal";
import {animalTypesCache} from "@/constants/cacheNames";
import {AnimalProcedureEnum, AnimalProcedures} from "@/types/animalProcedures";
import {type} from "os";

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
  const form = useForm<AnimalFormData>({
    resolver: zodResolver(animalSchema),
    defaultValues: {
      name: animal?.name ?? "",
      age: animal?.age ?? undefined,
      breed: animal?.breed ?? "",
      color: animal?.color ?? "",
      dtOfBirth: animal?.dtOfBirth ?? undefined,
      dtOfDeath: animal?.dtOfDeath ?? undefined,
      dtOfRescue: animal?.dtOfRescue ?? undefined,
      dtOfAdoption: animal?.dtOfAdoption ?? undefined,
      locationOfRescue: animal?.locationOfRescue ?? "",
      typeId: animal?.type.id ?? 0,
      size: animal?.size ?? "",
      gender: animal?.gender ?? "",
      additionalInfo: animal?.additionalInfo ?? "",
      castrated: animal?.castrated ?? false,
      animalProcedures: animal?.animalProcedures ?? [],
      expenses: animal?.expenses ?? [],
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

  const handleAddAnimalProcedureExpense = () => {};

  const handleRemoveAnimalProcedureExpense = () => {};

  const getProceduresByType = (typeString: string) => {
    const type = typeString as AnimalProcedureEnum;
    return animalProceduresFields
      .map((field, index) => ({...field, originalIndex: index}))
      .filter((field) => field.procedureType === type);
  };

  /** Delete Animal */
  const canExcludeAnimal =
    mode === "edit" && auth?.user.role.name === Role.Admin;

  const {
    isModalOpen: isModalDeleteAdopterOpen,
    handleOpenModal: handleOpenDeleteAdopterModal,
    handleCloseModal: handleCloseDeleteAdopterModal,
  } = useModal();

  const handleDeleteAnimal = () => {
    handleOpenDeleteAdopterModal();
  };

  // const handleDeleteAdopterConfirm = () => {
  //   if (!adopter?.id) return;
  //   deleteAdopterMutation(adopter.id);
  // };

  /** Fetch AnimalTypes */
  const {data: animalTypesData, isLoading: isLoadingAnimalType} = useQuery({
    queryKey: [animalTypesCache],
    queryFn: () => getAnimalTypes(),
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
  };
};
