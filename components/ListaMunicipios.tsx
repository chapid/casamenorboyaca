import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner } from "@nextui-org/react";

import { generateClient } from "aws-amplify/api";
import { useState, useEffect } from 'react';
import type { Schema } from '@/amplify/data/resource';
import { Pagination } from '@aws-amplify/ui-react';

const client = generateClient<Schema>();

const columns = [
  {
    key: "nombreMunicipio",
    label: "NOMBRE",
  },
  {
    key: "createdAt",
    label: "FECHA DE CREACIÓN",
  }, 
];

export default function ListaMunicipios() {
  const [municipios, setMunicipios] = useState<Schema['Municipio'][]>([]);
  const [pageTokens, setPageTokens] = React.useState(new Array<string>());
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  const handlePageTurn = async (pageIndex: number) => {
    if (hasMorePages || pageIndex <= pageTokens.length + 1) {
      setLoading(true);
      const { data: municipio, nextToken } = await client.models.Municipio.list({
        limit: 10,
        nextToken: pageIndex > 1 ? pageTokens[pageIndex - 2] : null
      });
      setMunicipios(municipio);

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
    const sub = client.models.Municipio.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        handlePageTurn(1);
      },
    });
    return () => sub.unsubscribe();

  }, []);



  return (
    <div className="w-full">
      <p className="text-2xl text-center">Lista de municipios</p>
      {loading && <div className="w-full flex justify-center"><Spinner label="Cargando..." color="warning" /></div>}
      <Table aria-label="Tabla de instituciones">

        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={municipios}>
          {(municipio) => (
            <TableRow key={municipio.id}>
              {(columnKey) => <TableCell>{getKeyValue(municipio, columnKey)}</TableCell>}
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
