import { AdopterFormData, CreateAdopterDto, UpdateAdopterDto } from "@/types";
import { adopterSchema } from "@/validations/Adopter/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { AdopterFormProps } from ".";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { cityCache, stateUfCache } from "@/constants/cacheNames";
import { City, locationService } from "@/services/locationService";
import { toast } from "@/hooks/use-toast";
import { useFormError } from "@/hooks/useFormError";
import {
  createAdopter,
  deleteAdopter,
  updateAdopter,
} from "@/services/adopter";
import { mutationErrorHandling } from "@/utils/errorHandling";
import { useError } from "@/hooks/useError";
import { useModal } from "@/hooks/useModal";
import { getAuth } from "@/utils/auth";
import { Role } from "@/constants/roles";

type Props = {
  adopter: AdopterFormProps["adopter"];
  mode: AdopterFormProps["mode"];
  onCancel: AdopterFormProps["onCancel"];
  onCreateSuccess: AdopterFormProps["onCreateSuccess"];
  onUpdateSuccess: AdopterFormProps["onUpdateSuccess"];
  onDeleteSuccess: AdopterFormProps["onDeleteSuccess"];
};

export const useAdopterForm = ({
  adopter,
  mode,
  onCancel,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
}: Props) => {
  const auth = getAuth();

  /** Form */
  const form = useForm<AdopterFormData>({
    resolver: zodResolver(adopterSchema),
    defaultValues: {
      name: adopter?.name || "",
      email: adopter?.email || "",
      dtOfBirth: adopter?.dtOfBirth ? new Date(adopter.dtOfBirth) : undefined,
      rg: adopter?.rg || "",
      cpf: adopter?.cpf || "",
      activeNotification: adopter?.activeNotification || false,
      profession: adopter?.profession || "",
      civilState: adopter?.civilState || undefined,
      dtToNotify: adopter?.dtToNotify ? new Date(adopter.dtToNotify) : null,
      addresses: adopter?.addresses || [],
      contacts: adopter?.contacts || [],
    },
  });

  const { onError } = useFormError<AdopterFormData>();
  const { clearError, errorMessage, setErrorMessage } = useError();
  const activeNotificationWatcher = form.watch("activeNotification");
  const isReadOnly = mode === "view";

  /** ========== CONTACTS ========== */
  const {
    fields: contatosFields,
    append: appendContato,
    remove: removeContato,
  } = useFieldArray({
    control: form.control,
    name: "contacts",
  });

  useEffect(() => {
    const contacts = form.getValues("contacts");
    if (contacts?.length > 0 && !contacts.some((c) => c.isPrincipal)) {
      form.setValue("contacts.0.isPrincipal", true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contatosFields.length]);

  useEffect(() => {
    if (mode === "create" && contatosFields.length === 0) {
      appendContato({
        type: "celular",
        value: "",
        isPrincipal: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const getContactMask = (index: number) => {
    const type = form.watch(`contacts.${index}.type`);
    if (type === "telefone" || type === "celular" || type === "whatsapp") {
      return "(99) 99999-9999";
    }
    return "";
  };

  const principalCount = form
    .watch("contacts")
    ?.filter((c) => c.isPrincipal).length;

  const handlePrincipalChange = (index: number, newValue: boolean) => {
    const contacts = form.getValues("contacts");
    if (newValue && principalCount > 0) {
      const updated = contacts.map((c, i) => ({
        ...c,
        isPrincipal: i === index,
      }));
      form.setValue("contacts", updated);
      return;
    }
    form.setValue(`contacts.${index}.isPrincipal`, newValue);
  };

  const canSetPrincipal = (index: number) => {
    const current = form.watch(`contacts.${index}.isPrincipal`);
    return current || principalCount === 0;
  };

  /** ========== ADDRESSES ========== */
  const {
    fields: enderecosFields,
    append: appendEndereco,
    remove: removeEndereco,
  } = useFieldArray({
    control: form.control,
    name: "addresses",
  });

  const { data: statesData = [], isLoading: isLoadingStates } = useQuery({
    queryKey: [stateUfCache],
    queryFn: () => locationService.getUFs(),
  });

  const prState = statesData.find((uf) => uf.acronym === "PR");
  const prUfId = prState?.id;

  useEffect(() => {
    if (mode === "create" && prState && enderecosFields.length === 0) {
      appendEndereco(
        {
          street: "",
          neighborhood: "",
          number: undefined,
          city: {
            id: 0,
            name: "",
            stateUf: {
              id: prState.id,
              name: prState.name,
              acronym: prState.acronym,
            },
          },
        },
        { shouldFocus: false }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prState, mode]);

  const [citiesByState, setCitiesByState] = useState<Record<number, City[]>>(
    {}
  );

  const addresses = form.watch("addresses") || [];
  const uniqueStateIds = Array.from(
    new Set(
      addresses
        .map((addr) => addr?.city?.stateUf?.id)
        .filter((id): id is number => id !== undefined && id > 0)
    )
  );

  const citiesQueries = useQuery({
    queryKey: [`${cityCache}-multiple`, uniqueStateIds.sort().join(",")],
    queryFn: async () => {
      const results: Record<number, City[]> = {};

      await Promise.all(
        uniqueStateIds.map(async (stateId) => {
          const cities = await locationService.getCitiesByUF(stateId);
          results[stateId] = cities;
        })
      );

      return results;
    },
    enabled: uniqueStateIds.length > 0,
  });

  useEffect(() => {
    if (citiesQueries.data) {
      setCitiesByState(citiesQueries.data);
    }
  }, [citiesQueries.data]);

  const getCitiesForState = (stateId: number) => {
    return citiesByState[stateId] || [];
  };

  const selectedStateId = form.watch("addresses.0.city.stateUf.id") || prUfId;
  const citiesData = getCitiesForState(selectedStateId || 0);

  const getCurrentStateUfId = (index: number) => {
    return form.watch(`addresses.${index}.city.stateUf.id`) || 0;
  };

  const getCurrentCityId = (index: number) => {
    return form.watch(`addresses.${index}.city.id`) || 0;
  };

  const handleStateChange = (index: number, value: string) => {
    const selectedUF = statesData.find((uf) => uf.id === Number(value));
    if (!selectedUF) return;

    form.setValue(`addresses.${index}.city.stateUf`, selectedUF);

    form.setValue(`addresses.${index}.city.id`, 0);
    form.setValue(`addresses.${index}.city.name`, "");
  };

  const handleCityChange = (index: number, value: string) => {
    const stateId = getCurrentStateUfId(index);
    const cities = getCitiesForState(stateId);
    const selectedCity = cities.find((c) => c.id === Number(value));

    if (selectedCity) {
      form.setValue(`addresses.${index}.city`, selectedCity, {
        shouldValidate: true,
      });
    }
  };

  const getCitiesForAddress = (index: number) => {
    const stateId = getCurrentStateUfId(index);
    return getCitiesForState(stateId);
  };

  const loadingLocations = isLoadingStates || citiesQueries.isLoading;
  const isLoadingCities = citiesQueries.isLoading;

  /**Actions */
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleButtonConfirm = (data: AdopterFormData) => {
    if (data.activeNotification && !data.dtToNotify) {
      verifyNotificationConfig(data);
      return;
    }

    if (mode === "create") {
      createAdopterMutation(data);
    } else if (mode === "edit") {
      if (!adopter?.id) {
        setErrorMessage("O código do adotante não pode ser nulo");
        return;
      }
      updateAdopterMutation({
        id: adopter.id,
        ...data,
      });
    }
    setSubmitting(true);
  };

  const handleCloseModal = () => {
    onCancel();
    form.reset();
  };

  /**Mutations */
  const { mutate: createAdopterMutation } = useMutation({
    mutationFn: async (createAdopterDto: CreateAdopterDto) => {
      return (await createAdopter(createAdopterDto)).data;
    },
    onSuccess: (data) => {
      setSubmitting(false);
      toast({
        title: "Sucesso",
        description: "Adotante criado com sucesso",
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
        "Falha ao criar o adotante",
        setErrorMessage
      );
    },
  });

  const { mutate: updateAdopterMutation } = useMutation({
    mutationFn: async (updateAdopterDto: UpdateAdopterDto) => {
      return (await updateAdopter({ ...updateAdopterDto })).data;
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
        setErrorMessage
      );
    },
  });

  /**Technical Adjustment */
  const verifyNotificationConfig = (data: AdopterFormData) => {
    if (data.activeNotification && !data.dtToNotify) {
      form.setError("dtToNotify", {
        type: "manual",
        message:
          "Data de notificação é obrigatória quando notificações estão ativas",
      });
      toast({
        title: "Verifique os campos",
        description:
          "Data de notificação é obrigatória quando notificações estão ativas",
        variant: "destructive",
      });
      document.getElementById("dtToNotify")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };
  
  /** Delete Adopter */
  const canExcludeAdopter =
    mode === "edit" && auth?.user.role.name === Role.Admin;

  const {
    isModalOpen: isModalDeleteAdopterOpen,
    handleOpenModal: handleOpenDeleteAdopterModal,
    handleCloseModal: handleCloseDeleteAdopterModal,
  } = useModal();

  const handleDeleteAdopter = () => {
    handleOpenDeleteAdopterModal();
  };

  const handleDeleteAdopterConfirm = () => {
    if (!adopter?.id) return;
    deleteAdopterMutation(adopter.id);
  };

  const { mutate: deleteAdopterMutation } = useMutation({
    mutationFn: async (id: string) => {
      return (await deleteAdopter(id)).data;
    },
    onSuccess: () => {
      if (!adopter?.id) return;
      if (onDeleteSuccess) {
        onDeleteSuccess(adopter.id);
      }
      handleCloseDeleteAdopterModal();
      handleCloseModal();
    },
    onError: (error) => {
      mutationErrorHandling(
        error,
        "Falha ao excluir o adotante",
        setErrorMessage
      );
    },
  });

  return {
    form,
    isReadOnly,
    activeNotificationWatcher,
    contatosFields,
    submitting,
    enderecosFields,
    statesData,
    citiesData,
    loadingLocations,
    isLoadingStates,
    isLoadingCities,
    prUfId,
    prState,
    errorMessage,
    isModalDeleteAdopterOpen,
    canExcludeAdopter,
    getCitiesForState,
    handleDeleteAdopterConfirm,
    handleDeleteAdopter,
    handleCloseDeleteAdopterModal,
    clearError,
    onError,
    getCitiesForAddress,
    appendContato,
    removeContato,
    getContactMask,
    handlePrincipalChange,
    canSetPrincipal,
    appendEndereco,
    removeEndereco,
    handleStateChange,
    handleCityChange,
    getCurrentStateUfId,
    getCurrentCityId,
    handleButtonConfirm,
    handleCloseModal,
  };
};
