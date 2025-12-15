import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import {useEffect, useState} from "react";
import {conversationsApi} from "@/api/conversationsApi";
import { ConversationResponse } from "@/models/ConversationResponse";



export function Messages() {
    const navigate = useNavigate();
    const [conversations, setConversations] =
        useState<ConversationResponse[]>([]);

    useEffect(() => {
        conversationsApi.getMyConversations().then(setConversations);
    }, []);

    const getAvatarBorderClass = (lookingFor: string[]) => {
        if (lookingFor.includes('romance') && lookingFor.includes('friendship')) {
            return 'ring-4 ring-gradient-both';
        } else if (lookingFor.includes('romance')) {
            return 'ring-4 ring-primary';
        } else if (lookingFor.includes('friendship')) {
            return 'ring-4 ring-friendship';
        }
        return '';
    };

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
                            <Avatar>
                                <AvatarImage src={chat.otherUserImage ?? ""} />
                                <AvatarFallback>{chat.otherUserName[0]}</AvatarFallback>
                            </Avatar>

                            <h3>{chat.otherUserName}</h3>
                            <p>{chat.lastMessage ?? "Di hola 👋"}</p>
                        </Card>
                    ))}

                </div>
            </div>
        </div>
    );
}
