import z from "zod";

const contactSchema = z.object({
  type: z.enum(["telefone", "celular", "whatsapp"]),
  value: z.string().min(1, "Contato é obrigatório"),
  isPrincipal: z.boolean(),
});

const addressSchema = z.object({
  street: z.string().min(1, "Rua é obrigatória"),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  number: z
    .number()
    .int("Número deve ser inteiro")
    .positive("Número deve ser maior que zero")
    .optional()
    .refine((val) => val !== undefined, {message: "Número é obrigatório"}),
  city: z.object({
    id: z.number().min(1, "Cidade é obrigatória"),
    name: z.string(),
    stateUf: z.object({
      id: z.number().min(1, "Estado é obrigatório"),
      name: z.string(),
      acronym: z.string(),
    }),
  }),
});

export const adopterSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  email: z.string().email("Email é obrigatório"),
  dtOfBirth: z.date("Data de nascimento é obrigatória"),

  rg: z.string().optional(),
  cpf: z.string().min(11, "CPF inválido"),

  contacts: z
    .array(contactSchema)
    .min(1, "Pelo menos um contato é obrigatório")
    .refine((contatos) => contatos.filter((c) => c.isPrincipal).length <= 1, {
      message: "Apenas um contato pode ser principal",
    }),

  profession: z.string().nonempty("Profissão é obrigatória"),

  civilState: z.enum(
    ["solteiro", "casado", "divorciado", "viuvo", "uniao_estavel"],
    {message: "Selecione um estado civil"},
  ),
  addresses: z
    .array(addressSchema)
    .min(1, "Pelo menos um endereço é obrigatório"),

  dtToNotify: z.date().nullable().optional(),
  activeNotification: z.boolean(),

  animalsIds: z.array(z.string()).optional(),
});

/**NEW */

export const adopterFiltersSchema = z.object({
  city: z.string().optional(),
  stateUf: z.string().optional(),
  createdAt: z.date().nullable().optional(),
  dtToNotify: z.date().nullable().optional(),
});
