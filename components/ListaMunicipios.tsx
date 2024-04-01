import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue} from "@nextui-org/react";

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
  {
    key: "acciones",
    label: "ACCIONES",
  },
];

export default function ListaMunicipios() {
  const [municipios, setMunicipios] = useState<Schema['Municipio'][]>([]);
  const [pageTokens, setPageTokens] = React.useState(new Array<string>());
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);

  const handleNextPage = async () => {  
    console.log('pageTokens',pageTokens);  
    if (hasMorePages && currentPageIndex === pageTokens.length) {
        const { data: municipio, nextToken } = await client.models.Municipio.list({
            limit: 10,
            nextToken: pageTokens[pageTokens.length - 1]
          });
        setMunicipios(municipio);
      if (!nextToken) {
        setHasMorePages(false);
      }else{
        setPageTokens([...pageTokens, nextToken]);
      }
    }

    setCurrentPageIndex(currentPageIndex + 1);
  };

  const handlePageTurn = async (pageIndex: number) => {
    console.log('pageIndex',pageIndex);
    if (hasMorePages || pageIndex <= pageTokens.length){
      const { data: municipio, nextToken } = await client.models.Municipio.list({
        limit: 10,
        nextToken: pageIndex>1 ? pageTokens[pageIndex - 1]:null
      });
    setMunicipios(municipio);
    console.log('nextToken',nextToken);
    
    if (!nextToken) {
      setHasMorePages(false);
    } else {
      
      if (pageTokens.length < 1) {
        console.log('pageTokens.length',pageTokens.length);
        setPageTokens([...pageTokens, nextToken]);
      }
      setCurrentPageIndex(pageIndex);
    }
    console.log('pageTokens',pageTokens);
    }
    
    
    
  };

  useEffect(() => {
    handlePageTurn(1);
  }, []);
    
    
  
  return (
    <div className="w-full">
        <p className="text-2xl text-center">Lista de municipios</p>
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
