import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { conversationsApi } from "@/api/conversationsApi";
import { ConversationResponse } from "@/models/ConversationResponse";
import { matchesApi } from "@/api/matchesApi";
import { useAuthStore } from "@/store/authStore";
import { Button } from "@/components/ui/button";

export function Messages() {
    const navigate = useNavigate();
    const userId = useAuthStore((s) => s.userId);

    const [conversations, setConversations] =
        useState<ConversationResponse[]>([]);

    useEffect(() => {
        conversationsApi.getMyConversations().then(setConversations);
    }, []);

    return (
        <div className="pt-16 lg:pt-20 min-h-screen bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-4xl">
                <h1 className="text-foreground text-3xl lg:text-4xl font-bold font-sans mb-8 lg:mb-12">
                    Messages
                </h1>

                <div className="space-y-4">
                    {conversations.map((chat) => (
                        <Card
                            key={chat.conversationId}
                            className="flex items-center justify-between p-4 cursor-pointer"
                            onClick={() =>
                                navigate(`/messages/${chat.conversationId}`, {
                                    state: {
                                        otherUserId: chat.otherUserId,
                                        otherUserName: chat.otherUserName,
                                        otherUserImage: chat.otherUserImage,
                                    },
                                })
                            }
                        >
                            {/* INFO DEL CHAT */}
                            <div className="flex items-center gap-4">
                                <Avatar>
                                    <AvatarImage src={chat.otherUserImage ?? ""} />
                                    <AvatarFallback>
                                        {chat.otherUserName[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <div>
                                    <h3 className="font-semibold">
                                        {chat.otherUserName}
                                    </h3>
                                    <p className="text-sm text-muted-foreground">
                                        {chat.lastMessage ?? "Di hola 👋"}
                                    </p>
                                </div>
                            </div>

                            {/* BOTÓN ROMPER MATCH */}
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={async (e) => {
                                    e.stopPropagation();

                                    if (!userId) return;

                                    await matchesApi.breakMatch(
                                        userId,
                                        chat.otherUserId
                                    );

                                    setConversations((prev) =>
                                        prev.filter(
                                            (c) =>
                                                c.conversationId !==
                                                chat.conversationId
                                        )
                                    );
                                }}
                            >
                                Romper match
                            </Button>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}