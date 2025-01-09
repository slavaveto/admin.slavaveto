'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/assets/auth/utils/supabase/client'; // Импорт клиента
import { Listbox, ListboxItem, Skeleton } from '@nextui-org/react'; // Добавлен Skeleton

interface Page {
    page_key: string;
    order?: number;
    btn_type?: string; // Указываем, что btn_type может быть undefined
}

export default function PagesData() {
    const [pages, setPages] = useState<Page[]>([]); // Указываем, что состояние состоит из массива объектов Page
    const [selectedPage, setSelectedPage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true); // Состояние загрузки

    // Загрузка данных из таблицы `_pages` с задержкой для скелетона
    useEffect(() => {
        const fetchPages = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from('_pages')
                .select('page_key, order, btn_type'); // Загружаем поле btn_type

            if (error) {
                console.error('Failed to fetch pages:', error.message);
                return;
            }

            // Добавляем `home` наверх, `misc` внизу, сортируем остальные по `order`
            const allPages: Page[] = [
                { page_key: 'home', order: -1 }, // `home` всегда первый
                ...(data || [])
                    .map((page) => ({ ...page, order: page.order ?? Infinity })) // Устанавливаем `Infinity` для пустых `order`
                    .sort((a, b) => a.order! - b.order!), // Сортируем по `order`
                { page_key: 'misc', order: Infinity + 1 }, // `misc` всегда последний
            ];

            setPages(allPages);

            // Восстанавливаем активную вкладку из localStorage
            const savedPage = localStorage.getItem('selectedPage');
            if (savedPage && allPages.find((page) => page.page_key === savedPage)) {
                setSelectedPage(savedPage); // Восстанавливаем активную вкладку
            } else {
                setSelectedPage('home'); // Если ничего не сохранено, выбираем `home`
            }

            // Устанавливаем минимальную задержку для скелетона
            setTimeout(() => setIsLoading(false), 1000);
        };

        fetchPages();
    }, []);

    // Обработчик для сохранения выбранной страницы в `localStorage`
    const handlePageSelection = (page: string) => {
        setSelectedPage(page);
        localStorage.setItem('selectedPage', page); // Сохраняем в localStorage
    };

    return (
        <div className="flex w-full">
            {/* Секция с Listbox */}
            <div className="w-1/4">
                {isLoading ? (
                    <SkeletonList />
                ) : (
                    <Listbox
                        variant="faded"
                        onAction={(key) => handlePageSelection(key as string)} // Вызываем handlePageSelection
                        className="w-full p-0"
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

            {/* Содержимое выбранной страницы */}
            <div className="flex-grow ml-5 -bg-blue-50 -p-2">
                {isLoading ? (
                    <Skeleton className="w-full -bg-blue-50 h-[200px] rounded" /> // Скелетон вместо содержимого
                ) : (
                    <PageContent pageKey={selectedPage!} />
                )}
            </div>
        </div>
    );
}




function PageContent({ pageKey }: { pageKey: string }) {
    return (
        <div className="p-0">
            <p>Содержимое страницы: {pageKey}</p>
        </div>
    );
}


function PageDetails({ pageKey }: { pageKey: string }) {
    const [content, setContent] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchContent = async () => {
            const supabase = createClient();
            const { data, error } = await supabase
                .from(pageKey)
                .select('*');

            if (error) {
                console.error(`Failed to fetch content for ${pageKey}:`, error.message);
                setContent(''); // Пустая информация, если таблица отсутствует
            } else {
                setContent(JSON.stringify(data, null, 2)); // Преобразуем данные для отображения
            }

            setIsLoading(false);
        };

        fetchContent();
    }, [pageKey]);

    if (isLoading) {
        return <Skeleton className="w-full h-40 rounded" />;
    }

    return (
        <div className="p-0">
            {content ? <pre>{content}</pre> : <p>Нет данных для отображения</p>}
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


