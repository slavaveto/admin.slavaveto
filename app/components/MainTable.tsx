'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox } from '@nextui-org/react';
import { Link } from '@nextui-org/link';
import { Edit, Trash } from 'lucide-react';
import { useState } from 'react';
import { ScrollShadow } from '@nextui-org/react';
import { createClient } from '@/app/assets/auth/utils/supabase/client';

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


    const handleSaveOrder = async (updatedRows: { item_id: string; order: number }[]) => {

        console.log("Rows to update:", updatedRows);
        const supabase = createClient();

        try {
            const updatePromises = updatedRows.map(({ item_id, order }) =>
                supabase
                    .from(tableName) // Укажите имя вашей таблицы
                    .update({ order }) // Обновляем поле order
                    .eq("item_id", item_id) // Фильтруем по item_id
            );

            const results = await Promise.all(updatePromises);

            const hasErrors = results.some(({ error }) => error);
            if (hasErrors) {
                console.error("Some updates failed:", results);
                throw new Error("Failed to update some rows");
            }

            console.log("Order updated successfully");
        } catch (error) {
            console.error("Failed to save order:", error);
        }
    };

    const moveRowUp = (index: number) => {
        if (index === 0) return; // Нельзя поднять первый элемент выше

        const updatedContent = [...tableContent];
        // Меняем местами строки
        [updatedContent[index - 1], updatedContent[index]] = [updatedContent[index], updatedContent[index - 1]];

        // Обновляем порядок в `order`
        updatedContent.forEach((row, i) => (row.order = i + 1));
        setTableContent(updatedContent);

        // Создаём массив для сохранения
        const updatedOrder = updatedContent.map((row) => ({
            item_id: row.item_id, // Используем `item_id`
            order: row.order,
        }));

        handleSaveOrder(updatedOrder); // Сохраняем порядок
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
                            onClick={() => moveRowUp(index)}
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