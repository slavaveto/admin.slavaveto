import { Listbox, ListboxItem } from '@nextui-org/react';

interface Page {
    page_key: string;
    order?: number;
    btn_type?: string;
}

interface PageListboxProps {
    pages: Page[];
    selectedPage: string | null;
    onSelectPage: (pageKey: string) => void;
}

export default function PageListbox({ pages, selectedPage, onSelectPage }: PageListboxProps) {
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
                    <span className={page.btn_type === 'image' ? 'font-semibold' : ''}>
                        {page.page_key}
                    </span>
                </ListboxItem>
            ))}
        </Listbox>
    );
}