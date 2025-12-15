import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ArrowLeft, Users } from 'lucide-react';
import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

interface RegisterStep4Props {
    onComplete: () => void;
}

type LookingForValue = "romance" | "friendship";

const LOOKING_FOR_OPTIONS: {
    value: LookingForValue;
    label: string;
    gradient: string;
}[] = [
    { value: "romance", label: "💕 Romance", gradient: "bg-gradient-1" },
    { value: "friendship", label: "🤝 Amistad", gradient: "bg-gradient-friendship" },
];

const GENDER_OPTIONS = [
    { value: 'male', label: '👨 Hombres' },
    { value: 'female', label: '👩 Mujeres' },
    { value: 'other', label: '🌈 Otros' },
];

export function RegisterStep4({ onComplete }: RegisterStep4Props) {
    const navigate = useNavigate();
    const { setAccessToken } = useAuthStore();

    const [formData, setFormData] = useState({
        lookingFor: [] as LookingForValue[],
        interestedInGenderRomance: [] as string[],
        interestedInGenderFriendship: [] as string[],
        ageRangeMin: '18',
        ageRangeMax: '35',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // --------------------------------------------------
    // VALIDACIÓN
    // --------------------------------------------------
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (formData.lookingFor.length === 0) {
            newErrors.lookingFor = 'Debes seleccionar al menos una opción';
        }

        if (
            formData.lookingFor.includes('romance') &&
            formData.interestedInGenderRomance.length === 0
        ) {
            newErrors.interestedInGenderRomance =
                'Debes seleccionar al menos un género para romance';
        }

        if (
            formData.lookingFor.includes('friendship') &&
            formData.interestedInGenderFriendship.length === 0
        ) {
            newErrors.interestedInGenderFriendship =
                'Debes seleccionar al menos un género para amistad';
        }

        const minAge = Number(formData.ageRangeMin);
        const maxAge = Number(formData.ageRangeMax);

        if (minAge < 18 || minAge > 100) {
            newErrors.ageRangeMin = 'La edad mínima debe estar entre 18 y 100';
        }

        if (maxAge < 18 || maxAge > 100) {
            newErrors.ageRangeMax = 'La edad máxima debe estar entre 18 y 100';
        }

        if (minAge >= maxAge) {
            newErrors.ageRange = 'La edad mínima debe ser menor que la máxima';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --------------------------------------------------
    // SUBMIT FINAL
    // --------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        const step1 = JSON.parse(localStorage.getItem('registerStep1') || '{}');
        const step2 = JSON.parse(localStorage.getItem('registerStep2') || '{}');
        const step3 = JSON.parse(localStorage.getItem('registerStep3') || '{}');

        const newUser = {
            nombre: step1.name,
            email: step1.email,
            telefono: Number(step1.phone),
            password: step1.password,

            edad: Number(step2.age),
            ocupacion: step2.occupation,
            ubicacion: step2.location,
            biografia: step2.bio,
            generoUsuario: step2.gender,

            imagenes: step2.photo ? [step2.photo] : [],
            intereses: step3.interests,

            lookingFor: formData.lookingFor,
            generosRomance: formData.interestedInGenderRomance,
            generosAmistad: formData.interestedInGenderFriendship,
            rangoEdad: [
                Number(formData.ageRangeMin),
                Number(formData.ageRangeMax),
            ],
        };

        try {
            const result = await authApi.register(newUser);
            setAccessToken(result.accessToken, result.userId);

            localStorage.clear();
            onComplete();
        } catch (err) {
            console.error('❌ Error en registro:', err);
        }
    };

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    return (
        <div className="min-h-screen bg-gradient-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card border-0 shadow-2xl p-8 lg:p-10">

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/register/step3')}
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
                        Paso 4 de 4: ¿Qué estás buscando?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* LOOKING FOR */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">
                            <Users className="w-4 h-4 inline mr-1" />
                            Estoy buscando
                        </label>

                        <div className="space-y-3">
                            {LOOKING_FOR_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => {
                                        const updated = formData.lookingFor.includes(opt.value)
                                            ? formData.lookingFor.filter(v => v !== opt.value)
                                            : [...formData.lookingFor, opt.value];
                                        setFormData({ ...formData, lookingFor: updated });
                                    }}
                                    className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                                        formData.lookingFor.includes(opt.value)
                                            ? `${opt.gradient} text-white scale-105 shadow-lg`
                                            : 'bg-muted text-muted-foreground hover:bg-accent'
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        <p className="text-muted-foreground text-xs mt-2">
                            Puedes seleccionar múltiples opciones
                        </p>

                        {errors.lookingFor && (
                            <p className="text-destructive text-sm mt-1">{errors.lookingFor}</p>
                        )}
                    </div>

                    {/* ROMANCE */}
                    {formData.lookingFor.includes('romance') && (
                        <div>
                            <label className="block text-sm font-semibold mb-3">
                                💕 Interesado/a en (Romance)
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {GENDER_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            const updated = formData.interestedInGenderRomance.includes(opt.value)
                                                ? formData.interestedInGenderRomance.filter(v => v !== opt.value)
                                                : [...formData.interestedInGenderRomance, opt.value];
                                            setFormData({ ...formData, interestedInGenderRomance: updated });
                                        }}
                                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                                            formData.interestedInGenderRomance.includes(opt.value)
                                                ? 'bg-gradient-1 text-white scale-105 shadow-lg'
                                                : 'bg-muted text-muted-foreground hover:bg-accent'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            {errors.interestedInGenderRomance && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.interestedInGenderRomance}
                                </p>
                            )}
                        </div>
                    )}

                    {/* FRIENDSHIP */}
                    {formData.lookingFor.includes('friendship') && (
                        <div>
                            <label className="block text-sm font-semibold mb-3">
                                🤝 Interesado/a en (Amistad)
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {GENDER_OPTIONS.map(opt => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            const updated = formData.interestedInGenderFriendship.includes(opt.value)
                                                ? formData.interestedInGenderFriendship.filter(v => v !== opt.value)
                                                : [...formData.interestedInGenderFriendship, opt.value];
                                            setFormData({ ...formData, interestedInGenderFriendship: updated });
                                        }}
                                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                                            formData.interestedInGenderFriendship.includes(opt.value)
                                                ? 'bg-gradient-friendship text-friendship-foreground scale-105 shadow-lg'
                                                : 'bg-muted text-muted-foreground hover:bg-accent'
                                        }`}
                                    >
                                        {opt.label}
                                    </button>
                                ))}
                            </div>
                            {errors.interestedInGenderFriendship && (
                                <p className="text-destructive text-sm mt-1">
                                    {errors.interestedInGenderFriendship}
                                </p>
                            )}
                        </div>
                    )}

                    {/* AGE RANGE */}
                    <div>
                        <label className="block text-sm font-semibold mb-3">
                            Rango de edad deseado
                        </label>

                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                min="18"
                                max="100"
                                value={formData.ageRangeMin}
                                onChange={(e) =>
                                    setFormData({ ...formData, ageRangeMin: e.target.value })
                                }
                                className="w-full bg-background border border-input rounded-lg px-4 py-3"
                            />
                            <span className="text-muted-foreground">-</span>
                            <input
                                type="number"
                                min="18"
                                max="100"
                                value={formData.ageRangeMax}
                                onChange={(e) =>
                                    setFormData({ ...formData, ageRangeMax: e.target.value })
                                }
                                className="w-full bg-background border border-input rounded-lg px-4 py-3"
                            />
                        </div>

                        <div className="bg-muted rounded-lg p-4 mt-4 text-center">
                            Buscando personas entre{' '}
                            <span className="font-bold text-primary">{formData.ageRangeMin}</span> y{' '}
                            <span className="font-bold text-primary">{formData.ageRangeMax}</span> años
                        </div>

                        {(errors.ageRangeMin || errors.ageRangeMax || errors.ageRange) && (
                            <p className="text-destructive text-sm mt-1">
                                {errors.ageRange || errors.ageRangeMin || errors.ageRangeMax}
                            </p>
                        )}
                    </div>

                    <Button type="submit" className="w-full py-6 text-lg">
                        Completar Registro
                    </Button>

                </form>
            </Card>
        </div>
    );
}
