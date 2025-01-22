'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@nextui-org/react';
import { useState } from 'react';

const CustomEditor = dynamic(() => import('@/app/components/сkEditor'), { ssr: false });

export default function EditorPage({ params }: { params: { item_id: string } }) {
    const router = useRouter();
    const [data, setData] = useState('<p>Начальный текст</p>'); // Начальные данные для редактора

    const handleSave = () => {
        console.log('Сохраненные данные:', data);
        router.back(); // Возврат к предыдущей странице
    };

    return (
        <div className="p-4">
            <h1>Редактирование {params.item_id}</h1>
            {/*<CustomEditor*/}
            {/*    data={data}*/}
            {/*    onChange={(newData: string) => setData(newData)}*/}
            {/*/>*/}
            <Button onClick={handleSave}>Сохранить</Button>
        </div>
    );
}