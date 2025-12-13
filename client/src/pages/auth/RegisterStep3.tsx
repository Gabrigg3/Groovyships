import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ArrowLeft, Check } from 'lucide-react';
import { interestsApi } from '@/api/interestsApi';
import type { Interes } from '@/models/Interes';

export function RegisterStep3() {
    const navigate = useNavigate();

    const [interestsByCategory, setInterestsByCategory] =
        useState<Record<string, Interes[]>>({});

    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // --------------------------------------------------
    // CARGAR INTERESES DESDE BACKEND
    // --------------------------------------------------

    /*
    *
    * */
    useEffect(() => {
        interestsApi.getAll()
            .then((interests) => {
                const grouped = interests.reduce((acc, interes) => {
                    acc[interes.categoria] ||= [];
                    acc[interes.categoria].push(interes);
                    return acc;
                }, {} as Record<string, Interes[]>);

                setInterestsByCategory(grouped);
            })
            .catch((e) => {
                console.error("Error cargando intereses:", e);
            });

    }, []);

    // --------------------------------------------------
    // VALIDACIÓN
    // --------------------------------------------------
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (selectedInterests.length === 0) {
            newErrors.interests = 'Debes seleccionar al menos un interés';
        }

        if (selectedInterests.length > 15) {
            newErrors.interests = 'Puedes seleccionar máximo 15 intereses';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // --------------------------------------------------
    // TOGGLE INTERÉS (POR ID)
    // --------------------------------------------------
    const toggleInterest = (interestId: string) => {
        if (selectedInterests.includes(interestId)) {
            setSelectedInterests(selectedInterests.filter((i) => i !== interestId));
        } else if (selectedInterests.length < 15) {
            setSelectedInterests([...selectedInterests, interestId]);
        }
    };

    // --------------------------------------------------
    // SUBMIT
    // --------------------------------------------------
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            localStorage.setItem(
                'registerStep3',
                JSON.stringify({ interests: selectedInterests })
            );
            navigate('/register/step4');
        }
    };

    // --------------------------------------------------
    // RENDER
    // --------------------------------------------------
    return (
        <div className="min-h-screen bg-gradient-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-4xl bg-card text-card-foreground border-0 shadow-2xl p-8 lg:p-10 max-h-[90vh] overflow-y-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/register/step2')}
                    className="mb-4 bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
                </Button>

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary rounded-full p-4 mb-4">
                        <Heart className="w-12 h-12 text-primary-foreground" strokeWidth={2} fill="currentColor" />
                    </div>
                    <h1 className="text-foreground text-3xl font-bold font-sans mb-2">
                        Tus Intereses
                    </h1>
                    <p className="text-muted-foreground text-center font-body">
                        Paso 3 de 4: Selecciona tus intereses
                    </p>
                    <p className="text-primary text-sm font-semibold font-body mt-2">
                        {selectedInterests.length} / 15 seleccionados
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {Object.entries(interestsByCategory).map(([category, interests]) => (
                        <div key={category}>
                            <h3 className="text-foreground text-lg font-bold font-sans mb-4">
                                {category}
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                {interests.map((interest) => {
                                    const isSelected = selectedInterests.includes(interest.id);

                                    return (
                                        <button
                                            key={interest.id}
                                            type="button"
                                            onClick={() => toggleInterest(interest.id)}
                                            disabled={!isSelected && selectedInterests.length >= 15}
                                            className={`relative px-4 py-3 rounded-lg font-semibold font-body text-sm transition-all duration-200 ${
                                                isSelected
                                                    ? 'bg-primary text-primary-foreground scale-105 shadow-lg'
                                                    : 'bg-muted text-muted-foreground hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed'
                                            }`}
                                        >
                                            {interest.nombre}

                                            {isSelected && (
                                                <div className="absolute -top-1 -right-1 bg-success text-success-foreground rounded-full p-1">
                                                    <Check className="w-3 h-3" strokeWidth={3} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {errors.interests && (
                        <p className="text-destructive text-sm text-center font-semibold">
                            {errors.interests}
                        </p>
                    )}

                    <div className="sticky bottom-0 bg-card pt-4 border-t border-border">
                        <Button
                            type="submit"
                            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg py-6"
                        >
                            Continuar
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}