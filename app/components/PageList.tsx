import { useState, useEffect } from 'react';
import { createClient } from '@/app/assets/auth/utils/supabase/client';

interface Page {
    page_key: string;
    order?: number;
    btn_type?: string;
}

export function pageList() {
    const [pages, setPages] = useState<Page[]>([]);
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [isPagesLoading, setIsPagesLoading] = useState(true);

    useEffect(() => {
        const fetchPages = async () => {
            const startTime = Date.now();
            const supabase = createClient();
            const { data, error } = await supabase
                .from('_pages')
                .select('page_key, order, btn_type');

            if (error) {
                console.error('Failed to fetch pages:', error.message);
                return;
            }

            const allPages: Page[] = [
                { page_key: 'home', order: -1 },
                ...(data || [])
                    .map((page) => ({ ...page, order: page.order ?? Infinity }))
                    .sort((a, b) => a.order! - b.order!),
                { page_key: 'misc', order: Infinity + 1 },
            ];

            setPages(allPages);

            const savedPage = localStorage.getItem('selectedPage');
            if (savedPage && allPages.find((page) => page.page_key === savedPage)) {
                setSelectedPage(savedPage);
            } else {
                setSelectedPage('home');
            }

            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(1000 - elapsedTime, 0);
            setTimeout(() => setIsPagesLoading(false), delay);
        };

        fetchPages();
    }, []);

    const handlePageSelection = (page: string) => {
        setSelectedPage(page);
        localStorage.setItem('selectedPage', page);
    };


    return { pages, selectedPage, isPagesLoading, handlePageSelection };
}