import { useRef, useState, useCallback } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ImagePlus, Trash2, Upload, ZoomIn } from "lucide-react";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";

type AnimalImageCardProps = {
    imageUrl?: string | null;
    isReadOnly?: boolean;
    onFileChange?: (file: File | null) => void;
};

const MAX_SIZE_MB = 5;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function AnimalImageCard({
    imageUrl,
    isReadOnly = false,
    onFileChange
}: AnimalImageCardProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [dragging, setDragging] = useState(false);
    const [lightboxOpen, setLightboxOpen] = useState(false);

    const [removed, setRemoved] = useState(false);

    const displayImage = removed ? null : (localPreview ?? imageUrl ?? null);

    const handleRemove = () => {
        setLocalPreview(null);
        setRemoved(true);
        setError(null);
        onFileChange?.(null);
    };


    const processFile = useCallback(
        (file: File) => {
            setRemoved(false);
            setError(null);

            if (!ACCEPTED_TYPES.includes(file.type)) {
                setError("Formato não suportado. Use JPG, PNG, WEBP ou GIF.");
                return;
            }

            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                setError(`Tamanho máximo: ${MAX_SIZE_MB}MB.`);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setLocalPreview(e.target?.result as string);
            };
            reader.readAsDataURL(file);
            onFileChange?.(file);
        },
        [onFileChange],
    );

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) processFile(file);
        e.target.value = "";
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(true);
    };
    const handleDragLeave = () => setDragging(false);
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) processFile(file);
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ImagePlus className="h-5 w-5" />
                        Foto do Animal
                    </CardTitle>
                    <CardDescription>
                        {isReadOnly
                            ? "Foto registrada para este animal"
                            : "Adicione uma foto do animal (JPG, PNG, WEBP — máx. 5 MB)"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {/* ── Com imagem ─────────────────────────────────────── */}
                    {displayImage ? (
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                            {/* Thumbnail clicável */}
                            <div
                                className="relative group w-full sm:w-48 h-48 rounded-lg overflow-hidden border border-border bg-muted/30 shrink-0 cursor-pointer"
                                onClick={() => setLightboxOpen(true)}
                            >
                                <img
                                    src={displayImage}
                                    alt="Foto do animal"
                                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                                />
                                {/* Overlay de zoom */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                                    <ZoomIn className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                            </div>

                            {/* Ações */}
                            {!isReadOnly && (
                                <div className="flex flex-col gap-2">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {localPreview
                                            ? "Nova imagem selecionada (ainda não salva)"
                                            : "Imagem atual"}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => inputRef.current?.click()}
                                    >
                                        <Upload className="h-3.5 w-3.5 mr-1.5" />
                                        Trocar imagem
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-red-500"
                                        onClick={handleRemove}
                                    >
                                        <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                                        Remover
                                    </Button>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ── Sem imagem: drop zone ───────────────────────── */
                        !isReadOnly ? (
                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                onClick={() => inputRef.current?.click()}
                                className={`
                                    flex flex-col items-center justify-center gap-3
                                    w-full h-40 rounded-lg border-2 border-dashed
                                    cursor-pointer transition-colors select-none
                                    ${dragging
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-primary/60 hover:bg-muted/40"
                                    }
                                `}
                            >
                                <div className="flex flex-col items-center gap-1 pointer-events-none">
                                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm font-medium text-foreground">
                                        Clique ou arraste uma imagem
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        JPG, PNG, WEBP, GIF — máx. 5 MB
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
                                Nenhuma foto registrada para este animal.
                            </p>
                        )
                    )}

                    {/* Erro */}
                    {error && (
                        <p className="mt-2 text-xs text-red-500">{error}</p>
                    )}

                    {/* Input hidden */}
                    <input
                        ref={inputRef}
                        type="file"
                        accept={ACCEPTED_TYPES.join(",")}
                        className="hidden"
                        onChange={handleInputChange}
                    />
                </CardContent>
            </Card>

            {/* ── Lightbox ──────────────────────────────────────────────── */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                <DialogContent className="max-w-3xl p-2 bg-black/90 border-none">
                    {displayImage && (
                        <img
                            src={displayImage}
                            alt="Foto do animal (ampliada)"
                            className="w-full h-auto max-h-[80vh] object-contain rounded"
                        />
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
