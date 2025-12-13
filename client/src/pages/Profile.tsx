import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, MapPin, Briefcase } from "lucide-react";
import type { UserLight } from "@/models/UserLight";

interface ProfileProps {
    user: UserLight | undefined;   // aceptar undefined sin romper
}

export function Profile({ user }: ProfileProps) {


    if (!user) {
        return (
            <div className="pt-16 text-center text-lg text-muted-foreground">
                Cargando perfil...
            </div>
        );
    }


    const [bio, setBio] = useState(user.biografia || "");
    const [isEditingBio, setIsEditingBio] = useState(false);

    const photos = user.imagenes?.length
        ? user.imagenes
        : ["https://via.placeholder.com/400"];

    const interests = user.intereses || [];

    return (
        <div className="pt-16 lg:pt-20 min-h-screen bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-4xl">
                <h1 className="text-foreground text-3xl lg:text-4xl font-bold font-sans mb-8 lg:mb-12">
                    Edit Profile
                </h1>

                {/* Profile Header */}
                <Card className="bg-card text-card-foreground border-border p-6 lg:p-8 mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">

                        <div className="relative">
                            <Avatar className="w-32 h-32 lg:w-40 lg:h-40">
                                <AvatarImage src={photos[0]} alt="Foto de perfil" />
                                <AvatarFallback className="bg-primary text-primary-foreground text-4xl">
                                    {user.nombre?.slice(0, 2).toUpperCase() ?? "US"}
                                </AvatarFallback>
                            </Avatar>

                            <Button
                                size="icon"
                                className="absolute bottom-0 right-0 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                <Camera className="w-5 h-5" strokeWidth={1.5} />
                            </Button>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-foreground text-2xl lg:text-3xl font-bold font-sans mb-2">
                                {user.nombre}, {user.edad ?? "—"}
                            </h2>

                            <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground">
                                {user.ubicacion && (
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5" strokeWidth={1.5} />
                                        <span>{user.ubicacion}</span>
                                    </div>
                                )}

                                {user.ocupacion && (
                                    <div className="flex items-center gap-2">
                                        <Briefcase className="w-5 h-5" strokeWidth={1.5} />
                                        <span>{user.ocupacion}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Bio */}
                <Card className="bg-card text-card-foreground border-border p-6 lg:p-8 mb-6">
                    <h3 className="text-foreground text-xl font-bold mb-4">About Me</h3>

                    {isEditingBio ? (
                        <div>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="w-full bg-background border rounded-lg p-4"
                            />

                            <div className="flex gap-3 mt-4">
                                <Button
                                    onClick={() => setIsEditingBio(false)}
                                    className="bg-primary text-primary-foreground"
                                >
                                    Save
                                </Button>

                                <Button onClick={() => setIsEditingBio(false)} variant="outline">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <p>{bio || "No bio provided yet."}</p>
                            <Button variant="outline" onClick={() => setIsEditingBio(true)}>
                                Edit Bio
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Fotos */}
                <Card className="p-6 lg:p-8 mb-6">
                    <h3 className="text-xl font-bold mb-4">Photos</h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {photos.map((photo, i) => (
                            <div key={i} className="relative aspect-square rounded-lg overflow-hidden">
                                <img src={photo} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Interests */}
                <Card className="p-6 lg:p-8">
                    <h3 className="text-xl font-bold mb-4">Interests</h3>

                    <div className="flex flex-wrap gap-3">
                        {interests.length > 0 ? (
                            interests.map((i, idx) => (
                                <span key={idx} className="bg-primary/10 text-primary px-4 py-2 rounded-full">
                                    {i}
                                </span>
                            ))
                        ) : (
                            <p>No interests added yet.</p>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}