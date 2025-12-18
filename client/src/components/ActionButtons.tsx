import { Button } from '@/components/ui/button';
import { Heart, X, Star } from 'lucide-react';
import { Info } from "lucide-react";


interface ActionButtonsProps {
    onLike: () => void;
    onDislike: () => void;
    onSuperLike: () => void;
}

export function ActionButtons({ onLike, onDislike, onSuperLike }: ActionButtonsProps) {
    return (
        <div className="flex items-center justify-center gap-4 lg:gap-6">
            <Button
                size="icon"
                onClick={onDislike}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-background text-destructive border-2 border-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
            >
                <X className="w-8 h-8 lg:w-10 lg:h-10" strokeWidth={2} />
            </Button>

            <Button
                size="icon"
                onClick={onSuperLike}
                className="w-14 h-14 lg:w-16 lg:h-16 rounded-full bg-tertiary text-tertiary-foreground hover:bg-tertiary/90 transition-all duration-200"
            >
                <Info className="w-7 h-7 lg:w-8 lg:h-8" strokeWidth={2} fill="currentColor" />
            </Button>

            <Button
                size="icon"
                onClick={onLike}
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200"
            >
                <Heart className="w-8 h-8 lg:w-10 lg:h-10" strokeWidth={2} fill="currentColor" />
            </Button>
        </div>
    );
}
