'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox } from '@nextui-org/react';
import { ArrowUp, ArrowDown, Edit, Trash } from 'lucide-react';
import { Link } from '@nextui-org/link';
import { useState } from 'react';

interface EditableTableProps {
    content: { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }[];
    onEdit: (row: { ru: string; uk: string; item_id: string; is_rich: boolean }) => void;
    onDelete: (row: { ru: string; uk: string; item_id: string; is_rich: boolean }) => void;
    onToggleRich: (row: { ru: string; uk: string; item_id: string; is_rich: boolean }) => void;
    onUpdateOrder: (newOrder: { item_id: string; order: number }[]) => void; // Callback для сохранения нового порядка
}

export default function MainTable({ content, onEdit, onDelete, onToggleRich, onUpdateOrder }: EditableTableProps) {
    const [rows, setRows] = useState(content);

    const moveRow = (index: number, direction: 'up' | 'down') => {
        const newRows = [...rows];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        // Меняем местами элементы
        const [movedRow] = newRows.splice(index, 1);
        newRows.splice(targetIndex, 0, movedRow);

        // Обновляем порядок
        const updatedRows = newRows.map((row, i) => ({ ...row, order: i + 1 }));

        setRows(updatedRows);
        onUpdateOrder(updatedRows.map(({ item_id, order }) => ({ item_id, order })));
    };

    return (
        <Table
            aria-label="Table with manual row ordering"
            className="table-auto w-full"
            isStriped
        >
            <TableHeader>
                {/* Колонка для управления порядком */}
                <TableColumn className="w-1/12 text-center">Order</TableColumn>
                <TableColumn className="w-1/6 text-center">ID</TableColumn>
                <TableColumn className="w-1/3 text-center">RU</TableColumn>
                <TableColumn className="w-1/3 text-center">UK</TableColumn>
                <TableColumn className="w-1/12 text-center">Rich Text</TableColumn>
                <TableColumn className="w-1/12 text-center">Edit</TableColumn>
            </TableHeader>
            <TableBody>
                {rows.map((row, index) => (
                    <TableRow key={row.item_id}>
                        {/* Колонка с кнопками для изменения порядка */}
                        <TableCell className="text-center">
                            <div className="flex justify-center items-center space-x-1">
                                <button
                                    disabled={index === 0}
                                    onClick={() => moveRow(index, 'up')}
                                    className="text-gray-500 hover:text-black disabled:opacity-50"
                                >
                                    <ArrowUp size={16} />
                                </button>
                                <button
                                    disabled={index === rows.length - 1}
                                    onClick={() => moveRow(index, 'down')}
                                    className="text-gray-500 hover:text-black disabled:opacity-50"
                                >
                                    <ArrowDown size={16} />
                                </button>
                            </div>
                        </TableCell>

                        {/* Колонка item_id */}
                        <TableCell className="text-center">{row.item_id}</TableCell>

                        {/* RU колонка */}
                        <TableCell>{row.ru}</TableCell>

                        {/* UK колонка */}
                        <TableCell>{row.uk}</TableCell>

                        {/* Колонка Rich Text */}
                        <TableCell className="text-center">
                            <Checkbox
                                isSelected={row.is_rich}
                                onChange={() => onToggleRich(row)}
                            />
                        </TableCell>

                        {/* Колонка Edit/Delete */}
                        <TableCell className="text-center">
                            <div className="flex justify-center items-center space-x-2">
                                <Link onClick={() => onEdit(row)} className="cursor-pointer">
                                    <Edit size={16} />
                                </Link>
                                <Link onClick={() => onDelete(row)} className="cursor-pointer text-red-500">
                                    <Trash size={16} />
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}