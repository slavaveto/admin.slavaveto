'use client';

import dynamic from 'next/dynamic';
const CustomEditor = dynamic( () => import( './CkEditor' ), { ssr: false } );
//const myeditor = dynamic( () => import( './ckeditor2' ), { ssr: false } );

//import myeditor from "@/app/components/ckeditor2";


import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea } from '@nextui-org/react';
import { useState, useEffect } from 'react';

interface EditModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (ru: string, uk: string, item_id: string) => void;
    onCreate: (ru: string, uk: string, item_id: string) => void;
    isSaving: boolean; // Новое состояние для загрузки
    initialValues: { ru: string; uk: string; item_id: string; is_rich: boolean; page: string | null; };
    mode: 'edit' | 'create'; // Новый проп для различения режима
}

export default function ModalEdit({ isOpen, onClose, onSave, onCreate, isSaving, initialValues, mode }: EditModalProps) {
    const [ru, setRu] = useState(initialValues?.ru || '');
    const [uk, setUk] = useState(initialValues?.uk || '');
    const [itemId, setItemId] = useState(initialValues?.item_id || ''); // Для создания записи

    const handleSave = () => {
        if (mode === 'create') {
            onCreate(itemId, ru, uk); // Используем функцию создания
        } else {
            onSave(itemId, ru, uk); // Используем функцию редактирования
        }
    };


    useEffect(() => {
        if (isOpen) {
            setRu(initialValues.ru || '');
            setUk(initialValues.uk || '');
            setItemId(initialValues.item_id || '');
        }
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} placement= "top"
               size={initialValues.is_rich ? '3xl' : 'lg'}
               isDismissable={false}
               isKeyboardDismissDisabled={true}
               onOpenChange={(isOpen) => !isOpen && onClose()}>
            <ModalContent>
                <>

                    <ModalHeader className="flex flex-col gap-1">
                        {mode === 'create' ? 'Create New Translation' : `Edit Translation`}
                        {/*{mode === 'create' ? 'Create New Translation' : `Edit Translation - ${initialValues?.page || 'Unknown Page'}`}*/}
                    </ModalHeader>
                    <ModalBody>
                        <div>
                            <div className="mb-12">
                                <Input
                                    className="-font-bold"
                                    style={{ fontWeight: 'bold' }}
                                    isRequired
                                    variant="bordered"
                                    color="primary"
                                    type="text"
                                    label="ItemId"
                                    value={itemId}
                                    onChange={(e) => setItemId(e.target.value)}
                                />
                            </div>


                            <div className="">
                                {initialValues.is_rich ? (

                                    <CustomEditor
                                        data={ru} // Передаём данные RU в редактор
                                        onChange={(newData: string) => setRu(newData)} // Обновляем состояние RU
                                    />

                                    // <Textarea
                                    //     variant="bordered"
                                    //     color="primary"
                                    //     label="RU"
                                    //     minRows={3}
                                    //     maxRows={5}
                                    //     value={ru}
                                    //     onChange={(e) => setRu(e.target.value)}
                                    // />
                                ) : (
                                    <Input
                                        variant="bordered"
                                        color="primary"
                                        type="text"
                                        label="RU"
                                        value={ru}
                                        onChange={(e) => setRu(e.target.value)}
                                    />
                                )}

                            </div>
                            <div className="mt-4">
                                {initialValues.is_rich ? (
                                    <Textarea
                                        variant="bordered"
                                        color="primary"
                                        label="UA"
                                        minRows={3}
                                        maxRows={3}
                                        value={uk}
                                        onChange={(e) => setUk(e.target.value)}
                                    />
                                ) : (
                                    <Input
                                        variant="bordered"
                                        color="primary"
                                        type="text"
                                        label="UA"
                                        value={uk}
                                        onChange={(e) => setUk(e.target.value)}
                                    />
                                )}
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={onClose} isDisabled={isSaving}>
                            Cancel
                        </Button>
                        <Button color="primary" onPress={handleSave} isLoading={isSaving}>
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </ModalFooter>
                </>
            </ModalContent>
        </Modal>
    );
}