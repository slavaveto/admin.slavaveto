'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/assets/auth/utils/supabase/client';
import { Listbox, ListboxItem, Skeleton } from '@nextui-org/react';

import { Edit, RefreshCcw } from 'lucide-react';
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from '@nextui-org/react';

interface Page {
    page_key: string;
    order?: number;
    btn_type?: string;
}

export default function PagesData() {
    const [pages, setPages] = useState<Page[]>([]);
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [isPagesLoading, setIsPagesLoading] = useState(true);
    const [isPageContentLoading, setIsPageContentLoading] = useState(true);

    useEffect(() => {
        const fetchPages = async () => {
            const startTime = Date.now();
            const supabase = createClient();
            const { data, error } = await supabase
                .from('_pages')
                .select('page_key, order, btn_type');

            if (error) {
                //console.error('Failed to fetch pages:', error.message);
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

    useEffect(() => {
        if (!selectedPage || isPagesLoading) return;

        setIsPageContentLoading(true);
        const fetchPageContent = async () => {
            const startTime = Date.now();
            const supabase = createClient();
            const { error } = await supabase
                .from(selectedPage)
                .select('*');

            if (error) {
                //console.error(`Failed to fetch content for ${selectedPage}:`, error.message);
            }

            const elapsedTime = Date.now() - startTime;
            const delay = Math.max(0 - elapsedTime, 0);
            setTimeout(() => setIsPageContentLoading(false), delay);
        };

        fetchPageContent();
    }, [selectedPage, isPagesLoading]);

    const handlePageSelection = (page: string) => {
        setSelectedPage(page);
        localStorage.setItem('selectedPage', page);
    };

    return (
        <div className="flex w-full">
            <div className="min-w-[200px]">
                {isPagesLoading ? (
                    <SkeletonList />
                ) : (
                    <Listbox
                        variant="faded"
                        onAction={(key) => handlePageSelection(key as string)}
                        className="p-0"
                        aria-label="Выбор страницы"
                    >
                        {pages.map((page) => (
                            <ListboxItem
                                key={page.page_key}
                                textValue={page.page_key}
                                className={`
                                    ${selectedPage === page.page_key ? 'bg-default-100' : ''} 
                                `}
                            >
                                <span className={page.btn_type === 'image' ? 'font-semibold' : ''}>
                                    {page.page_key}
                                </span>
                            </ListboxItem>
                        ))}
                    </Listbox>
                )}
            </div>

            <div className="flex-grow ml-5 -bg-blue-50 -p-2">
                {isPageContentLoading ? (
                    <SkeletonPageContent />
                ) : (
                    <PageContent
                        pageKey={selectedPage!}
                        onLoadComplete={() => setIsPageContentLoading(false)} // Отключение скелетона
                    />
                )}
            </div>
        </div>
    );
}

function SkeletonList() {
    return (
        <div className="w-full flex flex-col gap-1">
            <Skeleton className="h-[30px] w-12/12 rounded" />
            <Skeleton className="h-[30px] w-10/12 rounded" />
            <Skeleton className="h-[30px] w-11/12 rounded" />
        </div>
    );
}

function SkeletonPageContent() {
    return (
        <Skeleton className="w-full h-[200px]  rounded -bg-blue-50" />
    );
}

function PageContent({ pageKey, onLoadComplete }: { pageKey: string; onLoadComplete: () => void }) {
    const [content, setContent] = useState<{ ru: string; uk: string; item_id: string }[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            const startTime = Date.now(); // Засекаем время начала
            const supabase = createClient();
            const { data, error } = await supabase.from(pageKey).select('item_id, ru, uk');

            if (error) {
                //console.error(`Failed to fetch content for ${pageKey}:`, error.message);
                setContent([]);
            } else {
                setContent(data || []);
            }

            const elapsedTime = Date.now() - startTime; // Время, затраченное на загрузку данных
            const delay = Math.max(500 - elapsedTime, 0); // Минимальная задержка 500 мс
            setTimeout(() => {
                setIsLoading(false);
                onLoadComplete(); // Уведомляем, что загрузка завершена
            }, delay);
        };

        fetchContent();
    }, [pageKey, onLoadComplete]);

    if (isLoading) {
        return                     <SkeletonPageContent />

    }

    if (!content || content.length === 0) {
        return <p>Нет данных для отображения</p>;
    }

    return (
        <Table
            aria-label="Example table with editing functionality"
            className="table-auto w-full"
            isStriped
        >
            <TableHeader>
                {/* Колонка item_id */}
                <TableColumn className="w-1/6 border-r border-gray-300 text-center">
                    ID
                </TableColumn>

                {/* Колонка RU */}
                <TableColumn className="w-1/3 border-r border-gray-300 text-center">
                    RU
                </TableColumn>

                {/* Колонка sync */}
                <TableColumn className="w-1/12 border-r border-gray-300 text-center">
                    sync
                </TableColumn>

                {/* Колонка UK */}
                <TableColumn className="w-1/3 text-center">
                    UK
                </TableColumn>
            </TableHeader>
            <TableBody>
                {content.map((row, index) => (
                    <TableRow key={index}>
                        {/* Колонка item_id */}
                        <TableCell className="w-1/6 border-r border-gray-300 text-center">
                            {row.item_id}
                        </TableCell>

                        {/* Левая колонка (RU) */}
                        <TableCell className="w-1/3 border-r border-gray-300">
                            <div className="flex items-center justify-between">
                                {row.ru}
                                <button className="text-blue-500 hover:text-blue-700 ml-2">
                                    <Edit className="inline h-4 w-4" />
                                </button>
                            </div>
                        </TableCell>

                        {/* Средняя колонка (Иконка синхронизации) */}
                        <TableCell className="w-1/12 border-r border-gray-300 text-center">
                            <button className="text-gray-500 hover:text-gray-700">
                                <RefreshCcw className="inline h-4 w-4" />
                            </button>
                        </TableCell>

                        {/* Правая колонка (UK) */}
                        <TableCell className="w-1/3">
                            <div className="flex items-center justify-between">
                                {row.uk}
                                <button className="text-blue-500 hover:text-blue-700 ml-2">
                                    <Edit className="inline h-4 w-4" />
                                </button>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}