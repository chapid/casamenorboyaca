import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Spinner} from "@nextui-org/react";

import { generateClient } from "aws-amplify/api";
import { useState, useEffect } from 'react';
import type { Schema } from '@/amplify/data/resource';
import { Pagination } from '@aws-amplify/ui-react';
import {EditIcon} from "./EditIcon";
import {DeleteIcon} from "./DeleteIcon";
import {EyeIcon} from "./EyeIcon";

const client = generateClient<Schema>();

const columns = [
  {
    key: "nombreInstitucion",
    label: "NOMBRE",
  },
  {
    key: "createdAt",
    label: "FECHA DE CREACIÓN",
  },
  {
    key: "municipio.nombreMunicipio",
    label: "MUNICIPIO",
  },
  {
    key: "acciones",
    label: "ACCIONES",
  },  
];

export default function ListaInstituciones() {
  const [instituciones, setInstituciones] = useState(new Array<any>());
  const [pageTokens, setPageTokens] = React.useState(new Array<string>());
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);  
  const [loading, setLoading] = React.useState(true);

  const handlePageTurn = async (pageIndex: number) => {    
    if (hasMorePages || pageIndex <= pageTokens.length+1){
      setLoading(true);
      const { data: institucion, nextToken } = await client.models.Institucion.list({
        limit: 10,
        nextToken: pageIndex>1 ? pageTokens[pageIndex - 2]:null,
        selectionSet: ['id', 'nombreInstitucion', 'createdAt', 'municipio.nombreMunicipio']
      });
      
    setInstituciones(institucion);
    
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
    const sub = client.models.Institucion.observeQuery().subscribe({
      next: ({}) => {
        handlePageTurn(1);
      },
    });
    return () => sub.unsubscribe();
    
  }, []);
    
  const renderCell = React.useCallback((institucion: any, columnKey: string) => {
    const cellValue = institucion[columnKey];
    console.log(institucion.municipio);
    switch (columnKey) {
      case "nombreInstitucion":
        return (
          cellValue
        );
      case "createdAt"://Format string to date and time
        return (
          new Date(cellValue as string).toLocaleString()         
        );
      case "municipio.nombreMunicipio":
        return (
          institucion.municipio?.nombreMunicipio
        );
      case "acciones":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Detalles">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Editar">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Borrar">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon onClick={() => handleDeleteInstitucion(institucion.id)}/>
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  function handleDeleteInstitucion(id: string) {
    client.models.Institucion.delete({ id });
  }
  
  
  return (
    <div className="w-full">
        <p className="text-2xl text-center">Lista de instituciones</p>
        {loading && <div className="w-full flex justify-center"><Spinner label="Cargando..." color="warning" /></div>}
    <Table aria-label="Tabla de instituciones">
      <TableHeader columns={columns}>
        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
      </TableHeader>
      <TableBody items={instituciones} emptyContent={"No existen instituciones creadas."}>
        {(institucion) => (
          <TableRow key={institucion.id}>
            {(columnKey) => <TableCell>
              {renderCell(institucion, String(columnKey))}                                           
              </TableCell>}
              
          </TableRow>          
        )}
      </TableBody>
    </Table>
    
    
    <Pagination
      currentPage={currentPageIndex}
      totalPages={pageTokens.length + 1}
      hasMorePages={hasMorePages}
      onNext={() => handlePageTurn(currentPageIndex + 1)}
      onPrevious={() => handlePageTurn(currentPageIndex - 1)}
      onChange={(pageIndex) => handlePageTurn(pageIndex || 1)}
    />

  </div>
  );
}
