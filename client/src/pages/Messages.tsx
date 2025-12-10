import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

const mockChats = [
    {
        id: 1,
        name: 'Sarah',
        image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_1.png',
        imageAlt: 'portrait user',
        lastMessage: 'Hey! How are you doing?',
        timestamp: '2m ago',
        unread: true,
        lookingFor: ['romance', 'friendship'],
    },
    {
        id: 2,
        name: 'Emma',
        image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_2.png',
        imageAlt: 'hand smartphone',
        lastMessage: 'That sounds great! Let\'s do it',
        timestamp: '1h ago',
        unread: false,
        lookingFor: ['friendship'],
    },
    {
        id: 3,
        name: 'Alex',
        image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_3.png',
        imageAlt: 'abstract connection',
        lastMessage: 'See you tomorrow!',
        timestamp: '3h ago',
        unread: false,
        lookingFor: ['romance'],
    },
    {
        id: 4,
        name: 'Jordan',
        image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_4.png',
        imageAlt: 'friends outdoor',
        lastMessage: 'Thanks for the recommendation',
        timestamp: '1d ago',
        unread: false,
        lookingFor: ['friendship'],
    },
];

export function Messages() {
    const navigate = useNavigate();

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
                    {mockChats.map((chat) => (
                        <Card
                            key={chat.id}
                            onClick={() => navigate(`/messages/${chat.id}`)}
                            className="bg-card text-card-foreground border-border p-4 lg:p-6 cursor-pointer hover:border-primary transition-colors duration-200"
                        >
                            <div className="flex items-center gap-4">
                                <Avatar className={`w-16 h-16 lg:w-20 lg:h-20 ${getAvatarBorderClass(chat.lookingFor)}`}>
                                    <AvatarImage src={chat.image} alt={chat.imageAlt} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                                        {chat.name[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-foreground text-lg lg:text-xl font-bold font-sans">
                                            {chat.name}
                                        </h3>
                                        <span className="text-muted-foreground text-sm font-body">
                      {chat.timestamp}
                    </span>
                                    </div>
                                    <p
                                        className={`text-base font-body truncate ${
                                            chat.unread ? 'text-foreground font-semibold' : 'text-muted-foreground'
                                        }`}
                                    >
                                        {chat.lastMessage}
                                    </p>
                                </div>

                                {chat.unread && (
                                    <div className="w-3 h-3 rounded-full bg-primary flex-shrink-0" />
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
