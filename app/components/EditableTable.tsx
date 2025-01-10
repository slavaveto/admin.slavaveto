'use client';

import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from '@nextui-org/react';
import { Link } from '@nextui-org/link';
import { Edit } from 'lucide-react';
import {useAsyncList} from "@react-stately/data";

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
                <TableColumn className="w-1/6 border-r border-default-300 text-center" allowsSorting>ID</TableColumn>

                {/* Колонка RU */}
                <TableColumn className="w-1/3 border-r border-default-300 text-center" allowsSorting>RU</TableColumn>

                {/* Колонка UK */}
                <TableColumn className="w-1/3 text-center" allowsSorting>UK</TableColumn>

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

                        {/* Средняя колонка (Иконка редактирования) */}
                        <TableCell className="w-1/12 border-l border-default-300 text-center">
                            <Link
                                className=" ml-2 cursor-pointer"
                                onClick={() => onEdit(row)} // Передача строки для редактирования
                            >
                                <Edit className="inline h-4 w-4" />
                            </Link>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}