import {getAdoptersPaginated} from "@/services/adopter";
import {getAnimalsPaginated} from "@/services/animal";
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
import {useEffect, useState} from "react";
import {toast} from "@/hooks/use-toast";
import {Role} from "@/constants/roles";
import {useModal} from "@/hooks/useModal";
import {useMutation, useQuery} from "@tanstack/react-query";

const PAGE_SIZE = 6;

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

  /** Animal search state */
  const [animalPage, setAnimalPage] = useState(1);
  const [searchTermAnimal, setSearchTermAnimal] = useState("");
  const [debouncedSearchAnimal, setDebouncedSearchAnimal] = useState("");

  /** Adopter search state */
  const [adopterPage, setAdopterPage] = useState(1);
  const [searchTermAdopter, setSearchTermAdopter] = useState("");
  const [debouncedSearchAdopter, setDebouncedSearchAdopter] = useState("");

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearchAnimal(searchTermAnimal),
      500,
    );
    return () => clearTimeout(timer);
  }, [searchTermAnimal]);

  useEffect(() => {
    const timer = setTimeout(
      () => setDebouncedSearchAdopter(searchTermAdopter),
      500,
    );
    return () => clearTimeout(timer);
  }, [searchTermAdopter]);

  /** Animal query — simple paginated (not infinite, since we control pages manually) */
  const {data: animalQueryData, isLoading: animalIsLoading} = useQuery({
    queryKey: ["animals", debouncedSearchAnimal, animalPage],
    queryFn: () =>
      getAnimalsPaginated(
        debouncedSearchAnimal,
        undefined,
        animalPage,
        PAGE_SIZE,
      ),
    staleTime: 30000,
  });

  const animalsData = {
    items: animalQueryData?.items ?? [],
    meta: animalQueryData?.meta,
  };
  const animalTotalPages = animalQueryData?.meta?.totalPages ?? 1;

  /** Adopter query */
  const {data: adopterQueryData, isLoading: adopterIsLoading} = useQuery({
    queryKey: ["adopters", debouncedSearchAdopter, adopterPage],
    queryFn: () =>
      getAdoptersPaginated(
        debouncedSearchAdopter,
        undefined,
        adopterPage,
        PAGE_SIZE,
      ),
    staleTime: 30000,
  });

  const adoptersData = {
    items: adopterQueryData?.items ?? [],
    meta: adopterQueryData?.meta,
  };
  const adopterTotalPages = adopterQueryData?.meta?.totalPages ?? 1;

  /** Mutations */
  const {mutate: createTermMutation} = useMutation({
    mutationFn: async (createTermDto: CreateTermDto) => {
      return (await createTerm(createTermDto)).data;
    },
    onSuccess: (data) => {
      setSubmitting(false);
      toast({
        title: "Sucesso",
        description: "Termo de compromisso criado com sucesso",
        variant: "success",
      });
      if (onCreateSuccess) {
        onCreateSuccess(data);
      }
      handleCloseModal();
    },
    onError: (error) => {
      setSubmitting(false);
      mutationErrorHandling(
        error,
        "Falha ao criar o termo de compromisso",
        setErrorMessage,
      );
    },
  });

  /** Actions */
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleButtonConfirm = (data: TermFormData) => {
    setSubmitting(true);

    if (mode === "create") {
      createTermMutation(data);
    }
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

    // Animal search
    searchTermAnimal,
    setSearchTermAnimal,
    animalsData,
    animalIsLoading,
    animalPage,
    setAnimalPage,
    animalTotalPages,

    // Adopter search
    searchTermAdopter,
    setSearchTermAdopter,
    adoptersData,
    adopterIsLoading,
    adopterPage,
    setAdopterPage,
    adopterTotalPages,
  };
};
