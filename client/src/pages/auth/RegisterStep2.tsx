import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Heart,
    ArrowLeft,
    Camera,
    MapPin,
    Briefcase,
    Calendar
} from 'lucide-react';

export function RegisterStep2() {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const [formData, setFormData] = useState({
        photo: '',
        location: '',
        age: '',
        occupation: '',
        gender: '',
        bio: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    // -------------------------------------------------------
    // VALIDACIÓN
    // -------------------------------------------------------
    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.age) {
            newErrors.age = 'La edad es requerida';
        } else if (+formData.age < 18 || +formData.age > 100) {
            newErrors.age = 'La edad debe estar entre 18 y 100 años';
        }

        if (!formData.occupation.trim()) {
            newErrors.occupation = 'La ocupación es requerida';
        }

        if (!formData.gender) {
            newErrors.gender = 'El género es requerido';
        }

        if (!formData.location.trim()) {
            newErrors.location = 'La ubicación es requerida';
        }

        if (!formData.bio.trim()) {
            newErrors.bio = 'La biografía es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // -------------------------------------------------------
    // FOTO
    // -------------------------------------------------------
    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, photo: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    // -------------------------------------------------------
    // SUBMIT
    // -------------------------------------------------------
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        localStorage.setItem('registerStep2', JSON.stringify(formData));
        navigate('/register/step3');
    };

    // -------------------------------------------------------
    // RENDER
    // -------------------------------------------------------
    return (
        <div className="min-h-screen bg-gradient-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card text-card-foreground border-0 shadow-2xl p-8 lg:p-10">

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/register/step1')}
                    className="mb-4 bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
                </Button>

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary rounded-full p-4 mb-4">
                        <Heart className="w-12 h-12 text-primary-foreground" strokeWidth={2} fill="currentColor" />
                    </div>
                    <h1 className="text-foreground text-3xl font-bold font-sans mb-2">
                        Completa tu Perfil
                    </h1>
                    <p className="text-muted-foreground text-center font-body">
                        Paso 2 de 4: Información personal
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* FOTO */}
                    <div className="flex flex-col items-center">
                        <div className="relative mb-4">
                            <Avatar className="w-32 h-32">
                                {formData.photo ? (
                                    <AvatarImage src={formData.photo} alt="Profile" />
                                ) : (
                                    <AvatarFallback className="bg-muted text-muted-foreground text-4xl">
                                        <Camera className="w-12 h-12" strokeWidth={1.5} />
                                    </AvatarFallback>
                                )}
                            </Avatar>

                            <Button
                                type="button"
                                size="icon"
                                onClick={() => fileInputRef.current?.click()}
                                className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <Camera className="w-5 h-5" strokeWidth={1.5} />
                            </Button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="hidden"
                            />
                        </div>
                        <p className="text-muted-foreground text-sm">Sube una foto de perfil</p>
                    </div>

                    {/* GRID EDAD + OCUPACIÓN */}
                    <div className="grid grid-cols-2 gap-4">

                        {/* Edad */}
                        <div>
                            <label className="block text-foreground text-sm font-semibold mb-2">
                                <Calendar className="w-4 h-4 inline mr-1" strokeWidth={1.5} />
                                Edad
                            </label>
                            <input
                                type="number"
                                min="18"
                                max="100"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="28"
                                required
                            />
                            {errors.age && <p className="text-destructive text-sm mt-1">{errors.age}</p>}
                        </div>

                        {/* Ocupación */}
                        <div>
                            <label className="block text-foreground text-sm font-semibold mb-2">
                                <Briefcase className="w-4 h-4 inline mr-1" strokeWidth={1.5} />
                                Ocupación
                            </label>
                            <input
                                type="text"
                                value={formData.occupation}
                                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                                className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                                placeholder="Designer"
                                required
                            />
                            {errors.occupation && <p className="text-destructive text-sm mt-1">{errors.occupation}</p>}
                        </div>
                    </div>

                    {/* GÉNERO */}
                    <div>
                        <label className="block text-foreground text-sm font-semibold font-body mb-3">
                            Género
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'hombre', label: '👨 Hombre' },
                                { value: 'mujer', label: '👩 Mujer' },
                                { value: 'otro', label: '🌈 Otro' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, gender: option.value })}
                                    className={`px-4 py-3 rounded-lg font-semibold font-body transition-all duration-200 ${
                                        formData.gender === option.value
                                            ? 'bg-primary text-primary-foreground scale-105 shadow-lg'
                                            : 'bg-muted text-muted-foreground hover:bg-accent'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        {errors.gender && <p className="text-destructive text-sm mt-1">{errors.gender}</p>}
                    </div>

                    {/* UBICACIÓN */}
                    <div>
                        <label className="block text-foreground text-sm font-semibold mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" strokeWidth={1.5} />
                            Ubicación
                        </label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Ciudad, País"
                            required
                        />
                        {errors.location && <p className="text-destructive text-sm mt-1">{errors.location}</p>}
                    </div>

                    {/* BIO */}
                    <div>
                        <label className="block text-foreground text-sm font-semibold mb-2">
                            Biografía
                        </label>
                        <textarea
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Cuéntanos sobre ti..."
                            required
                        />
                        {errors.bio && <p className="text-destructive text-sm mt-1">{errors.bio}</p>}
                    </div>

                    {/* CONTINUAR */}
                    <Button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg py-6"
                    >
                        Continuar
                    </Button>
                </form>

            </Card>
        </div>
    );
}
