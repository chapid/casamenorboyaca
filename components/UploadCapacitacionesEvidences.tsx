'use client';
import React, { useEffect, useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure } from "@heroui/react";
import { FileUploader } from '@aws-amplify/ui-react-storage';
import '@aws-amplify/ui-react/styles.css';

interface UploadCapacitacionesEvidencesProps {
    capacitacionId: string;
    isOpen: boolean;
    onCloseFunction: () => void;
}

const UploadCapacitacionesEvidences: React.FC<UploadCapacitacionesEvidencesProps> = ({ capacitacionId, isOpen, onCloseFunction }) => {

    const { onOpenChange } = useDisclosure();
    const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
    const [uploadPath, setUploadPath] = useState<string>(`capacitaciones/${capacitacionId}/evidencias/`);    

    useEffect(() => {
        setUploadPath(`protected/${capacitacionId}/evidencias/`);       
    }, [capacitacionId]);


    return (
        <Modal size='4xl' isOpen={isOpen} onOpenChange={onOpenChange} onClose={onCloseFunction} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1" >Evidencias de capacitación</ModalHeader>
                        <ModalBody>
                            <section className="bg-white  py-5 px-4 lg:px-16">
                                <FileUploader                                
                                    path={uploadPath} // Set the S3 path
                                    maxFileCount={3}
                                    acceptedFileTypes={["image/*"]}
                                    onUploadError={(error) => console.error('Error uploading file:', error)}
                                    onUploadSuccess={({ key }) => setUploadedFiles((prev) => [...prev, key as string])}
                                />

                                {uploadedFiles.length > 0 && (
                                    <div className="mt-4">
                                        <h3 className="font-medium">Archivos subidos:</h3>
                                        <ul className="list-disc pl-5">
                                            {uploadedFiles.map((file, index) => (
                                                <li key={index} className="text-blue-600">{file}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cerrar
                            </Button>
                            
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default UploadCapacitacionesEvidences;