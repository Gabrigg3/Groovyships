import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { uploadMedia } from "@/api/mediaApi";
import { Heart, ArrowLeft, Camera, X, Loader2 } from "lucide-react";

export function RegisterStep3() {
    const navigate = useNavigate();

    const fileInputRefs = [
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
        useRef<HTMLInputElement>(null),
    ];

    //URLs finales de Cloudinary
    const [photos, setPhotos] = useState<(string | null)[]>([
        null,
        null,
        null,
        null,
    ]);

    //Indice que se está subiendo (mejor que boolean)
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);


    //HANDLE PHOTO UPLOAD
    const handlePhotoChange = async (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploadingIndex(index);

            const url = await uploadMedia(file, "image");

            setPhotos((prev) => {
                const copy = [...prev];
                copy[index] = url;
                return copy;
            });
        } catch (error) {
            console.error(error);
            alert("+ Error subiendo la foto");
        } finally {
            setUploadingIndex(null);
            e.target.value = "";
        }
    };


    //REMOVE PHOTO
    const handleRemovePhoto = (index: number) => {
        setPhotos((prev) => {
            const copy = [...prev];
            copy[index] = null;
            return copy;
        });
    };


    //CONTINUE
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const uploadedPhotos = photos.filter(
            (photo): photo is string => Boolean(photo)
        );

        localStorage.setItem(
            "registerStep3",
            JSON.stringify({ photos: uploadedPhotos })
        );

        navigate("/register/step4");
    };


    //SKIP
    const handleSkip = () => {
        localStorage.setItem(
            "registerStep3",
            JSON.stringify({ photos: [] })
        );
        navigate("/register/step4");
    };

    return (
        <div className="min-h-screen bg-gradient-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-card text-card-foreground border-0 shadow-2xl p-8 lg:p-10">
                {/* Back */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/register/step2")}
                    className="mb-4 bg-transparent text-foreground hover:bg-accent"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Button>

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary rounded-full p-4 mb-4">
                        <Heart
                            className="w-12 h-12 text-primary-foreground"
                            fill="currentColor"
                        />
                    </div>
                    <h1 className="text-foreground text-3xl font-bold mb-2">
                        Más Fotos
                    </h1>
                    <p className="text-muted-foreground text-center">
                        Paso 3 de 5: Añade hasta 4 fotos más (opcional)
                    </p>
                    <p className="text-muted-foreground text-center text-sm mt-2">
                        Los perfiles con más fotos reciben más matches
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        {photos.map((photo, index) => {
                            const isUploading = uploadingIndex === index;

                            return (
                                <div
                                    key={index}
                                    className="relative aspect-square rounded-lg overflow-hidden bg-muted group"
                                >
                                    {photo ? (
                                        <>
                                            <img
                                                src={photo}
                                                alt={`Foto ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Remove */}
                                            <button
                                                type="button"
                                                onClick={() => handleRemovePhoto(index)}
                                                className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                            {/* Change */}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    fileInputRefs[index].current?.click()
                                                }
                                                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                            >
                                                <Camera className="w-8 h-8 text-white" />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            disabled={isUploading}
                                            onClick={() =>
                                                fileInputRefs[index].current?.click()
                                            }
                                            className="w-full h-full flex flex-col items-center justify-center gap-2 hover:bg-accent transition disabled:opacity-50"
                                        >
                                            {isUploading ? (
                                                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                                            ) : (
                                                <>
                                                    <Camera className="w-12 h-12 text-muted-foreground" />
                                                    <span className="text-muted-foreground text-sm">
                                                        Añadir foto {index + 1}
                                                    </span>
                                                </>
                                            )}
                                        </button>
                                    )}

                                    <input
                                        ref={fileInputRefs[index]}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) =>
                                            handlePhotoChange(index, e)
                                        }
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3">
                        <Button
                            type="submit"
                            disabled={uploadingIndex !== null}
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-6 disabled:opacity-50"
                        >
                            {uploadingIndex !== null
                                ? "Subiendo fotos..."
                                : "Continuar"}
                        </Button>

                        <Button
                            type="button"
                            onClick={handleSkip}
                            variant="ghost"
                            className="w-full hover:bg-accent text-lg py-6"
                        >
                            Saltar este paso
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
