import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
    ArrowLeft,
    Send,
    Mic,
    Image,
    Video,
    Music,
    X,
    Play,
} from "lucide-react";

import { uploadMedia } from "@/api/mediaApi";
import { messagesApi } from "@/api/messagesApi";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useAuthStore } from "@/store/authStore";
import type { MessageResponse } from "@/models/MessageResponse";
import type { InfoCard } from "@/models/InfoCard";

/* ---------------------------------------
   TIPOS
--------------------------------------- */
type UIMessage = {
    id: string;
    sender: "me" | "other";
    timestamp: string;
    type: "text" | "image" | "video" | "audio";
    text?: string;
    mediaUrl?: string;
};

/* ---------------------------------------
   COMPONENTE
--------------------------------------- */
export function ChatWindow() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useAuthStore();

    /* ---------------------------------------
       PERFIL DEL OTRO USUARIO
    --------------------------------------- */
    const { otherUserId, otherUserName, otherUserImage } =
    (location.state as {
        otherUserId: string;
        otherUserName: string;
        otherUserImage?: string;
    }) || {};

    const [chatProfile, setChatProfile] = useState<InfoCard | null>(null);

    useEffect(() => {
        if (!otherUserId) return;
        setChatProfile({
            id: otherUserId,
            name: otherUserName,
            age: 0,
            gender: "otro",
            bio: "",
            images: otherUserImage ? [otherUserImage] : [],
            imageAlt: otherUserName,
            location: "",
            occupation: "",
            interests: [],
            lookingFor: [],
        });
    }, [otherUserId, otherUserName, otherUserImage]);

    /* ---------------------------------------
       ESTADO
    --------------------------------------- */
    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [showMediaOptions, setShowMediaOptions] = useState(false);

    /* ---------------------------------------
       REFS FILE INPUTS
    --------------------------------------- */
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const audioFileInputRef = useRef<HTMLInputElement>(null);

    /* ---------------------------------------
       AUDIO RECORDING
    --------------------------------------- */
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    /* ---------------------------------------
       HELPERS
    --------------------------------------- */
    const formatTime = (seconds: number) =>
        `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

    const mapMessage = (msg: MessageResponse): UIMessage => ({
        id: msg.id,
        sender: msg.senderId === userId ? "me" : "other",
        timestamp: new Date(msg.sentAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
        type: msg.type.toLowerCase() as UIMessage["type"],
        text: msg.type === "TEXT" ? msg.content : undefined,
        mediaUrl: msg.type !== "TEXT" ? msg.content : undefined,
    });

    /* ---------------------------------------
       CARGA INICIAL + WS
    --------------------------------------- */
    useEffect(() => {
        if (!chatId) return;
        messagesApi.getMessages(chatId).then((data) => {
            setMessages(data.map(mapMessage));
        });
    }, [chatId]);

    useChatSocket(chatId, (msg) => {
        setMessages((prev) => [...prev, mapMessage(msg)]);
    });

    /* ---------------------------------------
       ENVÍO TEXTO
    --------------------------------------- */
    const handleSendText = async () => {
        if (!inputValue.trim() || !chatId) return;
        await messagesApi.sendMessage(chatId, "TEXT", inputValue);
        setInputValue("");
    };

    /* ---------------------------------------
       ENVÍO ARCHIVOS
    --------------------------------------- */
    const handleFileUpload = async (
        file: File,
        type: "image" | "video" | "audio"
    ) => {
        if (!chatId) return;
        const url = await uploadMedia(file, type);
        await messagesApi.sendMessage(
            chatId,
            type.toUpperCase() as "IMAGE" | "VIDEO" | "AUDIO",
            url
        );
        setShowMediaOptions(false);
    };

    /* ---------------------------------------
       AUDIO GRABADO
    --------------------------------------- */
    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        audioChunksRef.current = [];
        recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        recorder.start();

        mediaRecorderRef.current = recorder;
        setIsRecording(true);
        setRecordingTime(0);

        recordingIntervalRef.current = setInterval(() => {
            setRecordingTime((t) => t + 1);
        }, 1000);
    };

    const stopRecording = () => {
        recordingIntervalRef.current &&
        clearInterval(recordingIntervalRef.current);

        setIsRecording(false);

        mediaRecorderRef.current?.stop();
        mediaRecorderRef.current!.onstop = async () => {
            const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
            const file = new File([blob], "audio.webm", { type: "audio/webm" });
            await handleFileUpload(file, "audio");
        };
    };

    const cancelRecording = () => {
        recordingIntervalRef.current &&
        clearInterval(recordingIntervalRef.current);
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
        setRecordingTime(0);
    };

    /* ---------------------------------------
       RENDER
    --------------------------------------- */
    return (
        <div className="pt-16 lg:pt-20 min-h-screen bg-background flex flex-col">
            {/* HEADER */}
            <div className="bg-card border-b px-4 lg:px-8 py-4">
                <div className="container mx-auto max-w-4xl flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/messages")}>
                        <ArrowLeft className="w-6 h-6" />
                    </Button>

                    <Avatar className="w-12 h-12">
                        <AvatarImage src={chatProfile?.images?.[0]} />
                        <AvatarFallback>
                            {chatProfile?.name?.[0] ?? "?"}
                        </AvatarFallback>
                    </Avatar>

                    <h2 className="text-xl font-bold">
                        {chatProfile?.name ?? "Cargando..."}
                    </h2>
                </div>
            </div>

            {/* MENSAJES */}
            <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
                <div className="container mx-auto max-w-4xl space-y-4">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex ${m.sender === "me" ? "justify-end" : "justify-start"}`}
                        >
                            <Card className="max-w-[75%] p-3">
                                {m.type === "text" && <p>{m.text}</p>}
                                {m.type === "image" && <img src={m.mediaUrl} className="rounded-lg" />}
                                {m.type === "video" && (
                                    <video src={m.mediaUrl} controls className="rounded-lg" />
                                )}
                                {m.type === "audio" && (
                                    <div className="flex items-center gap-2">
                                        <Play className="w-4 h-4" />
                                        <audio src={m.mediaUrl} controls />
                                    </div>
                                )}
                                <p className="text-xs text-muted-foreground mt-1">
                                    {m.timestamp}
                                </p>
                            </Card>
                        </div>
                    ))}
                </div>
            </div>

            {/* INPUT */}
            <div className="bg-card border-t px-4 lg:px-8 py-4">
                <div className="container mx-auto max-w-4xl">
                    {isRecording ? (
                        <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
                            <span>Grabando… {formatTime(recordingTime)}</span>
                            <Button variant="ghost" size="icon" onClick={cancelRecording}>
                                <X />
                            </Button>
                            <Button size="icon" onClick={stopRecording}>
                                <Send />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            {/* MEDIA MENU */}
                            <div className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setShowMediaOptions(!showMediaOptions)}
                                >
                                    <Image />
                                </Button>

                                {showMediaOptions && (
                                    <div className="absolute bottom-full mb-2 bg-card border rounded-lg p-2 space-y-2">
                                        <Button onClick={() => imageInputRef.current?.click()} variant="ghost">
                                            <Image className="mr-2" /> Foto
                                        </Button>
                                        <Button onClick={() => videoInputRef.current?.click()} variant="ghost">
                                            <Video className="mr-2" /> Vídeo
                                        </Button>
                                        <Button onClick={() => audioFileInputRef.current?.click()} variant="ghost">
                                            <Music className="mr-2" /> Audio
                                        </Button>
                                    </div>
                                )}

                                <input
                                    ref={imageInputRef}
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={(e) =>
                                        e.target.files && handleFileUpload(e.target.files[0], "image")
                                    }
                                />
                                <input
                                    ref={videoInputRef}
                                    type="file"
                                    accept="video/*"
                                    hidden
                                    onChange={(e) =>
                                        e.target.files && handleFileUpload(e.target.files[0], "video")
                                    }
                                />
                                <input
                                    ref={audioFileInputRef}
                                    type="file"
                                    accept="audio/*"
                                    hidden
                                    onChange={(e) =>
                                        e.target.files && handleFileUpload(e.target.files[0], "audio")
                                    }
                                />
                            </div>

                            {/* TEXTO */}
                            <input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Escribe un mensaje…"
                                className="flex-1 border rounded-lg px-4 py-3"
                            />

                            {inputValue.trim() ? (
                                <Button size="icon" onClick={handleSendText}>
                                    <Send />
                                </Button>
                            ) : (
                                <Button variant="ghost" size="icon" onClick={startRecording}>
                                    <Mic />
                                </Button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
