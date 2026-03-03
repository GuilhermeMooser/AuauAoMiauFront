export interface Animal {
  id: string;
  name: string;
  tipo: 'cao' | 'gato';
  raca: string;
  idade: number;
  sexo: 'macho' | 'femea';
  castrado: boolean;
  vacinado: boolean;
  vermifugado: boolean;
  status: 'disponivel' | 'adotado' | 'em_processo';
  fotos: string[];
  observacoes: string;
  adotanteId?: string;
  termoCompromissoId?: string;
  createdAt: Date;
  updatedAt: Date;
}