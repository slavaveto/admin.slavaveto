'use client';
import { createClient } from '@/app/assets/auth/utils/supabase/client';


import { useState, useEffect } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Checkbox, Spinner } from '@nextui-org/react';
import { ScrollShadow } from '@nextui-org/react';
import { Link } from '@nextui-org/link';
import { Edit, Trash, ArrowUp, ArrowDown, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

import { handleSaveOrder, moveRowUp, moveRowDown } from './utils/changeOrder';
import  copyItem  from './utils/сopyItem';

interface EditableTableProps {
    tableName: string; // Название текущей таблицы
    content: { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }[];
    onEdit: (row: { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }) => void;
    onDelete: (row: { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }) => void;
    onToggleRich: (row: { ru: string; uk: string; item_id: string; is_rich: boolean; order: number }) => void;
}

export default function MainTable({ tableName, content, onEdit, onDelete, onToggleRich }: EditableTableProps) {
    const [tableContent, setTableContent] = useState(
        content.sort((a, b) => a.order - b.order) // Сортируем по полю `order` при инициализации
    );

    // Синхронизация `tableContent` с `content`, если `content` изменилось
    useEffect(() => {
        setTableContent(content.sort((a, b) => a.order - b.order));
    }, [content]);

    const HtmlString = ({ text }: { text: string }) => (
        <span dangerouslySetInnerHTML={{ __html: text }} />
    );

    const handleMoveRowUp = (index: number) => {
        moveRowUp(index, tableContent, setTableContent, (updatedRows) =>
            handleSaveOrder(updatedRows, tableName)
        );
    };
    const handleMoveRowDown = (index: number) => {
        moveRowDown(index, tableContent, setTableContent, (updatedRows) =>
            handleSaveOrder(updatedRows, tableName)
        );
    };

    const { handleCopyRow } = copyItem({
        tableName,
        tableContent,
        setTableContent,
        handleSaveOrder,
    });


    return (
        <Table aria-label="Table with move-up and move-down functionality" className="table-auto w-full" isStriped>
            <TableHeader className="p-0 m-0">
                <TableColumn className="-w-[15px] border-r border-default-300 text-center px-2 m-0">Order</TableColumn>
                <TableColumn className="-w-1/6 border-r border-default-300 text-center p-0 m-0">ID</TableColumn>
                <TableColumn className="w-1/3 border-r border-default-300 text-center">RU</TableColumn>
                <TableColumn className="w-1/3 text-center">UK</TableColumn>
                <TableColumn className="-w-1/12 border-l border-default-300 text-center p-0 px-2 m-0">?Rich</TableColumn>
                <TableColumn className="-w-1/12 border-l border-default-300 text-center p-0 m-0">Edit</TableColumn>
            </TableHeader>
            <TableBody>
                {tableContent.map((row, index) => (
                    <TableRow key={row.item_id}>
                        {/* Колонка со стрелками */}
                        <TableCell className="-w-1/12 border-r border-default-300 text-center p-0 m-0">
                            <div className="flex flex-row space-x-[4px] p-0 m-0 justify-center">
                                <Link
                                    // className={`cursor-pointer ${index === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    className="cursor-pointer text-default-500 hover:text-primary hover:opacity-100"
                                    onClick={() => {
                                        if (index !== 0) handleMoveRowUp(index);
                                    }}
                                    aria-disabled={index === 0}
                                    isDisabled={index === 0}
                                    // isBlock
                                >
                                    <ArrowUp size={18} />
                                </Link>
                                <Link
                                    // className={`cursor-pointer ${index === tableContent.length - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    className="cursor-pointer text-default-500 hover:text-primary hover:opacity-100"

                                    onClick={() => {
                                        if (index !== tableContent.length - 1) handleMoveRowDown(index);
                                    }}
                                    aria-disabled={index === tableContent.length - 1}
                                    isDisabled={index === tableContent.length - 1}
                                    // isBlock
                                >
                                    <ArrowDown size={18} />
                                </Link>
                            </div>
                        </TableCell>
                        <TableCell
                            className="-w-1/6 border-r border-default-300 text-center text-danger-300 font-medium  p-0 p-2 m-0"
                            // onClick={() => handleMoveRowUp(index)}
                        >
                            {row.item_id}
                        </TableCell>
                        <TableCell className="w-1/3 border-r border-default-300 p-0 p-2 m-0">
                            <ScrollShadow className="rich-text flex items-start ">
                                <HtmlString text={row.ru} />
                            </ScrollShadow>
                        </TableCell>
                        <TableCell className="w-1/3 p-0 p-2 m-0">
                            <ScrollShadow className="rich-text flex items-start ">
                                <HtmlString text={row.uk} />
                            </ScrollShadow>
                        </TableCell>
                        <TableCell className="-w-1/12 border-l border-default-300 justify-center text-center  p-0 m-0">
                            <div className="flex justify-center items-center p-0 m-0 ml-[8px]">
                            <Checkbox isSelected={row.is_rich} onChange={() => onToggleRich(row)} />
                            </div>
                        </TableCell>
                        <TableCell className="-w-1/12 border-l border-default-300 text-center p-0 m-0">
                            <div className="flex justify-between items-center    p-0 px-2 m-0">
                                <Link
                                    className="mt-[-0px] cursor-pointer mr-[10px]"
                                    onClick={() => onEdit(row)}
                                >
                                    <Edit size={20} />
                                </Link>

                                <Link
                                    className="mt-[-0px]  cursor-pointer mr-[8px]"
                                    color={"success"}
                                    onClick={() => handleCopyRow(index)}
                                >
                                    <Copy size={20} />
                                </Link>

                                <Link
                                    className="mt-[0px] cursor-pointer flex justify-center p-0"
                                    color="danger"
                                    onClick={() => onDelete(row)}
                                >
                                    <Trash size={20} />
                                </Link>
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}