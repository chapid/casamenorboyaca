import React, { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, Progress } from "@nextui-org/react";
import { Flex, DropZone, Text, VisuallyHidden } from "@aws-amplify/ui-react";
import { MdCheckCircle, MdFileUpload, MdRemoveCircle } from 'react-icons/md';
import { a } from '@aws-amplify/backend';

interface UploadCapacitacionesEvidencesProps {
    capacitacionId: string;
    isOpen: boolean;
    onCloseFunction: () => void;
}

const UploadCapacitacionesEvidences: React.FC<UploadCapacitacionesEvidencesProps> = ({ capacitacionId, isOpen, onCloseFunction }) => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const { onOpenChange } = useDisclosure();
    const hiddenInput = React.useRef(null);
    const acceptedFileTypes = ['image/jpeg'];
    const [file1, setFile1] = useState<File | null>(null);
    const [file2, setFile2] = useState<File | null>(null);
    const [file3, setFile3] = useState<File | null>(null);
    const [loadingFile1, setLoadingFile1] = useState<boolean>(false);
    const [loadingFile2, setLoadingFile2] = useState<boolean>(false);
    const [loadingFile3, setLoadingFile3] = useState<boolean>(false);


    const onFilePickerChange = (event: React.ChangeEvent<HTMLInputElement>, fileNumber: string) => {
        const { files } = event.target;
        if (!files || files.length !== 1) {
            return;
        }
        switch (fileNumber) {
            case '1':
                setFile1(files[0]);
                break;
            case '2':
                setFile2(files[0]);
                break;
            case '3':
                setFile3(files[0]);
                break;
        }
    };

    const handleUpload = async () => {
        if (file1) {
            await uploadFile(file1, '1');
        }
        if (file2) {
            await uploadFile(file2, '2');
        }
        if (file3) {
            await uploadFile(file3, '3');
        }
    };

    function setLoadingByFile(fileNumber: string, value: boolean) {
        switch (fileNumber) {
            case '1':
                setLoadingFile1(value);
                break;
            case '2':
                setLoadingFile2(value);
                break;
            case '3':
                setLoadingFile3(value);
                break;
        }
    }

    async function uploadFile(file: File, fileNumber: string) {
        try {
            setLoadingByFile(fileNumber, true);
            const response = await fetch(
                process.env.NEXT_PUBLIC_BASE_URL + '/api/upload',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ filename: `capacitaciones/${capacitacionId}/${fileNumber}.pdf`, contentType: "image/jpeg" }),
                }
            )
            if (response.ok) {
                const { url } = await response.json()
                console.log('Got presigned URL:', url)

                const uploadResponse = await fetch(url, {
                    body: file,
                    method: "PUT",
                    headers: { "Content-Type": "image/jpeg" }
                })

                if (uploadResponse.ok) {
                    alert('Upload successful!')
                } else {
                    console.error('S3 Upload Error:', uploadResponse)
                    alert('Falló la carga de la presentación.')
                }
            } else {
                alert('Falló la pre-carga de la presentación.')
            }
        } catch (error) {
            console.log('Error : ', error);
        }
        setLoadingByFile(fileNumber, false);
    }

    return (
        <Modal size='4xl' isOpen={isOpen} onOpenChange={onOpenChange} onClose={onCloseFunction} isDismissable={false}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1" >Evidencias de capacitación</ModalHeader>
                        <ModalBody>
                            <section className="bg-white  py-5 px-4 lg:px-16">
                                <div className="container mx-auto px-[12px] md:px-24 xl:px-12 max-w-[1300px] nanum2">
                                    <h3 className="text-center pb-12 italic">Puede subir máximo 3 evidencias</h3>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-x-4 gap-y-18 lg:gap-y-16">
                                        <div className="relative group h-38 flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
                                            <div className="p-1">
                                                <DropZone
                                                    borderWidth="4px"
                                                    borderColor="gray"
                                                    acceptedFileTypes={['image/*']}
                                                    onDropComplete={({ acceptedFiles, rejectedFiles }) => {
                                                        if (acceptedFiles.length > 0) {
                                                            setFile1(acceptedFiles[0]);
                                                        }
                                                    }}
                                                >
                                                    <Flex direction="row" justifyContent="center" alignItems="center">
                                                        <DropZone.Accepted>
                                                            <MdCheckCircle fontSize="5rem" />
                                                        </DropZone.Accepted>
                                                        <DropZone.Rejected>
                                                            <MdRemoveCircle fontSize="5rem" />
                                                        </DropZone.Rejected>
                                                        <DropZone.Default>
                                                            <MdFileUpload fontSize="5rem" />
                                                        </DropZone.Default>
                                                        <Flex direction="column" alignItems="center">
                                                            <Text>Arrastre la imagen de la capacitación aquí o</Text>
                                                            <Button size="sm" onClick={() => { if (hiddenInput && hiddenInput.current) (hiddenInput.current as HTMLInputElement).click() }}>
                                                                Buscar archivo
                                                            </Button>
                                                            <Progress
                                                                aria-label="Subiendo..."
                                                                size="md"
                                                                isIndeterminate
                                                                color="success"
                                                                showValueLabel={true}
                                                                className={`max-w-md ${loadingFile1 ? '' : 'hidden'}`}
                                                            />
                                                        </Flex>

                                                        <VisuallyHidden>
                                                            <input
                                                                type="file"
                                                                tabIndex={-1}
                                                                ref={hiddenInput}
                                                                onChange={(e) => onFilePickerChange(e, '1')}
                                                                multiple={true}
                                                                accept={acceptedFileTypes.join(',')}
                                                            />
                                                        </VisuallyHidden>
                                                    </Flex>

                                                </DropZone>
                                                {file1 &&
                                                    <Text key={file1.name}>{file1.name}</Text>
                                                }
                                            </div>
                                        </div>
                                        <div className="relative group h-38 flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
                                            <div className="p-1">
                                                <DropZone
                                                    borderWidth="4px"
                                                    borderColor="gray"
                                                    acceptedFileTypes={['image/*']}
                                                    onDropComplete={({ acceptedFiles, rejectedFiles }) => {
                                                        if (acceptedFiles.length > 0) {
                                                            setFile2(acceptedFiles[0]);
                                                        }
                                                    }}
                                                >
                                                    <Flex direction="row" justifyContent="center" alignItems="center">
                                                        <DropZone.Accepted>
                                                            <MdCheckCircle fontSize="5rem" />
                                                        </DropZone.Accepted>
                                                        <DropZone.Rejected>
                                                            <MdRemoveCircle fontSize="5rem" />
                                                        </DropZone.Rejected>
                                                        <DropZone.Default>
                                                            <MdFileUpload fontSize="5rem" />
                                                        </DropZone.Default>
                                                        <Flex direction="column" alignItems="center">
                                                            <Text>Arrastre la imagen de la capacitación aquí o</Text>
                                                            <Button size="sm" onClick={() => { if (hiddenInput && hiddenInput.current) (hiddenInput.current as HTMLInputElement).click() }}>
                                                                Buscar archivo
                                                            </Button>
                                                            <Progress
                                                                aria-label="Subiendo..."
                                                                size="md"
                                                                isIndeterminate
                                                                color="success"
                                                                showValueLabel={true}
                                                                className={`max-w-md ${loadingFile2 ? '' : 'hidden'}`}
                                                            />
                                                        </Flex>

                                                        <VisuallyHidden>
                                                            <input
                                                                type="file"
                                                                tabIndex={-1}
                                                                ref={hiddenInput}
                                                                onChange={(e) => onFilePickerChange(e, '2')}
                                                                multiple={true}
                                                                accept={acceptedFileTypes.join(',')}
                                                            />
                                                        </VisuallyHidden>
                                                    </Flex>

                                                </DropZone>
                                                {file2 &&
                                                    <Text key={file2.name}>{file2.name}</Text>
                                                }
                                            </div>
                                        </div>
                                        <div className="relative group h-38 flex flex-col rounded-xl bg-white bg-clip-border text-gray-700 shadow-md">
                                            <div className="p-1">
                                                <DropZone
                                                    borderWidth="4px"
                                                    borderColor="gray"
                                                    acceptedFileTypes={['image/*']}
                                                    onDropComplete={({ acceptedFiles, rejectedFiles }) => {
                                                        if (acceptedFiles.length > 0) {
                                                            setFile3(acceptedFiles[0]);
                                                        }
                                                    }}
                                                >
                                                    <Flex direction="row" justifyContent="center" alignItems="center">
                                                        <DropZone.Accepted>
                                                            <MdCheckCircle fontSize="5rem" />
                                                        </DropZone.Accepted>
                                                        <DropZone.Rejected>
                                                            <MdRemoveCircle fontSize="5rem" />
                                                        </DropZone.Rejected>
                                                        <DropZone.Default>
                                                            <MdFileUpload fontSize="5rem" />
                                                        </DropZone.Default>
                                                        <Flex direction="column" alignItems="center">
                                                            <Text>Arrastre la imagen de la capacitación aquí o</Text>
                                                            <Button size="sm" onClick={() => { if (hiddenInput && hiddenInput.current) (hiddenInput.current as HTMLInputElement).click() }}>
                                                                Buscar archivo
                                                            </Button>
                                                            <Progress
                                                                aria-label="Subiendo..."
                                                                size="md"
                                                                isIndeterminate
                                                                color="success"
                                                                showValueLabel={true}
                                                                className={`max-w-md ${loadingFile3 ? '' : 'hidden'}`}
                                                            />
                                                        </Flex>

                                                        <VisuallyHidden>
                                                            <input
                                                                type="file"
                                                                tabIndex={-1}
                                                                ref={hiddenInput}
                                                                onChange={(e) => onFilePickerChange(e, '3')}
                                                                multiple={true}
                                                                accept={acceptedFileTypes.join(',')}
                                                            />
                                                        </VisuallyHidden>
                                                    </Flex>

                                                </DropZone>
                                                {file3 &&
                                                    <Text key={file3.name}>{file3.name}</Text>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cerrar
                            </Button>
                            <Button color="primary" onPress={handleUpload}>
                                Subir
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default UploadCapacitacionesEvidences;