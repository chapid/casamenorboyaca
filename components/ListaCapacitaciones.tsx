import React from "react";
import { useCapacitacionIdContext } from "./IdContext";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Spinner, Button, 
    Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";
import { generateClient } from "aws-amplify/api";
import { useState, useEffect } from 'react';
import type { Schema } from '@/amplify/data/resource';
import { Pagination } from '@aws-amplify/ui-react';
import { AiTwotoneDelete } from "react-icons/ai";
import { FaEye } from "react-icons/fa";
import { FaRegEdit } from "react-icons/fa";
import { MdAddPhotoAlternate } from "react-icons/md";
import UploadCapacitacionesEvidences from "./UploadCapacitacionesEvidences";
import DetallesCapacitacionModal from "./DetallesCapacitacionModal";


const client = generateClient<Schema>();

const columns = [
    {
        key: "fechaInicio",
        label: "Fecha programada",
    },
    {
        key: "createdAt",
        label: "FECHA DE CREACIÓN",
    },
    {
        key: "institucion.nombreInstitucion",
        label: "INSTITUCIÓN",
    },
    {
        key: "asistentes.*",
        label: "NUMERO DE ASISTENTES",
    },
    {
        key: "acciones",
        label: "ACCIONES",
    },
];

export default function ListaCapacitaciones() {
    const [capacitaciones, setCapacitaciones] = useState(new Array<any>());
    const [pageTokens, setPageTokens] = React.useState(new Array<string>());
    const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
    const [hasMorePages, setHasMorePages] = React.useState(true);
    const [loading, setLoading] = React.useState(true);
    const [isOpenEv, setIsOpenEv] = React.useState(false);
    const { capacitacionId, setCapacitacionId } = useCapacitacionIdContext();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isOpenDetails, setIsOpenDetails] = React.useState(false);
    const [ asistentes, setAsistentes ] = useState(new Array<any>());

    const showAssistantsList = (listaAsistentes: React.SetStateAction<any[]>) => {
        setAsistentes(listaAsistentes);
        onOpen();
    };

    const handlePageTurn = async (pageIndex: number) => {
        if (hasMorePages || pageIndex <= pageTokens.length + 1) {
            setLoading(true);
            const { data: capacitacion, nextToken } = await client.models.Capacitacion.list({
                limit: 10,
                nextToken: pageIndex > 1 ? pageTokens[pageIndex - 2] : null,
                selectionSet: ['id', 'institucion.nombreInstitucion', 'createdAt', 'fechaInicio', 'asistentes.*'],
            });
            console.log("Capacitaciones: ", capacitacion);
            setCapacitaciones(capacitacion);

            if (!nextToken) {
                setHasMorePages(false);
            } else {
                if (pageTokens.length < 1) {
                    setPageTokens([...pageTokens, nextToken]);
                }
            }
            setCurrentPageIndex(pageIndex);
            setLoading(false);
        }
    };

    useEffect(() => {
        const sub = client.models.Capacitacion.observeQuery().subscribe({
            next: ({ }) => {
                handlePageTurn(1);
            },
        });
        return () => sub.unsubscribe();

    }, []);

    const renderCell = React.useCallback((capacitacion: any, columnKey: string) => {
        const cellValue = capacitacion[columnKey];
        switch (columnKey) {
            case "fechaInicio":
                return (
                    new Date(cellValue as string).toLocaleString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).replace("a. m.", "AM").replace("p. m.", "PM")
                );
            case "createdAt"://Format string to date and time
                return (
                    new Date(cellValue as string).toLocaleString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).replace("a. m.", "AM").replace("p. m.", "PM")
                );
            case "institucion.nombreInstitucion":
                return (
                    capacitacion.institucion?.nombreInstitucion
                );
            case "asistentes.*":
                return (
                    <Button onClick={ () => { 
                        if (capacitacion.asistentes?.length > 0)
                        showAssistantsList(capacitacion.asistentes)
                    }}>{capacitacion.asistentes?.length || 0}</Button>
                );
            case "acciones":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Detalles">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <FaEye onClick={() => {
                                    setCapacitacionId(capacitacion.id);
                                    setIsOpenDetails(true)
                                }} />
                            </span>
                        </Tooltip>
                        <Tooltip content="Editar">
                            <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                <FaRegEdit onClick={() => {
                                    setCapacitacionId(capacitacion.id);
                                }} />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Borrar">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <AiTwotoneDelete onClick={() => handleDeleteCapacitacion(capacitacion.id)} />
                            </span>
                        </Tooltip>
                        <Tooltip content="Agregar evidencia">
                            <span className="text-lg text-primary cursor-pointer active:opacity-50">
                                <MdAddPhotoAlternate onClick={() => handleEvidencesUpload(capacitacion.id)} />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    function handleDeleteCapacitacion(id: string) {
        if (confirm("¿Está seguro de que desea eliminar esta capacitación?"))
            client.models.Capacitacion.delete({ id });
    }

    function handleEvidencesUpload(id: string) {
        //Show dialog to upload evidences
        setIsOpenEv(true);
        console.log("Agregar evidencia para capacitación con id: ", id);
    }


    return (
        <div className="w-full">

            <UploadCapacitacionesEvidences capacitacionId="id" isOpen={isOpenEv} onCloseFunction={() => setIsOpenEv(false)} />
            <DetallesCapacitacionModal capacitacionId={capacitacionId} isOpen={isOpenDetails} onCloseFunction={() => setIsOpenDetails(false)} />
            <p className="text-2xl text-center">Lista de capacitaciones</p>
            {loading ? <div className="w-full flex justify-center"><Spinner label="Cargando..." color="warning" /></div>
                : <Table aria-label="Tabla de capacitaciones">
                    <TableHeader columns={columns}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                    </TableHeader>
                    <TableBody items={capacitaciones} emptyContent={"No existen capacitaciones creadas."}>
                        {(capacitacion) => (
                            <TableRow key={capacitacion.id}>
                                {(columnKey) => <TableCell>
                                    {renderCell(capacitacion, String(columnKey))}
                                </TableCell>}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>}
            <Pagination
                currentPage={currentPageIndex}
                totalPages={pageTokens.length + 1}
                hasMorePages={hasMorePages}
                onNext={() => handlePageTurn(currentPageIndex + 1)}
                onPrevious={() => handlePageTurn(currentPageIndex - 1)}
                onChange={(pageIndex) => handlePageTurn(pageIndex || 1)}
            />
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Asistentes</ModalHeader>
                            <ModalBody>
                                {asistentes.length > 0 ? asistentes.map((asistente: any) => {
                                    return (
                                        <div key={asistente.id} className="flex flex-row gap-2">
                                            <p>{asistente.nombre} {asistente.apellido}</p>
                                            <p>{asistente.correo}</p>
                                        </div>
                                    );
                                }
                                ) : <p>No hay asistentes registrados.</p>}
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
        </div>
    );
}
