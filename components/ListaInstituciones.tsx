import React from "react";
import { useInstitutionIdContext } from "@/components/IdContext";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Tooltip, Spinner } from "@nextui-org/react";

import { generateClient } from "aws-amplify/api";
import { useState, useEffect } from 'react';
import type { Schema } from '@/amplify/data/resource';
import type { SelectionSet } from 'aws-amplify/data';
import { Pagination } from '@aws-amplify/ui-react';
import { EditIcon } from "./EditIcon";
import { DeleteIcon } from "./DeleteIcon";
import { EyeIcon } from "./EyeIcon";
import { SearchField } from '@aws-amplify/ui-react';

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
const selectionSet = ['id', 'nombreInstitucion', 'createdAt', 'municipio.nombreMunicipio'] as const;
type InstitucionMunicipios = SelectionSet<Schema['Institucion'], typeof selectionSet>;
type OptionsType = {
  limit: number;
  nextToken: string | null;
  filter?: any;
  selectionSet: typeof selectionSet;
};

export default function ListaInstituciones() {
  const [instituciones, setInstituciones] = useState<InstitucionMunicipios[]>([]);
  const [pageTokens, setPageTokens] = React.useState(new Array<string>());
  const [currentPageIndex, setCurrentPageIndex] = React.useState(1);
  const [hasMorePages, setHasMorePages] = React.useState(true);
  const [loading, setLoading] = React.useState(true);
  const { institucionId, setInstitucionId } = useInstitutionIdContext();
  const [search, setSearch] = React.useState("");

  const handlePageTurn = async (pageIndex: number) => {
    if (hasMorePages || pageIndex <= pageTokens.length + 1) {
      setLoading(true);
      const options: OptionsType = {
        limit: 10,
        nextToken: pageIndex > 1 ? pageTokens[pageIndex - 2] : null,
        selectionSet: selectionSet
      };
      if (search !== "") {
        options.filter = {
          nombreInstitucion: {
            contains: search.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase()
          }
        };
      }    
      const { data: institucion, nextToken } = await client.models.Institucion.list(options);
      
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
      next: ({ }) => {
        handlePageTurn(1);
      },
    });
    return () => sub.unsubscribe();

  }, []);

  const renderCell = React.useCallback((institucion: any, columnKey: string) => {
    const cellValue = institucion[columnKey];

    switch (columnKey) {
      case "nombreInstitucion":
        return (
          cellValue
        );
      case "createdAt"://Format string to date and time
        return (
          new Date(cellValue as string).toLocaleString("es-ES", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" }).replace("a. m.", "AM").replace("p. m.", "PM")
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
                <EditIcon onClick={() => {
                  setInstitucionId(institucion.id);
                }} />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Borrar">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon onClick={() => handleDeleteInstitucion(institucion.id)} />
              </span>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  function handleDeleteInstitucion(id: string) {
    //Search if the institucion has any capacitaciones
    client.models.Capacitacion.list({
      filter: {
        institucionCapacitacionesId: {
          eq: id
        }
      }
    }).then(({ data }) => {
      if (data.length > 0) {
        alert("No se puede eliminar la institución porque tiene capacitaciones asociadas.");
      } else {
        if (window.confirm("¿Está seguro que desea eliminar esta institución?"))
          client.models.Institucion.delete({ id });
      }
    });
  }

  useEffect(() => {
    if (search === "") {      
      handlePageTurn(1);
    }
  }, [search]);


  return (

    <div className="w-full">
      <p className="text-2xl text-center">Lista de instituciones</p>
      <SearchField
        className="py-3 w-80 "
        label="Buscar"
        onClear={() => {
          setHasMorePages(true);
          setPageTokens([]);
          setSearch("")
        }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Buscar institución"
        onSubmit={() => {
          if (search !== "") {
            handlePageTurn(1);
          }
        }}
      />
      {loading ? <div className="w-full flex justify-center"><Spinner label="Cargando..." color="warning" /></div>
        : <Table aria-label="Tabla de instituciones">
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
        </Table>}
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
