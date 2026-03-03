import { Animal } from '@/types';

export const useAnimais = () => {
  // Mock data
  const animais: Animal[] = [
    {
      id: '1',
      name: 'Bella',
      tipo: 'cao',
      raca: 'Labrador',
      idade: 2,
      sexo: 'femea',
      status: 'disponivel',
      fotos: [],
      castrado: true,
      vacinado: true,
      vermifugado: true,
      observacoes: '',
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15'),
    },
    {
      id: '2',
      name: 'Rex',
      tipo: 'cao',
      raca: 'Pastor Alemão',
      idade: 3,
      sexo: 'macho',
      status: 'em_processo',
      fotos: [],
      castrado: true,
      vacinado: true,
      vermifugado: true,
      observacoes: '',
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-01-10'),
    },
    {
      id: '3',
      name: 'Mimi',
      tipo: 'gato',
      raca: 'Persa',
      idade: 1,
      sexo: 'femea',
      status: 'adotado',
      fotos: [],
      castrado: false,
      vacinado: true,
      vermifugado: true,
      observacoes: '',
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05'),
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'disponivel': return 'bg-success text-success-foreground';
      case 'adotado': return 'bg-primary text-primary-foreground';
      case 'em_processo': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'disponivel': return 'Disponível';
      case 'adotado': return 'Adotado';
      case 'em_processo': return 'Em Processo';
      default: return status;
    }
  };

  return {
    animais,
    getStatusColor,
    getStatusText,
  };
};