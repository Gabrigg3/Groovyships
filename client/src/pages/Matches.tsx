import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const mockMatches = [
    {
        id: 1,
        name: 'Sarah',
        age: 28,
        image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_1.png',
        imageAlt: 'portrait user',
        matchedAt: '2 hours ago',
        lookingFor: ['romance', 'friendship'],
    },
    {
        id: 2,
        name: 'Emma',
        age: 26,
        image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_2.png',
        imageAlt: 'hand smartphone',
        matchedAt: '1 day ago',
        lookingFor: ['friendship'],
    },
    {
        id: 3,
        name: 'Alex',
        age: 30,
        image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_3.png',
        imageAlt: 'abstract connection',
        matchedAt: '3 days ago',
        lookingFor: ['romance'],
    },
    {
        id: 4,
        name: 'Jordan',
        age: 27,
        image: 'https://c.animaapp.com/miuehdn2n7lalI/img/ai_4.png',
        imageAlt: 'friends outdoor',
        matchedAt: '1 week ago',
        lookingFor: ['friendship'],
    },
];

export function Matches() {
    const navigate = useNavigate();

    const getBorderClass = (lookingFor: string[]) => {
        if (lookingFor.includes('romance') && lookingFor.includes('friendship')) {
            return 'ring-4 ring-offset-2 ring-gradient-both';
        } else if (lookingFor.includes('romance')) {
            return 'ring-4 ring-offset-2 ring-primary';
        } else if (lookingFor.includes('friendship')) {
            return 'ring-4 ring-offset-2 ring-friendship';
        }
        return '';
    };

    return (
        <div className="pt-16 lg:pt-20 min-h-screen bg-background">
            <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12 max-w-6xl">
                <h1 className="text-foreground text-3xl lg:text-4xl font-bold font-sans mb-8 lg:mb-12">
                    Your Matches
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {mockMatches.map((match) => (
                        <Card
                            key={match.id}
                            className={`bg-card text-card-foreground border-0 overflow-hidden hover:scale-105 transition-all duration-200 p-6 ${getBorderClass(match.lookingFor)}`}
                        >
                            <div className="flex flex-col items-center text-center">
                                <div className="flex flex-wrap justify-center gap-2 mb-3">
                                    {match.lookingFor.map((type) => {
                                        const badges = {
                                            romance: { emoji: '💕', label: 'Romance' },
                                            friendship: { emoji: '🤝', label: 'Amistad' },
                                        };
                                        const badge = badges[type as keyof typeof badges];
                                        return (
                                            <span
                                                key={type}
                                                className="bg-white/20 text-foreground px-2 py-1 rounded-full text-xs font-semibold font-body"
                                            >
                        {badge.emoji} {badge.label}
                      </span>
                                        );
                                    })}
                                </div>
                                <Avatar className="w-32 h-32 lg:w-40 lg:h-40 mb-4">
                                    <AvatarImage src={match.image} alt={match.imageAlt} />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                                        {match.name[0]}
                                    </AvatarFallback>
                                </Avatar>

                                <h3 className="text-foreground text-xl lg:text-2xl font-bold font-sans mb-1">
                                    {match.name}, {match.age}
                                </h3>

                                <p className="text-muted-foreground text-sm font-body mb-6">
                                    Matched {match.matchedAt}
                                </p>

                                <Button
                                    onClick={() => navigate(`/messages/${match.id}`)}
                                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                >
                                    <MessageCircle className="mr-2 w-5 h-5" strokeWidth={1.5} />
                                    Send Message
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
