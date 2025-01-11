'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox } from '@nextui-org/react';
import { Link } from '@nextui-org/link';
import { Edit, Trash, CirclePlus } from 'lucide-react';
import {useAsyncList} from "@react-stately/data";

interface EditableTableProps {
    content: { ru: string; uk: string; item_id: string; is_rich: boolean }[];
    onEdit: (row: { ru: string; uk: string; item_id: string; is_rich: boolean }) => void; // Колбэк для редактирования
    onDelete: (row: { ru: string; uk: string; item_id: string; is_rich: boolean }) => void; // Колбэк для удаления
    onToggleRich: (row: { ru: string; uk: string; item_id: string; is_rich: boolean }) => void;
}

export default function MainTable({ content, onEdit, onDelete, onToggleRich }: EditableTableProps) {

    return (
        <Table
            aria-label="Example table with editing functionality"
            className="table-auto w-full"
            isStriped
        >
            <TableHeader className="p-0 m-0">
                {/* Колонка item_id */}
                <TableColumn className="w-1/6 border-r border-default-300 text-center" >ID</TableColumn>

                {/* Колонка RU */}
                <TableColumn className="w-1/3 border-r border-default-300 text-center" >RU</TableColumn>

                {/* Колонка UK */}
                <TableColumn className="w-1/3 text-center" >UK</TableColumn>

                {/* Колонка is_rich */}
                <TableColumn className="w-1/12 border-l border-default-300 text-center">Rich Text</TableColumn>

                {/* Колонка edit */}
                <TableColumn className="w-1/12 border-l border-default-300 text-center">Edit</TableColumn>
            </TableHeader>
            <TableBody>
                {content.map((row, index) => (
                    <TableRow key={index}>
                        {/* Колонка item_id */}
                        <TableCell className="w-1/6 border-r border-default-300 text-center">
                            {row.item_id}
                        </TableCell>

                        {/* Левая колонка (RU) */}
                        <TableCell className="w-1/3 border-r border-default-300">
                            <div className="flex items-center justify-between">
                                {row.ru}
                            </div>
                        </TableCell>

                        {/* Правая колонка (UK) */}
                        <TableCell className="w-1/3">
                            <div className="flex items-center justify-between">
                                {row.uk}
                            </div>
                        </TableCell>

                        {/* Колонка is_rich */}
                        <TableCell className="w-1/12 border-l border-default-300 text-center">
                            <div className="flex items-center justify-center">
                                <Checkbox
                                    isSelected={row.is_rich}
                                    onChange={() => onToggleRich(row)} // Вызываем колбэк при изменении чекбокса
                                />
                            </div>

                        </TableCell>

                        {/* Средняя колонка (Иконка редактирования) */}
                        <TableCell className="w-1/12 border-l border-default-300 text-center">
                            <div className="flex justify-center items-center space-x-[12px]">
                                <Link
                                    className="mt-[-0px] cursor-pointer"
                                    onClick={() => onEdit(row)} // Передача строки для редактирования
                                >
                                    <Edit size={18} />
                                </Link>
                                {/* Иконка удаления */}
                                <Link
                                    color="danger"
                                    className="mt-[-2px] cursor-pointer "
                                    onClick={() => onDelete(row)} // Передача строки для удаления
                                >
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