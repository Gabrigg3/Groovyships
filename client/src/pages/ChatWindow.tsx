import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import {
    ArrowLeft,
    Send,
    Mic,
    Image,
    Video,
    X,
    Play,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";
import { messagesApi } from "@/api/messagesApi";
import { MessageResponse } from "@/models/MessageResponse";
import { useChatSocket } from "@/hooks/useChatSocket";

/* ---------------------------------------
   TIPOS FRONTEND DEL MENSAJE
--------------------------------------- */
type UIMessage = {
    id: string;
    sender: "me" | "other";
    timestamp: string;
    type: "text" | "image" | "video" | "audio";
    text?: string;
    mediaUrl?: string;
    duration?: number;
};

export function ChatWindow() {
    const { chatId: conversationId } = useParams();
    const navigate = useNavigate();
    const { userId } = useAuthStore();

    const [messages, setMessages] = useState<UIMessage[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [showMediaOptions, setShowMediaOptions] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

    /* ---------------------------------------
       PERFIL (luego vendrá del backend)
    --------------------------------------- */
    const profile = {
        name: "Chat",
        image: "",
        imageAlt: "",
        lookingFor: ["romance"],
    };

    /* ---------------------------------------
       MAPEO BACK → FRONT
    --------------------------------------- */
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
       CARGA INICIAL DE MENSAJES
    --------------------------------------- */
    useEffect(() => {
        if (!conversationId) return;

        messagesApi.getMessages(conversationId).then((data) => {
            setMessages(data.map(mapMessage));
        });
    }, [conversationId]);

    /* ---------------------------------------
       WEBSOCKET TIEMPO REAL
    --------------------------------------- */
    useChatSocket(conversationId, (msg) => {
        setMessages((prev) => [...prev, mapMessage(msg)]);
    });

    /* ---------------------------------------
       HELPERS UI
    --------------------------------------- */
    const getAvatarBorderClass = () => {
        if (
            profile.lookingFor.includes("romance") &&
            profile.lookingFor.includes("friendship")
        ) {
            return "ring-4 ring-gradient-both";
        } else if (profile.lookingFor.includes("romance")) {
            return "ring-4 ring-primary";
        } else if (profile.lookingFor.includes("friendship")) {
            return "ring-4 ring-friendship";
        }
        return "";
    };

    /* ---------------------------------------
       ENVÍO DE MENSAJE TEXTO
    --------------------------------------- */
    const handleSend = async () => {
        if (!inputValue.trim() || !conversationId) return;

        await messagesApi.sendMessage(conversationId, "TEXT", inputValue);
        setInputValue("");
    };

    /* ---------------------------------------
       AUDIO (solo UI por ahora)
    --------------------------------------- */
    const startRecording = () => {
        setIsRecording(true);
        setRecordingTime(0);
        recordingIntervalRef.current = setInterval(() => {
            setRecordingTime((prev) => prev + 1);
        }, 1000);
    };

    const stopRecording = () => {
        setIsRecording(false);
        recordingIntervalRef.current &&
        clearInterval(recordingIntervalRef.current);
        setRecordingTime(0);
    };

    const cancelRecording = () => {
        setIsRecording(false);
        recordingIntervalRef.current &&
        clearInterval(recordingIntervalRef.current);
        setRecordingTime(0);
    };

    /* ---------------------------------------
       MEDIA (placeholder)
    --------------------------------------- */
    const handleImageUpload = () => setShowMediaOptions(false);
    const handleVideoUpload = () => setShowMediaOptions(false);

    const formatTime = (seconds: number) =>
        `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    /* ---------------------------------------
       RENDER
    --------------------------------------- */
    return (
        <div className="pt-16 lg:pt-20 min-h-screen bg-background flex flex-col">
            {/* HEADER */}
            <div className="bg-card border-b px-4 lg:px-8 py-4">
                <div className="container mx-auto max-w-4xl flex items-center gap-4">
                    <Button type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate("/messages")}
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </Button>

                    <Avatar className={`w-12 h-12 ${getAvatarBorderClass()}`}>
                        <AvatarImage src={profile.image} />
                        <AvatarFallback>{profile.name[0]}</AvatarFallback>
                    </Avatar>

                    <h2 className="text-xl font-bold">{profile.name}</h2>
                </div>
            </div>

            {/* MENSAJES */}
            <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
                <div className="container mx-auto max-w-4xl space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.sender === "me"
                                    ? "justify-end"
                                    : "justify-start"
                            }`}
                        >
                            <div className="max-w-[75%]">
                                <Card
                                    className={`${
                                        message.sender === "me"
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-card"
                                    } ${
                                        message.type === "text"
                                            ? "p-4"
                                            : "p-2"
                                    }`}
                                >
                                    {message.type === "text" && (
                                        <p>{message.text}</p>
                                    )}

                                    {message.type === "audio" && (
                                        <div className="flex items-center gap-3">
                                            <Play className="w-4 h-4" />
                                            <span>
                                                {formatTime(
                                                    message.duration || 0
                                                )}
                                            </span>
                                        </div>
                                    )}

                                    {message.type === "image" && (
                                        <img
                                            src={message.mediaUrl}
                                            className="rounded-lg"
                                        />
                                    )}

                                    {message.type === "video" && (
                                        <video
                                            src={message.mediaUrl}
                                            controls
                                        />
                                    )}
                                </Card>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {message.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* INPUT */}
            <div className="bg-card border-t px-4 lg:px-8 py-4">
                <div className="container mx-auto max-w-4xl">
                    {isRecording ? (
                        <div className="flex items-center gap-3 p-4 bg-destructive/10 rounded-lg">
                            <span>
                                Grabando... {formatTime(recordingTime)}
                            </span>
                            <Button type="button"
                                variant="ghost"
                                size="icon"
                                onKeyDown={cancelRecording}
                            >
                                <X />
                            </Button>
                            <Button type="button" size="icon" onKeyDown={stopRecording}>
                                <Send />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setShowMediaOptions(!showMediaOptions)
                                }
                            >
                                <Image />
                            </Button>

                            <input
                                value={inputValue}
                                onChange={(e) =>
                                    setInputValue(e.target.value)
                                }
                                onKeyDown={handleKeyPress}
                                placeholder="Escribe un mensaje..."
                                className="flex-1 border rounded-lg px-4 py-3"
                            />

                            {inputValue.trim() ? (
                                <Button type="button" size="icon" onClick={handleSend}>
                                    <Send />
                                </Button>
                            ) : (
                                <Button type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={startRecording}
                                >
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
