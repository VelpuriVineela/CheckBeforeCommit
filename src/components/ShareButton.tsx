'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Check, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ShareButton() {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: 'CheckBeforeCommit - Codebase Analysis',
            text: 'Check out this codebase analysis report on CheckBeforeCommit.',
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };

    return (
        <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className={cn(
                "text-muted-foreground gap-2 h-9 text-xs transition-all",
                copied && "text-green-600 bg-green-50"
            )}
        >
            {copied ? (
                <>
                    <Check className="w-3.5 h-3.5" />
                    Copied!
                </>
            ) : (
                <>
                    <Share2 className="w-3.5 h-3.5" />
                    Share report
                </>
            )}
        </Button>
    );
}
