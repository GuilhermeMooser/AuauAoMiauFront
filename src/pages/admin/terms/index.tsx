import Header from "@/components/Header";
import { useTerms } from "./useTerms";
import FilterInputSearch from "@/components/FilterInputSearch";
import TermFilterModal from "@/components/Terms/TermFilterModal";
import { InfiniteScrollContainer } from "@/components/InfiteScrollContainer";
import { Button } from "@/components/ui/button";
import { Plus, SunDim } from "lucide-react";
import Alert from "@/components/Alert";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import TermCard from "@/components/Terms/TermCard";
import TermForm from "@/components/Terms/TermForm";

export default function Terms() {

    const {
        handleOpenCreateModal,
        searchTerm,
        handleChangeFilter,
        onToggleFilters,
        filtersCount,
        showFilters,
        activeFilters,
        handleApplyFilter,
        handleClearFilter,
        hasNextPage,
        isFetchingNextPage,
        fetchNextPage,
        termsData,
        handleEditClick,
        handleViewClick,
        errorMessage,
        clearError,
        isCreateModalOpen,
        handleCloseCreateModalFn,
        handleCreateSuccess,
        isEditModalOpen,
        handleCloseEditModalFn,
        selectedTerm,
        handleUpdateSuccess,
        handleDeleteSuccess,
        isViewModalOpen,
        handleCloseViewModalFn
    } = useTerms();

    return (
        <>
            <div className="space-y-6">
                <Header
                    headerName={"Termos"}
                    handleOpenCreateModal={handleOpenCreateModal}
                    headerSubtitle={"Gerencie todos os termos cadastrados"}
                    createEntityName={"Termo"}
                />

                <FilterInputSearch
                    searchTerm={searchTerm}
                    handleChangeFilter={handleChangeFilter}
                    onToggleFilters={onToggleFilters}
                    filtersCount={filtersCount}
                    showFilterButton
                    showSearchInput={false}
                />

                <TermFilterModal
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
                                Carregando mais termos...
                            </span>
                        </div>
                    }
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {termsData.items.map((term) => (
                            <TermCard
                                key={term.id}
                                term={term}
                                handleEditClick={handleEditClick}
                                handleViewTerm={handleViewClick}
                            />
                        ))}
                    </div>
                </InfiniteScrollContainer>
                {termsData?.items?.length === 0 && (
                    <div className="text-center py-12">
                        <SunDim className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">
                            Nenhum termo encontrado
                        </h3>
                        <p className="text-muted-foreground mb-4">
                            Comece cadastrando o primeiro termo de compromisso
                        </p>
                        <Button onClick={handleOpenCreateModal}>
                            <Plus className="mr-2 h-4 w-4" />
                            Cadastrar Primeiro Termo de compromisso
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
                            <DialogTitle>Cadastrar Novo Termo de compromisso</DialogTitle>
                        </DialogHeader>
                        <TermForm
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
                            <DialogTitle>Editar Termo</DialogTitle>
                        </DialogHeader>
                        <TermForm
                            mode="edit"
                            term={selectedTerm}
                            onCancel={handleCloseEditModalFn}
                            onUpdateSuccess={handleUpdateSuccess}
                            onDeleteSuccess={handleDeleteSuccess}
                        />
                    </DialogContent>
                </Dialog> */}
                {/* View Modal */}
                <Dialog open={isViewModalOpen} onOpenChange={handleCloseViewModalFn}>
                    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full">
                        <DialogHeader>
                            <DialogTitle>Detalhes do Termo</DialogTitle>
                        </DialogHeader>
                        <TermForm
                            mode="view"
                            term={selectedTerm}
                            onCancel={handleCloseViewModalFn}
                            onDeleteSuccess={handleDeleteSuccess}
                        />
                    </DialogContent>
                </Dialog>
            </div>
            <Alert
                content={errorMessage}
                isOpen={!!errorMessage}
                onClose={clearError}
            />
        </>
    )
}