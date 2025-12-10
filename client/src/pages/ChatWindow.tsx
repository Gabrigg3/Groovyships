import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Send } from 'lucide-react';

const mockMessages = [
    { id: 1, text: 'Hey! How are you doing?', sender: 'other', timestamp: '10:30 AM' },
    { id: 2, text: 'Hi! I\'m doing great, thanks! How about you?', sender: 'me', timestamp: '10:32 AM' },
    { id: 3, text: 'Pretty good! I saw you like hiking. Have any favorite trails?', sender: 'other', timestamp: '10:35 AM' },
    { id: 4, text: 'Yes! I love the mountain trails near the city. The views are amazing!', sender: 'me', timestamp: '10:37 AM' },
];

const chatProfiles: Record<string, { name: string; image: string; imageAlt: string; lookingFor: string[] }> = {
    '1': { name: 'Sarah', image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_1.png', imageAlt: 'portrait user', lookingFor: ['romance', 'friendship'] },
    '2': { name: 'Emma', image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_2.png', imageAlt: 'hand smartphone', lookingFor: ['friendship'] },
    '3': { name: 'Alex', image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_3.png', imageAlt: 'abstract connection', lookingFor: ['romance'] },
    '4': { name: 'Jordan', image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_4.png', imageAlt: 'friends outdoor', lookingFor: ['friendship'] },
};

export function ChatWindow() {
    const { chatId } = useParams();
    const navigate = useNavigate();
    const [messages, setMessages] = useState(mockMessages);
    const [inputValue, setInputValue] = useState('');

    const profile = chatProfiles[chatId || '1'];

    const getAvatarBorderClass = () => {
        if (profile.lookingFor.includes('romance') && profile.lookingFor.includes('friendship')) {
            return 'ring-4 ring-gradient-both';
        } else if (profile.lookingFor.includes('romance')) {
            return 'ring-4 ring-primary';
        } else if (profile.lookingFor.includes('friendship')) {
            return 'ring-4 ring-friendship';
        }
        return '';
    };

    const handleSend = () => {
        if (inputValue.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: inputValue,
                sender: 'me',
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };
            setMessages([...messages, newMessage]);
            setInputValue('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="pt-16 lg:pt-20 min-h-screen bg-background flex flex-col">
            {/* Chat Header */}
            <div className="bg-card text-card-foreground border-b border-border px-4 lg:px-8 py-4">
                <div className="container mx-auto max-w-4xl flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => navigate('/messages')}
                        className="bg-transparent text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                        <ArrowLeft className="w-6 h-6" strokeWidth={1.5} />
                    </Button>

                    <Avatar className={`w-12 h-12 ${getAvatarBorderClass()}`}>
                        <AvatarImage src={profile.image} alt={profile.imageAlt} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                            {profile.name[0]}
                        </AvatarFallback>
                    </Avatar>

                    <h2 className="text-foreground text-xl font-bold font-sans">{profile.name}</h2>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
                <div className="container mx-auto max-w-4xl space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] ${message.sender === 'me' ? 'order-2' : 'order-1'}`}>
                                <Card
                                    className={`p-4 ${
                                        message.sender === 'me'
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-card text-card-foreground border-border'
                                    }`}
                                >
                                    <p className="text-base font-body leading-relaxed">{message.text}</p>
                                </Card>
                                <p
                                    className={`text-xs text-muted-foreground font-body mt-1 ${
                                        message.sender === 'me' ? 'text-right' : 'text-left'
                                    }`}
                                >
                                    {message.timestamp}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Input Area */}
            <div className="bg-card text-card-foreground border-t border-border px-4 lg:px-8 py-4">
                <div className="container mx-auto max-w-4xl flex items-center gap-3">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="flex-1 bg-background text-foreground border border-input rounded-lg px-4 py-3 text-base font-body focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!inputValue.trim()}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                        size="icon"
                    >
                        <Send className="w-5 h-5" strokeWidth={1.5} />
                    </Button>
                </div>
            </div>
        </div>
    );
}
