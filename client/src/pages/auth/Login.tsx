import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart } from "lucide-react";

import { authApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";

export function Login() {
    const navigate = useNavigate();
    const setSession = useAuthStore((s) => s.setSession);

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            const { accessToken, userId } = await authApi.login({
                email: formData.email,
                password: formData.password,
            });

            // 🔑 guardar sesión (fuente de verdad)
            setSession(accessToken, userId ?? null);

            // 👉 el router reaccionará solo
            navigate("/");
        } catch (err) {
            console.error("Error en login:", err);
            setError("Credenciales incorrectas");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-1 flex items-center justify-center p-4">
            <Card className="w-full max-w-md bg-card text-card-foreground border-0 shadow-2xl p-8 lg:p-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-primary rounded-full p-4 mb-4">
                        <Heart className="w-12 h-12 text-primary-foreground" strokeWidth={2} fill="currentColor" />
                    </div>
                    <h1 className="text-primary text-4xl font-bold font-sans mb-2">Groovyships</h1>
                    <p className="text-muted-foreground text-center font-body">
                        Conecta con Groovers: ¡romance, amistad o ambos!
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && <p className="text-destructive text-center text-sm">{error}</p>}

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
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-semibold text-lg py-6"
                    >
                        Iniciar Sesión
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-muted-foreground font-body">
                        ¿No tienes cuenta?{" "}
                        <button
                            onClick={() => navigate("/register/step1")}
                            className="text-primary font-semibold hover:underline"
                        >
                            Regístrate
                        </button>
                    </p>
                </div>
            </Card>
        </div>
    );
}