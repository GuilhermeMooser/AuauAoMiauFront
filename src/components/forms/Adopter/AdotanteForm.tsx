// import React, { useState, useEffect } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { format } from "date-fns";
// import {
//   Plus,
//   Trash2,
//   User,
//   Phone,
//   MapPin,
//   Calendar,
//   CalendarIcon,
//   Briefcase,
//   Heart,
//   Bell,
//   BellOff,
//   Link,
//   Search,
//   X,
//   Loader2,
// } from "lucide-react";
// import { toast } from "@/hooks/use-toast";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Checkbox } from "@/components/ui/checkbox";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { MaskedInput } from "@/components/ui/masked-input";
// import { cn } from "@/lib/utils";
// import { locationService, City, UF } from "@/services/locationService";
// import { Adopter } from "@/types";
// import { adopterSchema } from "../../../validations/Adopter/schemas";
// import { useFieldArray, useForm } from "react-hook-form";
// import { formatDate } from "@/utils/formatDate";
// import { formatPhoneNumber } from "@/utils/format";

// type AdopterFormProps = {
//   adopter?: Adopter;
//   onSubmit: (data: AdotanteFormData) => void;
//   onCancel: () => void;
//   mode: "create" | "edit" | "view";
// };

// const AdopterForm: React.FC<AdopterFormProps> = ({
//   adopter,
//   onSubmit,
//   onCancel,
//   mode,
// }) => {
//   // Location states
//   const [ufs, setUfs] = useState<UF[]>([]);
//   const [cities, setCities] = useState<City[]>([]);
//   const [loadingLocations, setLoadingLocations] = useState(false);
//   const [selectedUfId, setSelectedUfId] = useState<number | null>(null);
//   const [prUfId, setPrUfId] = useState<number | null>(null);

//   // Search states
//   const [animalSearch, setAnimalSearch] = useState("");
//   const [showAnimalResults, setShowAnimalResults] = useState(false);

//   // Load UFs and Cities on mount - PR as default
//   useEffect(() => {
//     const loadLocations = async () => {
//       setLoadingLocations(true);
//       try {
//         const ufsData = await locationService.getUFs();
//         setUfs(ufsData);

//         // Encontrar o Paraná e definir como default
//         const parana = ufsData.find((uf) => uf.acronym === "PR");
//         if (parana) {
//           setPrUfId(parana.id);
//           setSelectedUfId(parana.id);

//           // Buscar cidades do Paraná
//           const citiesData = await locationService.getCitiesByUF(parana.id);
//           setCities(citiesData);

//           // Definir PR como default no primeiro endereço se estiver criando
//           if (!adopter) {
//             form.setValue("addresses.0.city", {
//               id: 0,
//               name: "",
//               stateUf: {
//                 id: parana.id,
//                 name: "Paraná",
//                 acronym: "PR",
//               },
//             });
//           }
//         }
//       } catch (error) {
//         console.error("Erro ao carregar localizações:", error);
//       } finally {
//         setLoadingLocations(false);
//       }
//     };
//     loadLocations();
//   }, []);

//   // Helper function to load cities by UF
//   const loadCitiesByUF = async (ufId: number) => {
//     if (!ufId) return;
//     try {
//       setLoadingLocations(true);
//       const citiesData = await locationService.getCitiesByUF(ufId);
//       setCities(citiesData);
//     } catch (error) {
//       console.error("Erro ao carregar cidades:", error);
//     } finally {
//       setLoadingLocations(false);
//     }
//   };

//   const form = useForm<AdotanteFormData>({
//     resolver: zodResolver(adopterSchema),
//     defaultValues: {
//       name: adopter?.name || "",
//       email: adopter?.email || "",
//       dtOfBirth: adopter?.dtOfBirth || undefined,
//       rg: adopter?.rg || "",
//       cpf: adopter?.cpf || "",
//       contacts: adopter?.contacts || [
//         { type: "celular" as const, value: "", isPrincipal: true },
//       ],
//       profession: adopter?.profession || "",
//       civilState: adopter?.civilState || "solteiro",
//       addresses: adopter?.addresses?.map((addr) => ({
//         ...addr,
//         number: addr.number || undefined, // Converter 0 para undefined
//       })) || [
//         {
//           street: "",
//           neighborhood: "",
//           number: undefined,
//           city: {
//             id: 0,
//             name: "",
//             stateUf: {
//               id: prUfId || 0,
//               name: "Paraná",
//               acronym: "PR",
//             },
//           },
//         },
//       ],
//       dtToNotify: adopter?.dtToNotify,
//       activeNotification: adopter?.activeNotification ?? true,
//       animalsIds: [],
//     },
//   });

