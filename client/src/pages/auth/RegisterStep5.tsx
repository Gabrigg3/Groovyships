import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, ArrowLeft, Users } from "lucide-react";

import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";


//TYPES
type LookingFor = "romance" | "amistad";
type Gender = "hombre" | "mujer" | "otro";


//CONSTANTS
const LOOKING_FOR_OPTIONS = [
    { value: "romance", label: "💕 Romance", gradient: "bg-gradient-1" },
    { value: "amistad", label: "🤝 Amistad", gradient: "bg-gradient-friendship" },
] as const;

const GENDER_OPTIONS = [
    { value: "hombre", label: "👨 Hombres" },
    { value: "mujer", label: "👩 Mujeres" },
    { value: "otro", label: "🌈 Otros" },
] as const;


//COMPONENT
export function RegisterStep5() {
    const navigate = useNavigate();
    const setSession = useAuthStore((s) => s.setSession);

    const [formData, setFormData] = useState({
        lookingFor: [] as LookingFor[],
        generosRomance: [] as Gender[],
        generosAmistad: [] as Gender[],
        ageRangeMin: 18,
        ageRangeMax: 35,
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);


    //VALIDATION
    const validate = () => {
        const e: Record<string, string> = {};

        if (formData.lookingFor.length === 0) {
            e.lookingFor = "Selecciona al menos una opción";
        }

        if (
            formData.lookingFor.includes("romance") &&
            formData.generosRomance.length === 0
        ) {
            e.generosRomance = "Selecciona al menos un género para romance";
        }

        if (
            formData.lookingFor.includes("amistad") &&
            formData.generosAmistad.length === 0
        ) {
            e.generosAmistad = "Selecciona al menos un género para amistad";
        }

        if (formData.ageRangeMin < 18 || formData.ageRangeMax > 100) {
            e.ageRange = "El rango debe estar entre 18 y 100 años";
        }

        if (formData.ageRangeMin >= formData.ageRangeMax) {
            e.ageRange = "La edad mínima debe ser menor que la máxima";
        }

        setErrors(e);
        return Object.keys(e).length === 0;
    };


    //SUBMIT FINAL
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);

        const step1 = JSON.parse(localStorage.getItem("registerStep1") || "{}");
        const step2 = JSON.parse(localStorage.getItem("registerStep2") || "{}");
        const step3 = JSON.parse(localStorage.getItem("registerStep3") || "{}");
        const step4 = JSON.parse(localStorage.getItem("registerStep4") || "{}");

        const payload = {
            nombre: step1.name,
            email: step1.email,
            telefono: Number(step1.phone),
            password: step1.password,

            edad: Number(step2.age),
            ocupacion: step2.occupation,
            ubicacion: step2.location,
            biografia: step2.bio,
            generoUsuario: step2.gender,

            imagenes: Array.isArray(step3.photos) ? step3.photos : [],
            intereses: step4.interests ?? [],

            lookingFor: formData.lookingFor,
            generosRomance: formData.generosRomance,
            generosAmistad: formData.generosAmistad,
            rangoEdad: [formData.ageRangeMin, formData.ageRangeMax],
        };

        try {
            const { accessToken, userId } = await authApi.register(payload);

            localStorage.removeItem("registerStep1");
            localStorage.removeItem("registerStep2");
            localStorage.removeItem("registerStep3");
            localStorage.removeItem("registerStep4");


            setSession(accessToken, userId ?? null);

            navigate("/");
        } catch (err) {
            console.error("+ Error en registro", err);
            alert("Error al completar el registro");
        } finally {
            setIsSubmitting(false);
        }
    };


    //RENDER

    return (
        <div className="min-h-screen bg-gradient-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card border-0 shadow-2xl p-8 lg:p-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/register/step4")}
                    className="mb-4"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Button>

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary rounded-full p-4 mb-4">
                        <Heart className="w-12 h-12 text-primary-foreground" fill="currentColor" />
                    </div>
                    <h1 className="text-3xl font-bold mb-2">Preferencias</h1>
                    <p className="text-muted-foreground text-center">
                        Paso 5 de 5: ajusta tus preferencias
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* LOOKING FOR */}
                    <div>
                        <label className="block font-semibold mb-3">
                            <Users className="inline w-4 h-4 mr-1" />
                            Estoy buscando
                        </label>

                        <div className="space-y-3">
                            {LOOKING_FOR_OPTIONS.map(opt => {
                                const selected = formData.lookingFor.includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            const updated = selected
                                                ? formData.lookingFor.filter(v => v !== opt.value)
                                                : [...formData.lookingFor, opt.value];
                                            setFormData({ ...formData, lookingFor: updated });
                                        }}
                                        className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                                            selected
                                                ? `${opt.gradient} text-white scale-105 shadow-lg`
                                                : "bg-muted text-muted-foreground hover:bg-accent"
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>

                        {errors.lookingFor && (
                            <p className="text-destructive text-sm mt-1">{errors.lookingFor}</p>
                        )}
                    </div>

                    {/* ROMANCE */}
                    {formData.lookingFor.includes("romance") && (
                        <div>
                            <label className="block font-semibold mb-3">
                                💕 Interesado/a en (Romance)
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {GENDER_OPTIONS.map(opt => {
                                    const selected = formData.generosRomance.includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => {
                                                const updated = selected
                                                    ? formData.generosRomance.filter(g => g !== opt.value)
                                                    : [...formData.generosRomance, opt.value];
                                                setFormData({ ...formData, generosRomance: updated });
                                            }}
                                            className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                                                selected
                                                    ? "bg-gradient-1 text-white scale-105 shadow-lg"
                                                    : "bg-muted text-muted-foreground hover:bg-accent"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.generosRomance && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.generosRomance}
                                </p>
                            )}
                        </div>
                    )}

                    {/* AMISTAD */}
                    {formData.lookingFor.includes("amistad") && (
                        <div>
                            <label className="block font-semibold mb-3">
                                🤝 Interesado/a en (Amistad)
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {GENDER_OPTIONS.map(opt => {
                                    const selected = formData.generosAmistad.includes(opt.value);
                                    return (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => {
                                                const updated = selected
                                                    ? formData.generosAmistad.filter(g => g !== opt.value)
                                                    : [...formData.generosAmistad, opt.value];
                                                setFormData({ ...formData, generosAmistad: updated });
                                            }}
                                            className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                                                selected
                                                    ? "bg-gradient-friendship text-white scale-105 shadow-lg"
                                                    : "bg-muted text-muted-foreground hover:bg-accent"
                                            }`}
                                        >
                                            {opt.label}
                                        </button>
                                    );
                                })}
                            </div>
                            {errors.generosAmistad && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.generosAmistad}
                                </p>
                            )}
                        </div>
                    )}

                    {/* AGE RANGE */}
                    <div>
                        <label className="block font-semibold mb-3">
                            Rango de edad deseado
                        </label>

                        <div className="flex gap-4">
                            <input
                                type="number"
                                min={18}
                                max={100}
                                value={formData.ageRangeMin}
                                onChange={(e) =>
                                    setFormData({ ...formData, ageRangeMin: Number(e.target.value) })
                                }
                                className="w-full bg-background border border-input rounded-lg px-4 py-3"
                            />
                            <span className="text-muted-foreground">-</span>
                            <input
                                type="number"
                                min={18}
                                max={100}
                                value={formData.ageRangeMax}
                                onChange={(e) =>
                                    setFormData({ ...formData, ageRangeMax: Number(e.target.value) })
                                }
                                className="w-full bg-background border border-input rounded-lg px-4 py-3"
                            />
                        </div>

                        <div className="bg-muted rounded-lg p-4 mt-4 text-center">
                            Buscando personas entre{" "}
                            <span className="font-bold text-primary">{formData.ageRangeMin}</span> y{" "}
                            <span className="font-bold text-primary">{formData.ageRangeMax}</span> años
                        </div>

                        {errors.ageRange && (
                            <p className="text-destructive text-sm mt-1">{errors.ageRange}</p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-6 text-lg"
                    >
                        {isSubmitting ? "Creando cuenta..." : "Completar Registro"}
                    </Button>
                </form>
            </Card>
        </div>
    );
}
