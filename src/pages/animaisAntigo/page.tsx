import React from 'react';
import { Heart, Plus, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnimais } from './useAnimais';

const AnimaisPage = () => {
  const { animais, getStatusColor, getStatusText } = useAnimais();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Animais</h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Gerencie todos os animais da ONG
          </p>
        </div>
        <Button className="shadow-glow w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Cadastrar Animal</span>
          <span className="sm:hidden">Cadastrar</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 max-w-full sm:max-w-md">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome, raça..."
              className="pl-8 bg-background"
            />
          </div>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Filter className="mr-2 h-4 w-4" />
          Filtros
        </Button>
      </div>

      {/* Animals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {animais.map((animal) => (
          <Card key={animal.id} className="bg-gradient-card border-border shadow-soft hover:shadow-medium transition-all">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl text-foreground">{animal.name}</CardTitle>
                <Badge className={getStatusColor(animal.status)}>
                  {getStatusText(animal.status)}
                </Badge>
              </div>
              <CardDescription>
                {animal.tipo === 'cao' ? '🐕' : '🐱'} {animal.raca} • {animal.idade} {animal.idade === 1 ? 'ano' : 'anos'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Animal photo placeholder */}
                <div className="w-full h-48 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Heart className="h-12 w-12 text-white opacity-50" />
                </div>
                
                {/* Animal details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Sexo:</span>
                    <span className="capitalize text-foreground">{animal.sexo}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Castrado:</span>
                    <span className={animal.castrado ? 'text-success' : 'text-warning'}>
                      {animal.castrado ? 'Sim' : 'Não'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Vacinado:</span>
                    <span className={animal.vacinado ? 'text-success' : 'text-warning'}>
                      {animal.vacinado ? 'Sim' : 'Não'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Editar
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state */}
      {animais.length === 0 && (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum animal encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece cadastrando o primeiro animal da ONG
          </p>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Cadastrar Primeiro Animal
          </Button>
        </div>
      )}
    </div>
  );
};

export default AnimaisPage;