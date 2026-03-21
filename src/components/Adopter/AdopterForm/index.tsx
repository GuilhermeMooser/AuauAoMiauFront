import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAdopterForm } from "./useAdopterForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  BellOff,
  FileText,
  Link,
  Loader2,
  MapPin,
  Phone,
  Plus,
  Trash2,
  User,
} from "lucide-react";
import { Adopter } from "@/types";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { MaskedInput } from "@/components/ui/masked-input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Alert from "@/components/Alert";
import Icon from "@/components/Icon";
import ConfirmModal from "@/components/ConfirmModal";
import { Label } from "@/components/ui/label";

export type AdopterFormProps = {
  adopter?: Adopter;
  onCancel: () => void;
  mode: "create" | "edit" | "view";
  onCreateSuccess?: (newAdopter: Adopter) => void;
  onUpdateSuccess?: (updatedAdopter: Adopter) => void;
  onDeleteSuccess?: (deletedId: string) => void;
};

export default function AdopterForm({
  adopter,
  mode,
  onCancel,
  onCreateSuccess,
  onUpdateSuccess,
  onDeleteSuccess,
}: AdopterFormProps) {
  const {
    form,
    isReadOnly,
    activeNotificationWatcher,
    contatosFields,
    enderecosFields,
    statesData,
    loadingLocations,
    prState,
    citiesData,
    submitting,
    errorMessage,
    isModalDeleteAdopterOpen,
    canExcludeAdopter,
    getCitiesForAddress,
    handleCloseDeleteAdopterModal,
    clearError,
    onError,
    handleCloseModal,
    handleButtonConfirm,
    handleStateChange,
    handleCityChange,
    getCurrentStateUfId,
    getCurrentCityId,
    appendEndereco,
    removeEndereco,
    removeContato,
    appendContato,
    getContactMask,
    handlePrincipalChange,
    canSetPrincipal,
    handleDeleteAdopter,
    handleDeleteAdopterConfirm,
    navigate,
    isCreateMode
  } = useAdopterForm({
    adopter,
    mode,
    onCancel,
    onCreateSuccess,
    onUpdateSuccess,
    onDeleteSuccess,
  });

  return (
    <>
      <Form {...form}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Pessoais
              </div>
              {canExcludeAdopter && (
                <div
                  className="transition hover:text-red-500"
                  onClick={handleDeleteAdopter}
                >
                  <Icon name="Trash2" />
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>*Nome Completo</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isReadOnly}
                        placeholder="Nome Completo"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>*Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={isReadOnly}
                        placeholder="email@gmail.com"
                        className="bg-[#020817] border border-border text-white"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dtOfBirth"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>*Data de Nascimento</FormLabel>
                    <FormControl className="bg-[#020817]">
                      <DatePicker
                        disabled={isReadOnly}
                        date={field.value}
                        onDateChange={field.onChange}
                        placeholder="Selecione a data"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="rg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RG</FormLabel>
                    <FormControl>
                      <MaskedInput
                        mask="99.999.999-9"
                        {...field}
                        disabled={isReadOnly}
                        placeholder="00.000.000-0"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cpf"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>*CPF</FormLabel>
                    <FormControl>
                      <MaskedInput
                        mask="999.999.999-99"
                        {...field}
                        disabled={isReadOnly}
                        placeholder="000.000.000-00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="activeNotification"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isReadOnly}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="flex items-center gap-2">
                        {field.value ? (
                          <Bell className="h-4 w-4" />
                        ) : (
                          <BellOff className="h-4 w-4" />
                        )}
                        Ativar notificações de contato
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Quando ativo, você será notificado para entrar em
                        contato conforme o prazo configurado
                      </p>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <div
              className={`grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg ${!activeNotificationWatcher ? "hidden" : ""
                }`}
            >
              <FormField
                control={form.control}
                name="dtToNotify"
                render={({ field }) => (
                  <FormItem id="dtToNotify" className="flex flex-col">
                    <FormLabel>Data do próximo contato</FormLabel>
                    <FormControl className="bg-[#020817]">
                      <DatePicker
                        disabled={isReadOnly || !activeNotificationWatcher}
                        date={field.value ?? null}
                        disablePastDates
                        onDateChange={field.onChange}
                        placeholder="Selecione a data para próximo contato"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="profession"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>*Profissão</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isReadOnly}
                        placeholder="Profissão"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="civilState"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>*Estado Civil</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isReadOnly}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o estado civil" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="solteiro">Solteiro(a)</SelectItem>
                        <SelectItem value="casado">Casado(a)</SelectItem>
                        <SelectItem value="divorciado">
                          Divorciado(a)
                        </SelectItem>
                        <SelectItem value="viuvo">Viúvo(a)</SelectItem>
                        <SelectItem value="uniao_estavel">
                          União Estável
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Contatos
            </CardTitle>
            <CardDescription>
              Adicione múltiplos contatos para o adotante
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contatosFields.map((field, index) => (
              <Card key={field.id} className="border-border">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="outline">Contato {index + 1}</Badge>

                    {!isReadOnly && contatosFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContato(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name={`contacts.${index}.type`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>*Tipo</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={isReadOnly}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="telefone">Telefone</SelectItem>
                              <SelectItem value="celular">Celular</SelectItem>
                              <SelectItem value="whatsapp">WhatsApp</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`contacts.${index}.value`}
                      render={({ field }) => {
                        const mask = getContactMask(index);

                        return (
                          <FormItem>
                            <FormLabel>*Valor</FormLabel>
                            <FormControl>
                              {mask ? (
                                <MaskedInput
                                  mask={mask}
                                  {...field}
                                  disabled={isReadOnly}
                                  placeholder="(00) 00000-0000"
                                />
                              ) : (
                                <Input {...field} disabled={isReadOnly} />
                              )}
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />

                    <FormField
                      control={form.control}
                      name={`contacts.${index}.isPrincipal`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Principal</FormLabel>
                          <FormControl>
                            <Select
                              disabled={isReadOnly}
                              value={field.value ? "true" : "false"}
                              onValueChange={(v) =>
                                handlePrincipalChange(index, v === "true")
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem
                                  value="true"
                                  disabled={!canSetPrincipal(index)}
                                >
                                  Sim
                                </SelectItem>
                                <SelectItem value="false">Não</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {!isReadOnly && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendContato({
                    type: "celular",
                    value: "",
                    isPrincipal: false,
                  })
                }
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Contato
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereços
            </CardTitle>
            <CardDescription>
              Adicione múltiplos endereços para o adotante
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {enderecosFields.map((field, index) => {
              const currentStateId = getCurrentStateUfId(index);
              const currentCityId = getCurrentCityId(index);

              return (
                <Card key={field.id} className="border-border">
                  <CardContent className="pt-4">
                    <div className="flex items-center justify-between mb-4">
                      <Badge variant="outline">Endereço {index + 1}</Badge>
                      {!isReadOnly && enderecosFields.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeEndereco(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="md:col-span-3">
                          <FormField
                            control={form.control}
                            name={`addresses.${index}.street`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>*Rua</FormLabel>
                                <FormControl>
                                  <Input
                                    {...field}
                                    disabled={isReadOnly}
                                    placeholder="Ex: R. Capitão Frederico"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name={`addresses.${index}.number`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>*Número</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={field.value ?? ""}
                                  onChange={(e) => {
                                    const value = e.target.value.replace(
                                      /\D/g,
                                      ""
                                    );
                                    field.onChange(
                                      value === "" ? undefined : Number(value)
                                    );
                                  }}
                                  disabled={isReadOnly}
                                  inputMode="numeric"
                                  placeholder="Ex: 123"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name={`addresses.${index}.neighborhood`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>*Bairro</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  disabled={isReadOnly}
                                  placeholder="Ex: Centro"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`addresses.${index}.city.stateUf.id`}
                          render={() => (
                            <FormItem>
                              <FormLabel>*Estado</FormLabel>
                              <Select
                                onValueChange={(value) =>
                                  handleStateChange(index, value)
                                }
                                value={
                                  currentStateId > 0
                                    ? currentStateId.toString()
                                    : undefined
                                }
                                disabled={isReadOnly || loadingLocations}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {statesData?.map((uf) => (
                                    <SelectItem
                                      key={uf.id}
                                      value={uf.id.toString()}
                                    >
                                      {uf.acronym} - {uf.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />

                        <FormField
                          key={`city-${index}-${currentStateId}`}
                          control={form.control}
                          name={`addresses.${index}.city.id`}
                          render={() => (
                            <FormItem className="md:col-span-2">
                              <FormLabel>*Cidade</FormLabel>
                              <Select
                                onValueChange={(value) =>
                                  handleCityChange(index, value)
                                }
                                value={
                                  currentCityId > 0
                                    ? currentCityId.toString()
                                    : undefined
                                }
                                disabled={
                                  isReadOnly ||
                                  loadingLocations ||
                                  !currentStateId
                                }
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a cidade" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {getCitiesForAddress(index)?.map((city) => (
                                    <SelectItem
                                      key={city.id}
                                      value={city.id.toString()}
                                    >
                                      {city.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {!isReadOnly && (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  appendEndereco({
                    street: "",
                    neighborhood: "",
                    number: undefined,
                    city: {
                      id: 0,
                      name: "",
                      stateUf: prState || { id: 0, name: "", acronym: "" },
                    },
                  })
                }
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Endereço
              </Button>
            )}
          </CardContent>
        </Card>

        {!isCreateMode && (
          <>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="h-5 w-5" />
                  Animais Vinculados
                </CardTitle>
                <CardDescription>Animais associados a este adotante</CardDescription>
              </CardHeader>
              <CardContent>
                {!adopter?.animals?.length ? (
                  <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                    Nenhum animal vinculado.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {adopter.animals.map((animal) => (
                      <button
                        key={animal.id}
                        type="button"
                        onClick={() => navigate(`/admin/animais`)}
                        className="flex flex-col items-start gap-1 rounded-lg border border-border bg-background p-3 text-left text-sm transition-all hover:border-primary/60 hover:bg-muted/40 cursor-pointer"
                      >
                        <span className="font-medium truncate w-full">{animal.name}</span>
                        {animal.breed && (
                          <span className="text-xs text-muted-foreground truncate w-full">
                            {animal.breed}
                          </span>
                        )}
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {animal.type && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {animal.type.type}
                            </Badge>
                          )}
                          {animal.age != null && (
                            <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                              {animal.age} {animal.age === 1 ? "ano" : "anos"}
                            </Badge>
                          )}
                          {animal.castrated && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                              Castrado
                            </Badge>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Termos de Compromisso
                </CardTitle>
                <CardDescription>Termos associados a este adotante</CardDescription>
              </CardHeader>
              <CardContent>
                {!adopter?.terms?.length ? (
                  <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                    Nenhum termo de compromisso vinculado.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {adopter.terms.map((term, index) => (
                      <button
                        key={term.id}
                        type="button"
                        onClick={() => navigate(`/admin/termos`)}
                        className="flex flex-col items-start gap-1 rounded-lg border border-border bg-background p-3 text-left text-sm transition-all hover:border-primary/60 hover:bg-muted/40 cursor-pointer"
                      >
                        <span className="font-medium">Termo {index + 1}</span>
                        <span className="text-xs text-muted-foreground truncate w-full">
                          {term.id}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}


        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={handleCloseModal}>
            {isReadOnly ? "Fechar" : "Cancelar"}
          </Button>
          {!isReadOnly && (
            <Button onClick={form.handleSubmit(handleButtonConfirm, onError)}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === "edit" ? "Atualizando..." : "Cadastrando..."}
                </>
              ) : (
                <>{mode === "edit" ? "Atualizar" : "Cadastrar"}</>
              )}
            </Button>
          )}
        </div>
      </Form>

      <Alert
        content={errorMessage}
        isOpen={!!errorMessage}
        onClose={clearError}
      />

      <ConfirmModal
        isOpen={isModalDeleteAdopterOpen}
        onClose={handleCloseDeleteAdopterModal}
        onNotConfirm={handleCloseDeleteAdopterModal}
        onConfirm={handleDeleteAdopterConfirm}
        content={"Deseja excluir este adotante ?"}
      />
    </>
  );
}
