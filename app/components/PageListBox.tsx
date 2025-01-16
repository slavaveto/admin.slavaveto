import { MoreHorizontal, MoreVertical } from 'lucide-react'; // Иконка с тремя точками
import { Listbox, ListboxItem, Dropdown, DropdownItem, DropdownTrigger, DropdownMenu, Button } from "@nextui-org/react";
import { Link } from '@nextui-org/link';

interface Page {
    page_key: string;
    order?: number;
    btn_type?: string;
}

interface PageListboxProps {
    pages: Page[];
    selectedPage: string | null;
    onSelectPage: (pageKey: string) => void;
    onRename: (pageKey: string) => void; // Функция для переименования
    onCopy: (pageKey: string) => void; // Функция для копирования
}

export default function PageListBox({ pages, selectedPage, onSelectPage, onCopy, onRename }: PageListboxProps) {
    return (
        <Listbox
            variant="faded"
            onAction={(key) => onSelectPage(key as string)}
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
                    <div className={"flex flex-row justify-between items-center"}>
                    <span className={page.btn_type === 'image' ? 'font-semibold' : ''}>
                        {page.page_key}
                    </span>
                    {/* Иконка с тремя точками */}
                    {/*<MoreHorizontal size={16} className="text-default-300 hover:text-primary-500 cursor-pointer" />*/}
                        {/* Выпадающий список */}
                        <Dropdown>
                            <DropdownTrigger className="px-0">
                                <Link className="text-default-400 hover:text-primary-700 transition">
                                    <MoreVertical size={16} /></Link>

                            </DropdownTrigger>
                            <DropdownMenu aria-label="Действия">
                                <DropdownItem key="rename" onClick={() => onRename(page.page_key)}>
                                    Переименовать
                                </DropdownItem>
                                <DropdownItem key="copy" onClick={() => onCopy(page.page_key)}>
                                    Скопировать
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                </div>
                </ListboxItem>
            ))}
        </Listbox>
    );
}