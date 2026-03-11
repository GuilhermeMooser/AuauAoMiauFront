import {getAdoptersPaginated} from "@/services/adopter";
import {getAnimalsPaginated} from "@/services/animal";
import {PaginationUtils} from "@/utils/paginationUtils";
import {useInfiniteQuery, useMutation} from "@tanstack/react-query";
import {TermFormProps} from ".";
import {getAuth} from "@/utils/auth";
import {useForm} from "react-hook-form";
import {CreateTermDto, TermFormData} from "@/types/terms";
import {termSchema} from "@/validations/Terms/schemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {useFormError} from "@/hooks/useFormError";
import {useError} from "@/hooks/useError";
import {createTerm, deleteTerm} from "@/services/terms";
import {mutationErrorHandling} from "@/utils/errorHandling";
import {useState} from "react";
import {toast} from "@/hooks/use-toast";
import {Role} from "@/constants/roles";
import {useModal} from "@/hooks/useModal";

type Props = {
  term: TermFormProps["term"];
  mode: TermFormProps["mode"];
  onCancel: TermFormProps["onCancel"];
  onCreateSuccess: TermFormProps["onCreateSuccess"];
  onUpdateSuccess: TermFormProps["onUpdateSuccess"];
  onDeleteSuccess: TermFormProps["onDeleteSuccess"];
};

export const useTermForm = ({
  term,
  mode,
  onCancel,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
}: Props) => {
  const auth = getAuth();

  const form = useForm<TermFormData>({
    resolver: zodResolver(termSchema),
    defaultValues: {
      animalId: term?.animal.id || undefined,
      adopterId: term?.adopter.id || undefined,
    },
  });

  const {onError} = useFormError<TermFormData>();
  const {clearError, errorMessage, setErrorMessage} = useError();

  const isReadOnly = mode === "view";

  /** Mutations */

  const {mutate: createTermMutation} = useMutation({
    mutationFn: async (createTermDto: CreateTermDto) => {
      return (await createTerm(createTermDto)).data;
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
      mutationErrorHandling(error, "Falha ao criar o animal", setErrorMessage);
    },
  });

  /** Actions */
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleButtonConfirm = (data: TermFormData) => {
    setSubmitting(true);

    if (mode === "create") {
      createTermMutation(data);
    }
    // else if (mode === "edit") {
    //   if (!animal?.id) {
    //     setErrorMessage("O código do animal não pode ser nulo");
    //     return;
    //   }
    //   const dto: UpdateAnimalDto = {
    //     ...data,
    //     id: animal.id,
    //     expenses: mapExpensesToCreateOrUpdateDto(data.expenses),
    //     animalProcedures: mapProceduresToCreateUpdateDto(data.animalProcedures),
    //   };

    //   updateAnimalMutation(dto);
    // }
  };

  const handleCloseModal = () => {
    onCancel();
    form.reset();
  };

  /** Delete Term */
  const canExcludeTerm = mode === "edit" && auth?.user.role.name === Role.Admin;

  const {
    isModalOpen: isModalDeleteTermOpen,
    handleOpenModal: handleOpenDeleteTermModal,
    handleCloseModal: handleCloseDeleteTermModal,
  } = useModal();

  const handleDeleteTerm = () => {
    handleOpenDeleteTermModal();
  };

  const handleDeleteTermConfirm = () => {
    if (!term?.id) return;
    deleteTermMutation(term.id);
  };

  const {mutate: deleteTermMutation} = useMutation({
    mutationFn: async (id: string) => {
      return (await deleteTerm(id)).data;
    },
    onSuccess: () => {
      if (!term?.id) return;
      if (onDeleteSuccess) {
        onDeleteSuccess(term.id);
      }
      handleCloseDeleteTermModal();
      handleCloseModal();
    },
    onError: (error) => {
      mutationErrorHandling(
        error,
        "Falha ao excluir o termo de compromisso",
        setErrorMessage,
      );
    },
  });

  /** Animal Data */
  const {
    data: animalData,
    error: errorAnimalsFetch,
    fetchNextPage: animalFetchNextPage,
    hasNextPage: animalHasNextPage,
    isFetchingNextPage: animalIsFetchingNextPage,
    isLoading: animalIsLoading,
    refetch: animalRefetch,
  } = useInfiniteQuery({
    queryKey: ["animals", searchTermAnimal],
    queryFn: async ({pageParam = 1}) => {
      const response = getAnimalsPaginated(
        searchTermAnimal,
        undefined, //Sem Filtros
        pageParam,
        6,
      );
      return response;
    },
    getNextPageParam: (lastPage) => {
      const {currentPage, totalPages} = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: true,
    staleTime: 30000,
  });

  const animalsData = {
    items: animalData?.pages.flatMap((page) => page.items) ?? [],
    meta: animalData?.pages[animalData.pages.length - 1]?.meta,
  };

  /** Adopter Data */
  const {
    data: adopterData,
    error: errorAdoptersFetch,
    fetchNextPage: adopterFetchNextPage,
    hasNextPage: adopterHasNextPage,
    isFetchingNextPage: adopterIsFetchingNextPage,
    isLoading: adopterIsLoading,
    refetch: adopterRefetch,
  } = useInfiniteQuery({
    queryKey: ["adopters", searchTermAdopter],
    queryFn: async ({pageParam = 1}) => {
      const response = getAdoptersPaginated(
        searchTermAdopter,
        undefined,
        pageParam,
        6,
      );
      return response;
    },
    getNextPageParam: (lastPage) => {
      const {currentPage, totalPages} = lastPage.meta;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: true,
    staleTime: 30000,
  });

  const adoptersData = {
    items: adopterData?.pages.flatMap((page) => page.items) ?? [],
    meta: adopterData?.pages[adopterData.pages.length - 1]?.meta,
  };

  return {
    form,
    isReadOnly,
    canExcludeTerm,
    handleDeleteTerm,
    handleCloseModal,
    submitting,
    handleButtonConfirm,
    onError,
    errorMessage,
    clearError,
    isModalDeleteTermOpen,
    handleCloseDeleteTermModal,
    handleDeleteTermConfirm,
  };
};
