import {useEffect, useRef, useState} from "react";
import { profileApi } from "@/api/profileApi";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { uploadMedia } from "@/api/mediaApi";
import { interestsApi } from "@/api/interestsApi";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Camera,
    MapPin,
    Briefcase,
    Calendar,
    Users,
    Edit2,
    Trash2,
} from "lucide-react";


type Gender = "hombre" | "mujer" | "otro";
type LookingFor = "romance" | "amistad";

export function Profile() {
    const [profileData, setProfileData] = useState<{
        id?: string;
        name: string;
        age: number;
        gender: Gender;
        occupation: string;
        location: string;
        bio: string;
        lookingFor: LookingFor[];
        interestedInGenderRomance: Gender[];
        interestedInGenderFriendship: Gender[];
        ageRangeMin: number;
        ageRangeMax: number;
        interests: string[];
        photos: string[];
    } | null>(null);

    const [isEditingBio, setIsEditingBio] = useState(false);
    const [isEditingLookingFor, setIsEditingLookingFor] = useState(false);
    const [isEditingGender, setIsEditingGender] = useState(false);
    const [isEditingAgeRange, setIsEditingAgeRange] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [interestMap, setInterestMap] = useState<Record<string, string>>({});
    const [isEditingHeader, setIsEditingHeader] = useState(false);

    /* ================================
       LOAD PROFILE
    ================================= */
    useEffect(() => {
        profileApi.getMe().then((data) => {
            setProfileData({
                id: data.id,
                name: data.name,
                age: data.age,
                gender: data.gender,
                occupation: data.occupation ?? "",
                location: data.location ?? "",
                bio: data.bio ?? "",
                lookingFor: data.lookingFor ?? [],
                interestedInGenderRomance: data.interestedInGenderRomance ?? [],
                interestedInGenderFriendship: data.interestedInGenderFriendship ?? [],
                ageRangeMin: data.ageRangeMin ?? 18,
                ageRangeMax: data.ageRangeMax ?? 99,
                interests: data.interests ?? [],
                photos: data.photos ?? [],
            });
        });
    }, []);

    //================================
    //   INTERESTS
    //=================================
    useEffect(() => {
        interestsApi.getAll().then((interests) => {
            const map: Record<string, string> = {};
            interests.forEach((i) => {
                map[i.id] = i.nombre;
            });
            setInterestMap(map);
        });
    }, []);



    if (!profileData) {
        return <div className="pt-20 text-center">Cargando perfil…</div>;
    }

    /* ================================
       SAVE PROFILE
    ================================= */
    const saveProfile = async () => {
        if (!profileData) return;

        try {
            setIsSaving(true);

            await profileApi.updateMe({
                name: profileData.name,
                age: profileData.age,
                gender: profileData.gender,
                occupation: profileData.occupation,
                location: profileData.location,
                bio: profileData.bio,
                lookingFor: profileData.lookingFor,
                interestedInGenderRomance: profileData.interestedInGenderRomance,
                interestedInGenderFriendship: profileData.interestedInGenderFriendship,
                ageRangeMin: profileData.ageRangeMin,
                ageRangeMax: profileData.ageRangeMax,
                interests: profileData.interests,
                photos: profileData.photos,
            });

            // opcional: cerrar modos edición
            setIsEditingBio(false);
            setIsEditingGender(false);
            setIsEditingLookingFor(false);
            setIsEditingAgeRange(false);

        } catch (err) {
            console.error("Error guardando perfil", err);
            alert("❌ Error al guardar el perfil");
        } finally {
            setIsSaving(false);
        }
    };



    const handleDeleteAccount = async () => {
        try {
            await profileApi.deleteMe();
            localStorage.clear();
            window.location.href = "/login";
        } catch (e) {
            console.error("Error eliminando cuenta", e);
            alert("No se pudo eliminar la cuenta");
        }
    };



    const genderLabels: Record<Gender, string> = {
        hombre: "👨 Hombre",
        mujer: "👩 Mujer",
        otro: "🌈 Otro",
    };

    const genderOptions: { value: Gender; label: string }[] = [
        { value: "hombre", label: "👨 Hombre" },
        { value: "mujer", label: "👩 Mujer" },
        { value: "otro", label: "🌈 Otro" },
    ];

    const lovefriendhipoptions: { value: Gender; label: string }[] = [
        { value: "hombre", label: "👨 Hombres" },
        { value: "mujer", label: "👩 Mujeres" },
        { value: "otro", label: "🌈 Otros" },
    ];

    const lookingForLabels: Record<LookingFor, { emoji: string; label: string }> = {
        romance: { emoji: "💕", label: "Romance" },
        amistad: { emoji: "🤝", label: "Amistad" },
    };

    const lookingForOptions: {
        value: LookingFor;
        label: string;
        gradient: string;
    }[] = [
        { value: "romance", label: "💕 Romance", gradient: "bg-gradient-1" },
        { value: "amistad", label: "🤝 Amistad", gradient: "bg-gradient-friendship" },
    ];


    const handleUploadPhoto = async (file: File) => {
        const url = await uploadMedia(file, "image");

        const updatedPhotos = [...profileData.photos, url];

        setProfileData({
            ...profileData,
            photos: updatedPhotos,
        });

        await profileApi.updateMe({
            photos: updatedPhotos,
        });
    };

    return (
        <div className="pt-16 lg:pt-20 min-h-screen bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-4xl">
                <div className="flex items-center justify-between mb-8 lg:mb-12">
                    <h1 className="text-foreground text-3xl lg:text-4xl font-bold font-sans">
                        Edit Profile
                    </h1>

                    <Button
                        onClick={saveProfile}
                        disabled={isSaving}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                    >
                        {isSaving ? "Guardando..." : "Guardar"}
                    </Button>
                </div>

                {/* Profile Header */}
                <Card className="bg-card text-card-foreground border-border p-6 lg:p-8 mb-6 relative">

                    {/* BOTÓN EDITAR */}
                    <Button
                        onClick={() => setIsEditingHeader(!isEditingHeader)}
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 bg-transparent text-foreground hover:bg-accent"
                    >
                        <Edit2 className="w-5 h-5" />
                    </Button>

                    <div className="flex flex-col md:flex-row items-center gap-6">

                        <div className="flex-1 text-center md:text-left">

                            {/* NOMBRE */}
                            <h2 className="text-foreground text-2xl lg:text-3xl font-bold font-sans mb-2 flex flex-wrap items-center gap-2 justify-center md:justify-start">
                                {isEditingHeader ? (
                                    <>
                                        {/* NOMBRE */}
                                        <input
                                            value={profileData.name}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="bg-background border border-input rounded-lg px-3 py-2"
                                            placeholder="Nombre"
                                        />

                                        <span>,</span>

                                        {/* EDAD */}
                                        <input
                                            type="number"
                                            min={18}
                                            max={100}
                                            value={profileData.age}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    age: Number(e.target.value),
                                                })
                                            }
                                            className="w-20 bg-background border border-input rounded-lg px-3 py-2"
                                            placeholder="Edad"
                                        />
                                    </>
                                ) : (
                                    <>
                                        {profileData.name}, {profileData.age}
                                    </>
                                )}
                            </h2>

                            <div className="flex flex-col md:flex-row items-center gap-4 text-muted-foreground mb-3">

                                {/* UBICACIÓN */}
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <MapPin className="w-5 h-5" strokeWidth={1.5} />

                                    {isEditingHeader ? (
                                        <input
                                            value={profileData.location}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, location: e.target.value })
                                            }
                                            className="w-full bg-background border border-input rounded-lg px-3 py-2"
                                        />
                                    ) : (
                                        <span className="text-base font-body">
                            {profileData.location}
                        </span>
                                    )}
                                </div>

                                {/* OCUPACIÓN */}
                                <div className="flex items-center gap-2 w-full md:w-auto">
                                    <Briefcase className="w-5 h-5" strokeWidth={1.5} />

                                    {isEditingHeader ? (
                                        <input
                                            value={profileData.occupation}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    occupation: e.target.value,
                                                })
                                            }
                                            className="w-full bg-background border border-input rounded-lg px-3 py-2"
                                            placeholder="Ocupación"
                                        />
                                    ) : (
                                        <span className="text-base font-body">
                                            {profileData.occupation}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* BADGES */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-2">
                                {profileData.lookingFor.map((type) => {
                                    const badge = lookingForLabels[type];
                                    if (!badge) return null;

                                    const gradientClass =
                                        type === "romance"
                                            ? "bg-gradient-1"
                                            : "bg-gradient-friendship";

                                    return (
                                        <span
                                            key={type}
                                            className={`${gradientClass} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                                        >
                            {badge.emoji} {badge.label}
                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Gender Section */}
                <Card className="bg-card text-card-foreground border-border p-6 lg:p-8 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-foreground text-xl font-bold font-sans">Género</h3>
                        <Button
                            onClick={() => setIsEditingGender(!isEditingGender)}
                            variant="ghost"
                            size="icon"
                            className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <Edit2 className="w-5 h-5" strokeWidth={1.5} />
                        </Button>
                    </div>

                    {isEditingGender ? (
                        <div>
                            <div className="grid grid-cols-3 gap-3 mb-4">
                                {genderOptions.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() =>
                                            setProfileData({
                                                ...profileData,
                                                gender: option.value, // ✅ valor único
                                            })
                                        }
                                        className={`px-4 py-3 rounded-lg font-semibold font-body transition-all ${
                                            profileData.gender === option.value
                                                ? "bg-primary text-primary-foreground scale-105 shadow-lg"
                                                : "bg-muted text-muted-foreground hover:bg-accent"
                                        }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>

                            <Button
                                onClick={() => setIsEditingGender(false)}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Guardar
                            </Button>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold font-body">
                                {genderLabels[profileData.gender]}
                            </span>
                        </div>

                    )}
                </Card>

                {/* Bio Section */}
                <Card className="bg-card text-card-foreground border-border p-6 lg:p-8 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-foreground text-xl font-bold font-sans">Sobre mí</h3>
                        <Button
                            onClick={() => setIsEditingBio(!isEditingBio)}
                            variant="ghost"
                            size="icon"
                            className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <Edit2 className="w-5 h-5" strokeWidth={1.5} />
                        </Button>
                    </div>
                    {isEditingBio ? (
                        <div>
              <textarea
                  value={profileData.bio}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  className="w-full bg-background text-foreground border border-input rounded-lg p-4 text-base font-body min-h-[120px] focus:outline-none focus:ring-2 focus:ring-ring"
              />
                            <div className="flex gap-3 mt-4">
                                <Button
                                    onClick={() => setIsEditingBio(false)}
                                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    Guardar
                                </Button>
                                <Button
                                    onClick={() => setIsEditingBio(false)}
                                    variant="outline"
                                    className="bg-transparent text-foreground border-border hover:bg-accent hover:text-accent-foreground"
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-foreground text-base font-body leading-relaxed">{profileData.bio}</p>
                    )}
                </Card>

                {/* Looking For Section */}
                <Card className="bg-card text-card-foreground border-border p-6 lg:p-8 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-foreground text-xl font-bold font-sans">
                            <Users className="w-5 h-5 inline mr-2" strokeWidth={1.5} />
                            Estoy buscando
                        </h3>
                        <Button
                            onClick={() => setIsEditingLookingFor(!isEditingLookingFor)}
                            variant="ghost"
                            size="icon"
                            className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <Edit2 className="w-5 h-5" strokeWidth={1.5} />
                        </Button>
                    </div>
                    {isEditingLookingFor ? (
                        <div>
                            <div className="space-y-3 mb-4">
                                {lookingForOptions.map((option) => {
                                    const selected = profileData.lookingFor.includes(option.value);

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => {
                                                const updated = selected
                                                    ? profileData.lookingFor.filter((v) => v !== option.value)
                                                    : [...profileData.lookingFor, option.value];

                                                setProfileData({
                                                    ...profileData,
                                                    lookingFor: updated,
                                                });
                                            }}
                                            className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                                                selected
                                                    ? option.value === "romance"
                                                        ? "bg-gradient-1 text-white scale-105"
                                                        : "bg-gradient-friendship text-white scale-105"
                                                    : "bg-muted text-muted-foreground hover:bg-accent"
                                            }`}
                                        >
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Romance Gender Preferences */}
                            {profileData.lookingFor.includes('romance') && (
                                <div className="mb-4">
                                    <label className="block text-foreground text-sm font-semibold font-body mb-3">
                                        💕 Interesado/a en (Romance)
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {lovefriendhipoptions.map((option) => {
                                            const selected = profileData.interestedInGenderRomance.includes(option.value);

                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = selected
                                                            ? profileData.interestedInGenderRomance.filter(g => g !== option.value)
                                                            : [...profileData.interestedInGenderRomance, option.value];

                                                        setProfileData({
                                                            ...profileData,
                                                            interestedInGenderRomance: updated,
                                                        });
                                                    }}
                                                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                                                        selected
                                                            ? "bg-gradient-1 text-white scale-105 shadow-lg"
                                                            : "bg-muted text-muted-foreground hover:bg-accent"
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Friendship Gender Preferences */}
                            {profileData.lookingFor.includes('amistad') && (
                                <div className="mb-4">
                                    <label className="block text-foreground text-sm font-semibold font-body mb-3">
                                        🤝 Interesado/a en (Amistad)
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {lovefriendhipoptions.map((option) => {
                                            const selected = profileData.interestedInGenderFriendship.includes(option.value);

                                            return (
                                                <button
                                                    key={option.value}
                                                    type="button"
                                                    onClick={() => {
                                                        const updated = selected
                                                            ? profileData.interestedInGenderFriendship.filter(g => g !== option.value)
                                                            : [...profileData.interestedInGenderFriendship, option.value];

                                                        setProfileData({
                                                            ...profileData,
                                                            interestedInGenderFriendship: updated,
                                                        });
                                                    }}
                                                    className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                                                        selected
                                                            ? "bg-gradient-friendship text-white scale-105 shadow-lg"
                                                            : "bg-muted text-muted-foreground hover:bg-accent"
                                                    }`}
                                                >
                                                    {option.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={() => setIsEditingLookingFor(false)}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Guardar
                            </Button>
                        </div>
                    ) : (
                        <div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {profileData.lookingFor.map((type) => {
                                    const badge = lookingForLabels[type];

                                    if (!badge) return null; // 👈 protección CRÍTICA

                                    const gradientClass =
                                        type === "romance" ? "bg-gradient-1" : "bg-gradient-friendship";

                                    return (
                                        <span
                                            key={type}
                                            className={`${gradientClass} text-white px-3 py-1 rounded-full text-sm font-semibold font-body`}
                                        >
            {badge.emoji} {badge.label}
        </span>
                                    );
                                })}
                            </div>

                            {profileData.lookingFor.includes('romance') && (
                                <div className="mb-3">
                                    <p className="text-muted-foreground text-sm font-body mb-2">💕 Romance:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.interestedInGenderRomance.map((gender) => (
                                            <span key={gender} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-body">
                        {genderLabels[gender as keyof typeof genderLabels]}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {profileData.lookingFor.includes('amistad') && (
                                <div>
                                    <p className="text-muted-foreground text-sm font-body mb-2">🤝 Amistad:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {profileData.interestedInGenderFriendship.map((gender) => (
                                            <span key={gender} className="bg-friendship/10 text-friendship px-3 py-1 rounded-full text-sm font-body">
                        {genderLabels[gender as keyof typeof genderLabels]}
                      </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </Card>

                {/* Age Range Section */}
                <Card className="bg-card text-card-foreground border-border p-6 lg:p-8 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-foreground text-xl font-bold font-sans">
                            <Calendar className="w-5 h-5 inline mr-2" strokeWidth={1.5} />
                            Rango de edad deseado
                        </h3>
                        <Button
                            onClick={() => setIsEditingAgeRange(!isEditingAgeRange)}
                            variant="ghost"
                            size="icon"
                            className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <Edit2 className="w-5 h-5" strokeWidth={1.5} />
                        </Button>
                    </div>
                    {isEditingAgeRange ? (
                        <div>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="flex-1">
                                    <label className="block text-muted-foreground text-xs font-body mb-2">
                                        Edad mínima
                                    </label>
                                    <input
                                        type="number"
                                        min="18"
                                        max="100"
                                        value={profileData.ageRangeMin}
                                        onChange={(e) => setProfileData({ ...profileData, ageRangeMin: parseInt(e.target.value) })}
                                        className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                                <span className="text-muted-foreground text-2xl mt-6">-</span>
                                <div className="flex-1">
                                    <label className="block text-muted-foreground text-xs font-body mb-2">
                                        Edad máxima
                                    </label>
                                    <input
                                        type="number"
                                        min="18"
                                        max="100"
                                        value={profileData.ageRangeMax}
                                        onChange={(e) => setProfileData({ ...profileData, ageRangeMax: parseInt(e.target.value) })}
                                        className="w-full bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                                    />
                                </div>
                            </div>
                            <Button
                                onClick={() => setIsEditingAgeRange(false)}
                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                Guardar
                            </Button>
                        </div>
                    ) : (
                        <div className="bg-muted rounded-lg p-4">
                            <p className="text-foreground text-center font-body">
                                Buscando personas entre{' '}
                                <span className="font-bold text-primary">{profileData.ageRangeMin}</span> y{' '}
                                <span className="font-bold text-primary">{profileData.ageRangeMax}</span> años
                            </p>
                        </div>
                    )}
                </Card>

                {/* Photos Section */}
                <Card className="bg-card text-card-foreground border-border p-6 lg:p-8 mb-6">
                    <h3 className="text-foreground text-xl font-bold font-sans mb-4">
                        Fotos ({profileData.photos.length}/6)
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {profileData.photos.map((photo, index) => (
                            <div
                                key={index}
                                className="relative aspect-square rounded-lg overflow-hidden group"
                            >
                                <img
                                    src={photo}
                                    alt={`Foto ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />

                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        size="icon"
                                        className="bg-primary text-primary-foreground"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Camera className="w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}

                        {/* Slot para añadir nueva foto */}
                        {profileData.photos.length < 6 && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="aspect-square rounded-lg border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:bg-accent transition"
                            >
                                <Camera className="w-6 h-6" />
                            </button>
                        )}
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadPhoto(file);
                        }}
                    />
                </Card>

                {/* Interests Section */}
                <Card className="bg-card text-card-foreground border-border p-6 lg:p-8 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-foreground text-xl font-bold font-sans">
                            Intereses ({profileData.interests.length}/15)
                        </h3>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                        >
                            <Edit2 className="w-5 h-5" strokeWidth={1.5} />
                        </Button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {profileData.interests.map((interestId) => (
                            <span
                                key={interestId}
                                className="bg-primary/10 text-primary px-4 py-2 rounded-full text-base font-body"
                            >
                            {interestMap[interestId] ?? "Interés"}
                            </span>
                        ))}
                    </div>

                </Card>

                {/* Delete Account Section */}
                <Card className="bg-card text-card-foreground border-destructive/50 p-6 lg:p-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="bg-destructive/10 rounded-full p-4 mb-4">
                            <Trash2 className="w-8 h-8 text-destructive" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-foreground text-xl font-bold font-sans mb-2">
                            ¿Deseas eliminar la cuenta?
                        </h3>
                        <p className="text-muted-foreground font-body mb-6">
                            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, asegúrate.
                        </p>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                    <Trash2 className="w-5 h-5 mr-2" strokeWidth={1.5} />
                                    Eliminar Cuenta
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card text-card-foreground border-border">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-foreground text-2xl font-bold font-sans">
                                        ¿Estás absolutamente seguro?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground font-body text-base">
                                        Esta acción no se puede deshacer. Esto eliminará permanentemente tu cuenta
                                        y removerá todos tus datos de nuestros servidores, incluyendo:
                                    </AlertDialogDescription>
                                    <ul className="text-muted-foreground font-body text-sm list-disc list-inside space-y-2 mt-4">
                                        <li>Tu perfil y todas tus fotos</li>
                                        <li>Todos tus matches y conversaciones</li>
                                        <li>Tu historial de likes y super likes</li>
                                        <li>Todas tus preferencias y configuraciones</li>
                                    </ul>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex-col sm:flex-row gap-3">
                                    <AlertDialogCancel className="bg-transparent text-foreground border-border hover:bg-accent hover:text-accent-foreground">
                                        Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDeleteAccount}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Sí, eliminar mi cuenta
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </Card>
            </div>
        </div>
    );
}
