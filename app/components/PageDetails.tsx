'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/assets/auth/utils/supabase/client';
import { Skeleton } from '@nextui-org/react';

interface PageDetailsProps {
    pageKey: string | null;
}

export default function PageDetails({ pageKey }: PageDetailsProps) {
    const [content, setContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!pageKey) return;

        const fetchContent = async () => {
            const startTime = Date.now();
            setIsLoading(true);
            const supabase = createClient();
            const { data, error } = await supabase.from(pageKey).select('*');

            if (error) {
                console.error(`Failed to fetch content for ${pageKey}:`, error.message);
                setContent('');
            } else {
                setContent(JSON.stringify(data, null, 2));
            }

            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(500 - elapsedTime, 0);
            setTimeout(() => setIsLoading(false), delay);
        };

        fetchContent();
    }, [pageKey]);

    if (!pageKey) {
        return <p>Нет выбранной страницы</p>;
    }

    return isLoading ? (
        <Skeleton className="w-full h-[200px] rounded" />
    ) : (
        <div className="p-0">
            {content ? <pre>{content}</pre> : <p>Нет данных для отображения</p>}
        </div>
    );
}