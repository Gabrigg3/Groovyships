import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, ArrowLeft, Camera, MapPin } from 'lucide-react';

interface RegisterStep2Props {
    onComplete: () => void;
}

export function RegisterStep2({ onComplete }: RegisterStep2Props) {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [formData, setFormData] = useState({
        photo: '',
        location: '',
        interests: '',
        bio: '',
        lookingFor: [] as string[],
    });

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, photo: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica para guardar todos los datos
        const step1Data = localStorage.getItem('registerStep1');
        console.log('Datos completos:', { ...JSON.parse(step1Data || '{}'), ...formData });
        localStorage.removeItem('registerStep1');
        onComplete();
    };

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
                    <h1 className="text-foreground text-3xl font-bold font-sans mb-2">Completa tu Perfil</h1>
                    <p className="text-muted-foreground text-center font-body">
                        Paso 2 de 2: Información adicional
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                onClick={() => {
                                    if (fileInputRef.current) {
                                        fileInputRef.current.click();
                                    }
                                }}
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
                        <p className="text-muted-foreground text-sm font-body text-center">
                            Sube una foto de perfil
                        </p>
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-foreground text-sm font-semibold font-body mb-2">
                            <MapPin className="w-4 h-4 inline mr-1" strokeWidth={1.5} />
                            Ubicación
                        </label>
                        <input
                            id="location"
                            type="text"
                            required
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Ciudad, País"
                        />
                    </div>

                    <div>
                        <label htmlFor="interests" className="block text-foreground text-sm font-semibold font-body mb-2">
                            Intereses
                        </label>
                        <input
                            id="interests"
                            type="text"
                            required
                            value={formData.interests}
                            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                            className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Ej: Viajes, Música, Deportes"
                        />
                        <p className="text-muted-foreground text-xs mt-1 font-body">
                            Separa tus intereses con comas
                        </p>
                    </div>

                    <div>
                        <label className="block text-foreground text-sm font-semibold font-body mb-3">
                            ¿Qué estás buscando?
                        </label>
                        <div className="space-y-3">
                            {[
                                { value: 'romance', label: '💕 Romance', gradient: 'bg-gradient-1' },
                                { value: 'friendship', label: '🤝 Amistad', gradient: 'bg-gradient-friendship' },
                            ].map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        const newLookingFor = formData.lookingFor.includes(option.value)
                                            ? formData.lookingFor.filter((v) => v !== option.value)
                                            : [...formData.lookingFor, option.value];
                                        setFormData({ ...formData, lookingFor: newLookingFor });
                                    }}
                                    className={`w-full px-4 py-3 rounded-lg text-white font-semibold font-body transition-all duration-200 ${
                                        formData.lookingFor.includes(option.value)
                                            ? `${option.gradient} scale-105 shadow-lg`
                                            : 'bg-muted text-muted-foreground hover:bg-accent'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                        <p className="text-muted-foreground text-xs mt-2 font-body">
                            Puedes seleccionar múltiples opciones
                        </p>
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-foreground text-sm font-semibold font-body mb-2">
                            Biografía
                        </label>
                        <textarea
                            id="bio"
                            required
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body min-h-[100px] focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Cuéntanos sobre ti..."
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg py-6"
                    >
                        Completar Registro
                    </Button>
                </form>
            </Card>
        </div>
    );
}