//   const {
//     fields: contatosFields,
//     append: appendContato,
//     remove: removeContato,
//   } = useFieldArray({
//     control: form.control,
//     name: "contacts",
//   });

//   const {
//     fields: enderecosFields,
//     append: appendEndereco,
//     remove: removeEndereco,
//   } = useFieldArray({
//     control: form.control,
//     name: "addresses",
//   });

//   const isReadOnly = mode === "view";

//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async (data: AdotanteFormData) => {
//     console.log(data);
//     if (isReadOnly) return;
//     try {
//       setSubmitting(true);
//       await Promise.resolve(onSubmit(data));
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const getContatoTypeLabel = (tipo: string) => {
//     const labels = {
//       telefone: "Telefone",
//       celular: "Celular",
//       email: "Email",
//       whatsapp: "WhatsApp",
//     };
//     return labels[tipo as keyof typeof labels];
//   };

//   const getEnderecoTypeLabel = (tipo: string) => {
//     const labels = {
//       residencial: "Residencial",
//       comercial: "Comercial",
//       outro: "Outro",
//     };
//     return labels[tipo as keyof typeof labels];
//   };

//   const getEstadoCivilLabel = (estado: string) => {
//     const labels = {
//       solteiro: "Solteiro(a)",
//       casado: "Casado(a)",
//       divorciado: "Divorciado(a)",
//       viuvo: "Viúvo(a)",
//       uniao_estavel: "União Estável",
//     };
//     return labels[estado as keyof typeof labels];
//   };

//   // const filteredAnimais = availableAnimais.filter(animal =>
//   //   animal.nome.toLowerCase().includes(animalSearch.toLowerCase()) ||
//   //   animal.raca.toLowerCase().includes(animalSearch.toLowerCase())
//   // );

//   // const getLinkedAnimais = () => {
//   //   const linkedIds = form.watch('animaisVinculados') || [];
//   //   return availableAnimais.filter(animal => linkedIds.includes(animal.id));
//   // };

//   // const linkAnimal = (animalId: string) => {
//   //   const currentValues = form.getValues('animaisVinculados') || [];
//   //   if (!currentValues.includes(animalId)) {
//   //     form.setValue('animaisVinculados', [...currentValues, animalId]);
//   //   }
//   //   setAnimalSearch('');
//   //   setShowAnimalResults(false);
//   // };

//   // const unlinkAnimal = (animalId: string) => {
//   //   const currentValues = form.getValues('animaisVinculados') || [];
//   //   form.setValue('animaisVinculados', currentValues.filter(id => id !== animalId));
//   // };

//   return (
//     <Form {...form}>
//       <form
//         onSubmit={form.handleSubmit(handleSubmit, (errors) => {
//           console.log("errors", errors);
//           const firstKey = Object.keys(errors)[0] as
//             | keyof typeof errors
//             | undefined;
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           const firstMsg = firstKey
//             ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
//               (errors as any)[firstKey]?.message
//             : undefined;
//           toast({
//             title: "Verifique os campos",
//             description:
//               firstMsg || "Preencha os campos obrigatórios corretamente.",
//             variant: "destructive",
//           });
//         })}
//         className="space-y-6"
//       >
//         {/* Basic Info */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <User className="h-5 w-5" />
//               Informações Pessoais
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="grid grid-cols-1 gap-4">
//               <FormField
//                 control={form.control}
//                 name="name"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Nome Completo</FormLabel>
//                     <FormControl>
//                       <Input {...field} disabled={isReadOnly} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="email"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-col">
//                     <FormLabel>Email</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="email"
//                         {...field}
//                         disabled={isReadOnly}
//                         placeholder="email@exemplo.com"
//                         className="bg-[#020817] border border-border text-white" // mesmo fundo e borda
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />

//               <FormField
//                 control={form.control}
//                 name="dtOfBirth"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Data de Nascimento</FormLabel>
//                     <FormControl>
//                       <Input
//                         type="date"
//                         disabled={isReadOnly}
//                         value={
//                           field.value
//                             ? formatDate(field.value, { dateStyle: "short" })
//                             : ""
//                         }
//                         onChange={(e) => {
//                           const dateValue = e.target.value
//                             ? new Date(e.target.value)
//                             : undefined;
//                           field.onChange(dateValue);
//                         }}
//                         className="bg-[#0a0f1a] border border-border text-white"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="rg"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>RG</FormLabel>
//                     <FormControl>
//                       <MaskedInput
//                         mask="99.999.999-9"
//                         {...field}
//                         disabled={isReadOnly}
//                         placeholder="00.000.000-0"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="cpf"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>CPF</FormLabel>
//                     <FormControl>
//                       <MaskedInput
//                         mask="999.999.999-99"
//                         {...field}
//                         disabled={isReadOnly}
//                         placeholder="000.000.000-00"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="activeNotification"
//                 render={({ field }) => (
//                   <FormItem className="flex flex-row items-start space-x-3 space-y-0">
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         disabled={isReadOnly}
//                       />
//                     </FormControl>
//                     <div className="space-y-1 leading-none">
//                       <FormLabel className="flex items-center gap-2">
//                         {field.value ? (
//                           <Bell className="h-4 w-4" />
//                         ) : (
//                           <BellOff className="h-4 w-4" />
//                         )}
//                         Ativar notificações de contato
//                       </FormLabel>
//                       <p className="text-xs text-muted-foreground">
//                         Quando ativo, você será notificado para entrar em
//                         contato conforme o prazo configurado
//                       </p>
//                     </div>
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Contact Configuration */}
//             {form.watch("activeNotification") && (
//               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
//                 <FormField
//                   control={form.control}
//                   name="dtToNotify"
//                   render={({ field }) => (
//                     <FormItem className="flex flex-col">
//                       <FormLabel>Data do próximo contato</FormLabel>
//                       <Popover>
//                         <PopoverTrigger asChild>
//                           <FormControl>
//                             <Button
//                               variant="outline"
//                               className={cn(
//                                 "w-full pl-3 text-left font-normal",
//                                 !field.value && "text-muted-foreground"
//                               )}
//                               disabled={
//                                 isReadOnly || !form.watch("activeNotification")
//                               }
//                             >
//                               {field.value ? (
//                                 format(field.value, "dd/MM/yyyy")
//                               ) : (
//                                 <span>Selecionar data</span>
//                               )}
//                               <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
//                             </Button>
//                           </FormControl>
//                         </PopoverTrigger>
//                         <PopoverContent className="w-auto p-0" align="start">
//                           <CalendarComponent
//                             mode="single"
//                             selected={field.value}
//                             onSelect={field.onChange}
//                             disabled={(date) => date < new Date()}
//                             initialFocus
//                             className={cn("p-3 pointer-events-auto")}
//                           />
//                         </PopoverContent>
//                       </Popover>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//               </div>
//             )}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <FormField
//                 control={form.control}
//                 name="profession"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Profissão</FormLabel>
//                     <FormControl>
//                       <Input {...field} disabled={isReadOnly} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="civilState"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Estado Civil</FormLabel>
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                       disabled={isReadOnly}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Selecione o estado civil" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="solteiro">Solteiro(a)</SelectItem>
//                         <SelectItem value="casado">Casado(a)</SelectItem>
//                         <SelectItem value="divorciado">
//                           Divorciado(a)
//                         </SelectItem>
//                         <SelectItem value="viuvo">Viúvo(a)</SelectItem>
//                         <SelectItem value="uniao_estavel">
//                           União Estável
//                         </SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Contacts */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Phone className="h-5 w-5" />
//               Contatos
//             </CardTitle>
//             <CardDescription>
//               Adicione múltiplos contatos para o adotante
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {contatosFields.map((field, index) => (
//               <Card key={field.id} className="border-border">
//                 <CardContent className="pt-4">
//                   <div className="flex items-center justify-between mb-4">
//                     <Badge variant="outline">Contato {index + 1}</Badge>
//                     {!isReadOnly && contatosFields.length > 1 && (
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="sm"
//                         onClick={() => removeContato(index)}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     )}
//                   </div>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                     <FormField
//                       control={form.control}
//                       name={`contacts.${index}.type`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Tipo</FormLabel>
//                           <Select
//                             onValueChange={field.onChange}
//                             defaultValue={field.value}
//                             disabled={isReadOnly}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               <SelectItem value="telefone">Telefone</SelectItem>
//                               <SelectItem value="celular">Celular</SelectItem>
//                               <SelectItem value="whatsapp">WhatsApp</SelectItem>
//                             </SelectContent>
//                           </Select>
//                           <FormMessage />
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name={`contacts.${index}.value`}
//                       render={({ field }) => {
//                         const contactType = form.watch(
//                           `contacts.${index}.type`
//                         );
//                         const getMask = () => {
//                           if (
//                             contactType === "telefone" ||
//                             contactType === "celular" ||
//                             contactType === "whatsapp"
//                           ) {
//                             return "(99) 99999-9999";
//                           }
//                           return "";
//                         };

//                         return (
//                           <FormItem>
//                             <FormLabel>Valor</FormLabel>
//                             <FormControl>
//                               {getMask() ? (
//                                 <MaskedInput
//                                   mask={getMask()}
//                                   {...field}
//                                   disabled={isReadOnly}
//                                   placeholder={"(00) 00000-0000"}
//                                 />
//                               ) : (
//                                 <Input
//                                   defaultValue={formatPhoneNumber(field.value)}
//                                   disabled={isReadOnly}
//                                 />
//                               )}
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         );
//                       }}
//                     />
//                     <FormField
//                       control={form.control}
//                       name={`contacts.${index}.isPrincipal`}
//                       render={({ field }) => {
//                         const principalCount = form
//                           .watch("contacts")
//                           .filter((c) => c.isPrincipal).length;
//                         const canSetPrincipal =
//                           !field.value || principalCount <= 1;

//                         return (
//                           <FormItem>
//                             <FormLabel>Principal</FormLabel>
//                             <FormControl>
//                               <Select
//                                 onValueChange={(value) => {
//                                   const newValue = value === "true";
//                                   if (
//                                     newValue &&
//                                     principalCount > 0 &&
//                                     !field.value
//                                   ) {
//                                     // Remove principal from others
//                                     const currentContacts =
//                                       form.getValues("contacts");
//                                     const updatedContacts = currentContacts.map(
//                                       (contact, idx) =>
//                                         idx === index
//                                           ? { ...contact, principal: true }
//                                           : { ...contact, principal: false }
//                                     );
//                                     form.setValue("contacts", updatedContacts);
//                                   } else {
//                                     field.onChange(newValue);
//                                   }
//                                 }}
//                                 value={field.value ? "true" : "false"}
//                                 disabled={isReadOnly}
//                               >
//                                 <SelectTrigger>
//                                   <SelectValue />
//                                 </SelectTrigger>
//                                 <SelectContent>
//                                   <SelectItem value="true">Sim</SelectItem>
//                                   <SelectItem value="false">Não</SelectItem>
//                                 </SelectContent>
//                               </Select>
//                             </FormControl>
//                             <FormMessage />
//                           </FormItem>
//                         );
//                       }}
//                     />
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//             {!isReadOnly && (
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() =>
//                   appendContato({
//                     type: "celular" as const,
//                     value: "",
//                     isPrincipal: false,
//                   })
//                 }
//                 className="w-full"
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Adicionar Contato
//               </Button>
//             )}
//           </CardContent>
//         </Card>

//         {/* Addresses */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <MapPin className="h-5 w-5" />
//               Endereços
//             </CardTitle>
//             <CardDescription>
//               Adicione múltiplos endereços para o adotante
//             </CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {enderecosFields.map((field, index) => {
//               const currentStateId =
//                 form.watch(`addresses.${index}.city.stateUf.id`) || 0;
//               const currentCityId =
//                 form.watch(`addresses.${index}.city.id`) || 0;

//               return (
//                 <Card key={field.id} className="border-border">
//                   <CardContent className="pt-4">
//                     <div className="flex items-center justify-between mb-4">
//                       <Badge variant="outline">Endereço {index + 1}</Badge>
//                       {!isReadOnly && enderecosFields.length > 1 && (
//                         <Button
//                           type="button"
//                           variant="ghost"
//                           size="sm"
//                           onClick={() => removeEndereco(index)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       )}
//                     </div>
//                     <div className="space-y-4">
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         <div className="md:col-span-3">
//                           <FormField
//                             control={form.control}
//                             name={`addresses.${index}.street`}
//                             render={({ field }) => (
//                               <FormItem>
//                                 <FormLabel>Rua</FormLabel>
//                                 <FormControl>
//                                   <Input {...field} disabled={isReadOnly} />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
//                         </div>
//                         <FormField
//                           control={form.control}
//                           name={`addresses.${index}.number`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Número</FormLabel>
//                               <FormControl>
//                                 <Input
//                                   {...field}
//                                   value={field.value || ""} // MUDANÇA: converte undefined/null para string vazia
//                                   onChange={(e) => {
//                                     const value = e.target.value;
//                                     // Se vazio, passa undefined, senão passa o valor
//                                     field.onChange(
//                                       value === "" ? undefined : Number(value)
//                                     );
//                                   }}
//                                   disabled={isReadOnly}
//                                   type="number" // mantém como number para validação do browser
//                                   placeholder="Ex: 123"
//                                 />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                       </div>
//                       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                         <FormField
//                           control={form.control}
//                           name={`addresses.${index}.neighborhood`}
//                           render={({ field }) => (
//                             <FormItem>
//                               <FormLabel>Bairro</FormLabel>
//                               <FormControl>
//                                 <Input {...field} disabled={isReadOnly} />
//                               </FormControl>
//                               <FormMessage />
//                             </FormItem>
//                           )}
//                         />
//                         <FormItem>
//                           <FormLabel>Estado</FormLabel>
//                           <Select
//                             onValueChange={(value) => {
//                               const selectedUf = ufs.find(
//                                 (uf) => uf.id === Number(value)
//                               );
//                               if (selectedUf) {
//                                 // Update city object with new state
//                                 form.setValue(
//                                   `addresses.${index}.city.stateUf`,
//                                   {
//                                     id: selectedUf.id,
//                                     name: selectedUf.name,
//                                     acronym: selectedUf.acronym,
//                                   }
//                                 );
//                                 // Clear city selection
//                                 form.setValue(`addresses.${index}.city.id`, 0);
//                                 form.setValue(
//                                   `addresses.${index}.city.name`,
//                                   ""
//                                 );
//                                 // Load cities for the selected state
//                                 loadCitiesByUF(Number(value));
//                               }
//                             }}
//                             value={currentStateId?.toString()}
//                             disabled={isReadOnly || loadingLocations}
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Selecione" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {ufs.map((uf) => (
//                                 <SelectItem
//                                   key={uf.id}
//                                   value={uf.id.toString()}
//                                 >
//                                   {uf.acronym} - {uf.name}
//                                 </SelectItem>
//                               ))}
//                             </SelectContent>
//                           </Select>
//                         </FormItem>
//                         <FormItem className="md:col-span-2">
//                           <FormLabel>Cidade</FormLabel>
//                           <Select
//                             onValueChange={(value) => {
//                               const selectedCity = cities.find(
//                                 (c) => c.id === Number(value)
//                               );
//                               if (selectedCity) {
//                                 // Atualiza o objeto city completo
//                                 form.setValue(
//                                   `addresses.${index}.city`,
//                                   selectedCity,
//                                   { shouldValidate: true } // ADIÇÃO: força validação
//                                 );
//                               }
//                             }}
//                             // MUDANÇA: usar value condicional e não usar '0' como fallback
//                             value={
//                               currentCityId > 0
//                                 ? currentCityId.toString()
//                                 : undefined
//                             }
//                             disabled={
//                               isReadOnly || loadingLocations || !currentStateId
//                             }
//                           >
//                             <FormControl>
//                               <SelectTrigger>
//                                 <SelectValue placeholder="Selecione" />
//                               </SelectTrigger>
//                             </FormControl>
//                             <SelectContent>
//                               {cities
//                                 ?.filter(
//                                   (city) => city.stateUf.id === currentStateId
//                                 )
//                                 ?.map((city) => (
//                                   <SelectItem
//                                     key={city.id}
//                                     value={city.id.toString()}
//                                   >
//                                     {city.name}
//                                   </SelectItem>
//                                 ))}
//                             </SelectContent>
//                           </Select>
//                         </FormItem>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//             {!isReadOnly && (
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() =>
//                   appendEndereco({
//                     street: "",
//                     neighborhood: "",
//                     number: undefined, // MUDANÇA: undefined ao invés de 0
//                     city: {
//                       id: 0,
//                       name: "",
//                       stateUf: {
//                         id: prUfId || 0,
//                         name: "Paraná",
//                         acronym: "PR",
//                       },
//                     },
//                   })
//                 }
//                 className="w-full"
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Adicionar Endereço
//               </Button>
//             )}
//           </CardContent>
//         </Card>

//         {/* Animal and Term Links */}
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Link className="h-5 w-5" />
//               Animais Vinculados
//             </CardTitle>
//             <CardDescription>Vincule animais a este adotante</CardDescription>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Animals Section */}
//             <div>
//               <Label className="text-base font-medium">
//                 Animais Vinculados
//               </Label>
//               <p className="text-sm text-muted-foreground mb-4">
//                 Pesquise e vincule animais a este adotante
//               </p>

//               {/* Linked Animals */}
//               {/* {getLinkedAnimais().length > 0 && (
//                 <div className="mb-4">
//                   <Label className="text-sm font-medium mb-2 block">Animais Vinculados Atualmente:</Label>
//                   <div className="space-y-2">
//                     {getLinkedAnimais().map((animal) => (
//                       <div key={animal.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
//                         <div className="flex items-center gap-3">
//                           <div className="text-2xl">
//                             {animal.tipo === 'cao' ? '🐕' : '🐱'}
//                           </div>
//                           <div>
//                             <div className="font-medium">{animal.nome}</div>
//                             <div className="text-sm text-muted-foreground">
//                               {animal.raca} • {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}
//                             </div>
//                           </div>
//                         </div>
//                         {!isReadOnly && (
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={() => unlinkAnimal(animal.id)}
//                           >
//                             <X className="h-4 w-4" />
//                           </Button>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )} */}

//               {/* Animal Search */}
//               {!isReadOnly && (
//                 <div className="relative">
//                   <Label className="text-sm font-medium mb-2 block">
//                     Pesquisar e Adicionar Animal:
//                   </Label>
//                   <div className="relative">
//                     <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Buscar por nome ou raça do animal..."
//                       value={animalSearch}
//                       onChange={(e) => {
//                         setAnimalSearch(e.target.value);
//                         setShowAnimalResults(e.target.value.length > 0);
//                       }}
//                       className="pl-8"
//                       onFocus={() =>
//                         setShowAnimalResults(animalSearch.length > 0)
//                       }
//                     />
//                   </div>

//                   {/* Animal Search Results */}
//                   {/* {showAnimalResults && animalSearch && (
//                     <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto">
//                       {filteredAnimais.length > 0 ? (
//                         filteredAnimais.map((animal) => {
//                           const isLinked = getLinkedAnimais().some(linked => linked.id === animal.id);
//                           return (
//                             <div
//                               key={animal.id}
//                               className={`p-3 hover:bg-muted cursor-pointer border-b border-border last:border-b-0 ${
//                                 isLinked ? 'opacity-50' : ''
//                               }`}
//                               onClick={() => !isLinked && linkAnimal(animal.id)}
//                             >
//                               <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                   <div className="text-lg">
//                                     {animal.tipo === 'cao' ? '🐕' : '🐱'}
//                                   </div>
//                                   <div>
//                                     <div className="font-medium">{animal.nome}</div>
//                                     <div className="text-sm text-muted-foreground">
//                                       {animal.raca} • {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}
//                                     </div>
//                                   </div>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                   <Badge variant="outline" className="text-xs">
//                                     {animal.status === 'disponivel' ? 'Disponível' : 
//                                      animal.status === 'adotado' ? 'Adotado' : 'Em Processo'}
//                                   </Badge>
//                                   {isLinked && (
//                                     <Badge variant="secondary" className="text-xs">
//                                       Já Vinculado
//                                     </Badge>
//                                   )}
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })
//                       ) : (
//                         <div className="p-3 text-sm text-muted-foreground text-center">
//                           Nenhum animal encontrado
//                         </div>
//                       )}
//                     </div>
//                   )} */}
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Actions */}
//         <div className="flex justify-end space-x-4">
//           <Button type="button" variant="outline" onClick={onCancel}>
//             {isReadOnly ? "Fechar" : "Cancelar"}
//           </Button>
//           {!isReadOnly && (
//             <Button type="submit" disabled={submitting}>
//               {submitting ? (
//                 <>
//                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                   {mode === "edit" ? "Atualizando..." : "Cadastrando..."}
//                 </>
//               ) : (
//                 <>{mode === "edit" ? "Atualizar" : "Cadastrar"}</>
//               )}
//             </Button>
//           )}
//         </div>
//       </form>
//     </Form>
//   );
// };

// export default AdopterForm;
