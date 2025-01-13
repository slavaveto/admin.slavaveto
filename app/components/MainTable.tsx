'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox } from '@nextui-org/react';
import { Link } from '@nextui-org/link';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { ScrollShadow } from '@nextui-org/react';
import { createClient } from '@/app/assets/auth/utils/supabase/client';

import { handleSaveOrder, moveRowUp } from './utils/changeOrder';

interface EditableTableProps {
    tableName: string; // Название текущей таблицы
    content: { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }[];
    onEdit: (row: { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }) => void;
    onDelete: (row: { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }) => void;
    onToggleRich: (row: { ru: string; uk: string; item_id: string; is_rich: boolean }) => void;
}

export default function MainTable({ tableName, content, onEdit, onDelete, onToggleRich }: EditableTableProps) {
    const [tableContent, setTableContent] = useState(
        content.sort((a, b) => a.order - b.order) // Сортируем по полю `order` при инициализации
    );

    const HtmlString = ({ text }: { text: string }) => (
        <span dangerouslySetInnerHTML={{ __html: text }} />
    );


    const handleMoveRowUp = (index: number) => {
        moveRowUp(index, tableContent, setTableContent, (updatedRows) =>
            handleSaveOrder(updatedRows, tableName)
        );
    };

    return (
        <Table aria-label="Table with move-up functionality" className="table-auto w-full" isStriped>
            <TableHeader className="p-0 m-0">
                <TableColumn className="w-1/6 border-r border-default-300 text-center">ID</TableColumn>
                <TableColumn className="w-1/3 border-r border-default-300 text-center">RU</TableColumn>
                <TableColumn className="w-1/3 text-center">UK</TableColumn>
                <TableColumn className="w-1/12 border-l border-default-300 text-center">Rich Text</TableColumn>
                <TableColumn className="w-1/12 border-l border-default-300 text-center">Edit</TableColumn>
            </TableHeader>
            <TableBody>
                {tableContent.map((row, index) => (
                    <TableRow key={row.item_id}>
                        <TableCell
                            className="w-1/6 border-r border-default-300 text-center cursor-pointer hover:text-primary"
                            onClick={() => handleMoveRowUp(index)}
                        >
                            {row.item_id}
                        </TableCell>
                        <TableCell className="w-1/3 border-r border-default-300">
                            <ScrollShadow className="rich-text flex items-start">
                                <HtmlString text={row.ru} />
                            </ScrollShadow>
                        </TableCell>
                        <TableCell className="w-1/3">
                            <ScrollShadow className="rich-text flex items-start">
                                <HtmlString text={row.uk} />
                            </ScrollShadow>
                        </TableCell>
                        <TableCell className="w-1/12 border-l border-default-300 text-center">
                            <Checkbox isSelected={row.is_rich} onChange={() => onToggleRich(row)} />
                        </TableCell>
                        <TableCell className="w-1/12 border-l border-default-300 text-center">
                            <div className="flex justify-center items-center space-x-[12px]">
                                <Link onClick={() => onEdit(row)}>
                                    <Edit size={18} />
                                </Link>
                                <Link color="danger" onClick={() => onDelete(row)}>
                                    <Trash size={18} />
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}