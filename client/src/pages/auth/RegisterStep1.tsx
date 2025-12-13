import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Heart, ArrowLeft } from 'lucide-react';

interface RegisterFormData {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export function RegisterStep1() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<RegisterFormData>({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El correo es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Correo inválido';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // 1️⃣ Guardamos Step1 para Step2
        localStorage.setItem("registerStep1", JSON.stringify(formData));

        // 2️⃣ Pasamos a Step2
        navigate("/register/step2");
    };

    return (
        <div className="min-h-screen bg-gradient-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card text-card-foreground border-0 shadow-2xl p-8 lg:p-10">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/login')}
                    className="mb-4 bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                >
                    <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
                </Button>

                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary rounded-full p-4 mb-4">
                        <Heart className="w-12 h-12 text-primary-foreground" strokeWidth={2} fill="currentColor" />
                    </div>
                    <h1 className="text-foreground text-3xl font-bold font-sans mb-2">Crear Cuenta</h1>
                    <p className="text-muted-foreground text-center font-body">
                        Paso 1 de 4: Información básica
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div>
                        <label htmlFor="name" className="block text-foreground text-sm font-semibold font-body mb-2">
                            Nombre completo
                        </label>
                        <input
                            id="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="Tu nombre"
                        />
                        {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-foreground text-sm font-semibold font-body mb-2">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="tu@email.com"
                        />
                        {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-foreground text-sm font-semibold font-body mb-2">
                            Teléfono
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="+34 600 000 000"
                        />
                        {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-foreground text-sm font-semibold font-body mb-2">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-foreground text-sm font-semibold font-body mb-2">
                            Repetir contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                            placeholder="••••••••"
                        />
                        {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

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