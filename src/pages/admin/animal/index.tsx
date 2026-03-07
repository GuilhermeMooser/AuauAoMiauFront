import Header from "@/components/Header";
import { useAnimal } from "./useAnimal";
import FilterInputSearch from "@/components/FilterInputSearch";
import AnimalFilterModal from "@/components/Animal/AnimalFilterModal";
import Alert from "@/components/Alert";
import { InfiniteScrollContainer } from "@/components/InfiteScrollContainer";
import { Button } from "@/components/ui/button";
import { Plus, SunDim } from "lucide-react";
import AnimalCard from "@/components/Animal/AnimalCard";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import AnimalForm from "@/components/Animal/AnimalForm";

export default function Animal() {

    const {
        isCreateModalOpen,
        searchTerm,
        filtersCount,
        showFilters,
        activeFilters,
        animalsData,
        // selectedAdopter,
        errorMessage,
        isEditModalOpen,
        clearError,
        isViewModalOpen,
        handleCloseViewModalFn,
        handleCloseCreateModalFn,
        handleCloseEditModalFn,
        handleOpenCreateModal,
        onToggleFilters,
        handleChangeFilter,
        handleApplyFilter,
        handleClearFilter,
        handleEditClick,
        handleViewClick,
        isFetchingNextPage,
        hasNextPage,
        fetchNextPage,
        handleCreateSuccess,
        // handleUpdateSuccess,
        // handleDeleteSuccess,
    } = useAnimal();

    return (
        <>
            <div className="space-y-6">
                <Header
                    headerName={"Animais"}
                    handleOpenCreateModal={handleOpenCreateModal}
                    headerSubtitle={"Gerencie todos os animais cadastrados"}
                    createEntityName={"Animal"}
                />

                <FilterInputSearch
                    searchTerm={searchTerm}
                    handleChangeFilter={handleChangeFilter}
                    onToggleFilters={onToggleFilters}
                    filtersCount={filtersCount}
                    showFilterButton
                />

                <AnimalFilterModal
                    isOpen={showFilters}
                    activeFilters={activeFilters}
                    filtersCount={filtersCount}
                    handleApplyFilter={handleApplyFilter}
                    handleClearFilter={handleClearFilter}
                />

                <InfiniteScrollContainer
                    hasNextPage={hasNextPage ?? false}
                    isFetchingNextPage={isFetchingNextPage}
                    fetchNextPage={fetchNextPage}
                    threshold={0}
                    loader={
                        <div className="col-span-full flex items-center justify-center gap-2 py-8">
                            <div className="w-6 h-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin" />
                            <span className="text-gray-600">
                                Carregando mais animails...
                            </span>
                        </div>
                    }
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {animalsData.items.map((animal) => (
                            <AnimalCard
                                key={animal.id}
                                animal={animal}
                                handleEditClick={handleEditClick}
                                handleViewAnimal={handleViewClick}
                            />
                        ))}
                    </div>
                </InfiniteScrollContainer>
                {animalsData?.items?.length === 0 && (
                    <div className="text-center py-12">
                        <SunDim className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                            Nenhum animal encontrado
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Comece cadastrando o primeiro animal
                        </p>
                        <Button onClick={handleOpenCreateModal}>
                            <Plus className="mr-2 h-4 w-4" />
                            Cadastrar Primeiro Adotante
                        </Button>
                    </div>
                )}

                {/* Create Modal */}
                <Dialog
                    open={isCreateModalOpen}
                    onOpenChange={handleCloseCreateModalFn}
                >
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                        <DialogHeader>
                            <DialogTitle>Cadastrar Novo Animal</DialogTitle>
                        </DialogHeader>
                        <AnimalForm
                            mode="create"
                            onCancel={handleCloseCreateModalFn}
                            onCreateSuccess={handleCreateSuccess}
                        />
                    </DialogContent>
                </Dialog>
                {/* Edit Modal */}
                {/* <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModalFn}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                        <DialogHeader>
                            <DialogTitle>Editar Adotante</DialogTitle>
                        </DialogHeader>
                        <AdopterForm
                            mode="edit"
                            adopter={selectedAdopter}
                            onCancel={handleCloseEditModalFn}
                            onUpdateSuccess={handleUpdateSuccess}
                            onDeleteSuccess={handleDeleteSuccess}
                        />
                    </DialogContent>
                </Dialog> */}
                {/* View Modal */}
                {/* <Dialog open={isViewModalOpen} onOpenChange={handleCloseViewModalFn}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                        <DialogHeader>
                            <DialogTitle>Detalhes do Adotante</DialogTitle>
                        </DialogHeader>
                        <AdopterForm
                            mode="view"
                            adopter={selectedAdopter}
                            onCancel={handleCloseViewModalFn}
                        />
                    </DialogContent>
                </Dialog> */}
            </div>
            <Alert
                content={errorMessage}
                isOpen={!!errorMessage}
                onClose={clearError}
            />
        </>

    )

}