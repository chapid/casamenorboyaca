import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Spinner } from "@nextui-org/react";

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
    key: "nombreTema",
    label: "NOMBRE",
  },
  {
    key: "descripcion",
    label: "DESCRIPCION",
  },
  {
    key: "createdAt",
    label: "FECHA DE CREACIÓN",
  }, 
  {
    key: "acciones",
    label: "ACCIONES",
  }, 
];

export default function ListaTemas() {
  const [temas, setTemas] = useState<Schema['Tema'][]>([]);
  const [pageTokens, setPageTokens] = React.useState(new Array<string>());
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  const handlePageTurn = async (pageIndex: number) => {
    if (hasMorePages || pageIndex <= pageTokens.length + 1) {
      setLoading(true);
      const { data: tema, nextToken } = await client.models.Tema.list({
        limit: 10,
        nextToken: pageIndex > 1 ? pageTokens[pageIndex - 2] : null
      });
      setTemas(tema);

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
    const sub = client.models.Tema.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        handlePageTurn(1);
      },
    });
    return () => sub.unsubscribe();

  }, []);

  const renderCell = React.useCallback((tema: any, columnKey: string) => {
    const cellValue = tema[columnKey];
    
    switch (columnKey) {
      case "nombreTema":
      case "descripcion":
        return (
          cellValue
        );
      case "createdAt"://Format string to date and time
        return (
          new Date(cellValue as string).toLocaleString()         
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
                <DeleteIcon onClick={() => handleDeleteTema(tema.id)}/>
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  function handleDeleteTema(id: string) {
    client.models.Tema.delete({ id });
  }

  return (
    <div className="w-full">
      <p className="text-2xl text-center">Lista de temas</p>
      {loading && <div className="w-full flex justify-center"><Spinner label="Cargando..." color="warning" /></div>}
      <Table aria-label="Tabla de temas">

        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={temas}>
          {(tema) => (
            <TableRow key={tema.id}>
              {(columnKey) => <TableCell>{renderCell(tema, String(columnKey))}</TableCell>}
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
