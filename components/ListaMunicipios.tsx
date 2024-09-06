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
  const [municipios, setMunicipios] = useState<Schema['Municipio']["type"][]>([]);
  const [pageTokens, setPageTokens] = React.useState(new Array<string>());
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);
  const [loading, setLoading] = React.useState(true);

  const handlePageTurn = async (page: number) => {
    if (hasMorePages || page <= pageTokens.length + 1) {
      setLoading(true);

      setCurrentPageIndex(page);
      const { data: municipio, nextToken } = await client.models.Municipio.list({
        limit: 10,
        nextToken: pageTokens[page - 2]
      });
      setMunicipios(municipio);

      if (!nextToken) {
        setHasMorePages(false);
      }

      if (page - 1 === pageTokens.length || page === 1 && pageTokens.length === 0) {
        setPageTokens([...pageTokens, nextToken ?? '']);
      }
      console.log("pageIndex", page);
      console.log("pageTokens", pageTokens);


      setLoading(false);
    }
  };

  useEffect(() => {
    const sub = client.models.Municipio.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        handlePageTurn(currentPageIndex);
      },
    });
    return () => sub.unsubscribe();

  }, []);



  return (
    <div className="w-full">
      <p className="text-2xl text-center">Lista de municipios</p>
      {loading ?
        <div className="w-full flex justify-center"><Spinner label="Cargando..." color="warning" /></div>
        : <Table aria-label="Tabla de instituciones">
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
        </Table>}




      <Pagination
        currentPage={currentPageIndex}
        totalPages={pageTokens.length}
        hasMorePages={hasMorePages}
        onNext={() => {
          //setCurrentPageIndex(currentPageIndex+1);
          handlePageTurn(currentPageIndex + 1)
        }}
        onPrevious={() => {
          setCurrentPageIndex(currentPageIndex - 1);
          handlePageTurn(currentPageIndex - 1)
        }}
        onChange={(pageIndex) => {
          handlePageTurn(pageIndex || 1);
        }
        }
      />

    </div>
  );
}
