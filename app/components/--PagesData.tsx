'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/app/assets/auth/utils/supabase/client';
import { Listbox, ListboxItem, Skeleton } from '@nextui-org/react';
import { Button, Modal, ModalBody,ModalContent, ModalHeader, ModalFooter, useDisclosure,  } from '@nextui-org/react';

import {Link} from "@nextui-org/link";
import EditModal from './EditModal';

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

interface PageContentProps {
    pageKey: string;
    onLoadComplete: () => void;
}

 function PageContent({ pageKey, onLoadComplete }: PageContentProps) {
     const [content, setContent] = useState<{ ru: string; uk: string; item_id: string }[] | null>(null);
     const [isLoading, setIsLoading] = useState(true);

     const { isOpen, onOpen, onOpenChange } = useDisclosure(); // Управление состоянием модального окна
     const [isModalOpen, setIsModalOpen] = useState(false);

     const [editingRow, setEditingRow] = useState<{ ru: string; uk: string; item_id: string } | null>(null);

     useEffect(() => {
         const fetchContent = async () => {
             const startTime = Date.now();
             const supabase = createClient();
             const {data, error} = await supabase.from(pageKey).select('item_id, ru, uk');

             if (error) {
                 console.error(`Failed to fetch content for ${pageKey}:`, error.message);
                 setContent([]);
             } else {
                 setContent(data || []);
             }

             const elapsedTime = Date.now() - startTime;
             const delay = Math.max(500 - elapsedTime, 0);
             setTimeout(() => {
                 setIsLoading(false);
                 onLoadComplete();
             }, delay);
         };

         fetchContent();
     }, [pageKey, onLoadComplete]);

     const handleEditClick = (row: { ru: string; uk: string; item_id: string }) => {
         setEditingRow(row);
         onOpen(); // Открыть модальное окно
     };

     const handleSave = (ru: string, uk: string) => {
         console.log('Saved:', {ru, uk});
         // Здесь вы можете обновить данные на сервере
         setIsModalOpen(false);
     };

     const handleClose = () => {
         setIsModalOpen(false);
         setEditingRow(null);
     };

     if (isLoading) {
         return <SkeletonPageContent/>;
     }

     if (!content || content.length === 0) {
         return <p>Нет данных для отображения</p>;
     }


     return (
         <>
             <Table
                 aria-label="Example table with editing functionality"
                 className="table-auto w-full"
                 isStriped
             >
                 <TableHeader>
                     <TableColumn className="w-1/6 border-r border-gray-300 text-center">ID</TableColumn>
                     <TableColumn className="w-1/3 border-r border-gray-300 text-center">RU</TableColumn>
                     <TableColumn className="w-1/3 text-center">UK</TableColumn>
                     <TableColumn className="w-1/12 border-l border-gray-300 text-center">Edit</TableColumn>
                 </TableHeader>
                 <TableBody>
                     {content.map((row, index) => (
                         <TableRow key={index}>
                             <TableCell className="w-1/6 border-r border-gray-300 text-center">
                                 {row.item_id}
                             </TableCell>
                             <TableCell className="w-1/3 border-r border-gray-300">
                                 <div className="flex items-center justify-between">
                                     {row.ru}
                                 </div>
                             </TableCell>
                             <TableCell className="w-1/3">
                                 <div className="flex items-center justify-between">
                                     {row.uk}
                                 </div>
                             </TableCell>
                             <TableCell className="w-1/12 border-l border-gray-300 text-center">
                                 <Button
                                     className="text-blue-500 hover:text-blue-700"
                                     onPress={() => handleEditClick(row)}
                                 >
                                     <Edit className="inline h-4 w-4"/>
                                 </Button>
                             </TableCell>
                         </TableRow>
                     ))}
                 </TableBody>
             </Table>

             <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                 <ModalContent>
                     {(onClose) => (
                         <>
                             <ModalHeader className="flex flex-col gap-1">Edit Translation</ModalHeader>
                             <ModalBody>
                                 <div>
                                     <p><strong>ID:</strong> {editingRow?.item_id}</p>
                                     <p><strong>RU:</strong> {editingRow?.ru}</p>
                                     <p><strong>UK:</strong> {editingRow?.uk}</p>
                                 </div>
                             </ModalBody>
                             <ModalFooter>
                                 <Button color="danger" variant="light" onPress={onClose}>
                                     Cancel
                                 </Button>
                                 <Button color="primary" onPress={onClose}>
                                     Save
                                 </Button>
                             </ModalFooter>
                         </>
                     )}
                 </ModalContent>
             </Modal>

         </>
     );
 }