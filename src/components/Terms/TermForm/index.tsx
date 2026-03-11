import { Terms } from "@/types/terms";
import { useTermForm } from "./useTermForm";


export type TermFormProps = {
    term?: Terms;
    onCancel: () => void;
    mode: "create" | "edit" | "view";
    onCreateSuccess?: (newTerm: Terms) => void;
    onUpdateSuccess?: (updatedTerm: Terms) => void;
    onDeleteSuccess?: (deletedId: string) => void;
}

export default function TermForm({
    mode,
    onCancel,
    term,
    onCreateSuccess,
    onDeleteSuccess,
    onUpdateSuccess
}: TermFormProps) {

    const {
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
    } = useTermForm({
        mode,
        onCancel,
        term,
        onCreateSuccess,
        onDeleteSuccess,
        onUpdateSuccess
    })

    return (
        <>
            <div className="flex-1 bg-purple-200">

            </div>
        </>
    )
}