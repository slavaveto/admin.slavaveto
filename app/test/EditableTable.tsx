'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { Link } from '@nextui-org/link';
import { Edit } from 'lucide-react';

interface EditableTableProps {
    content: { ru: string; uk: string; item_id: string }[];
    onEdit: (row: { ru: string; uk: string; item_id: string }) => void; // Колбэк для редактирования
}

export default function EditableTable({ content, onEdit }: EditableTableProps) {
    return (
        <Table
            aria-label="Example table with editing functionality"
            className="table-auto w-full"
            isStriped
        >
            <TableHeader className="p-0 m-0">
                {/* Колонка item_id */}
                <TableColumn className="w-1/6 border-r border-gray-300 text-center">ID</TableColumn>

                {/* Колонка RU */}
                <TableColumn className="w-1/3 border-r border-gray-300 text-center">RU</TableColumn>

                {/* Колонка UK */}
                <TableColumn className="w-1/3 text-center">UK</TableColumn>

                {/* Колонка edit */}
                <TableColumn className="w-1/12 border-l border-gray-300 text-center">Edit</TableColumn>
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
                            </div>
                        </TableCell>

                        {/* Правая колонка (UK) */}
                        <TableCell className="w-1/3">
                            <div className="flex items-center justify-between">
                                {row.uk}
                            </div>
                        </TableCell>

                        {/* Средняя колонка (Иконка редактирования) */}
                        <TableCell className="w-1/12 border-l border-gray-300 text-center">
                            <button
                                className="text-blue-500 hover:text-blue-700 ml-2"
                                onClick={() => onEdit(row)} // Передача строки для редактирования
                            >
                                <Edit className="inline h-4 w-4" />
                            </button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}