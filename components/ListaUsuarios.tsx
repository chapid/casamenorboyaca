import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Spinner, Tooltip } from "@heroui/react";

import { generateClient } from "aws-amplify/api";
import { useState, useEffect } from 'react';
import type { Schema } from '@/amplify/data/resource';
import { Pagination } from '@aws-amplify/ui-react';
import { FaRegEdit } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import MessagesHandler from "./MessagesHandler";

const client = generateClient<Schema>();

const columns = [
  {
    key: "email",
    label: "NOMBRE",
  },
  {
    key: "UserCreateDate",
    label: "FECHA DE CREACIÓN",
  },
  {
    key: "UserLastModifiedDate",
    label: "FECHA DE MODIFICACIÓN",
  },
  {
    key: "Enabled",
    label: "Activo",
  },
  {
    key: "acciones",
    label: "ACTIVAR/DESACTIVAR",
  },
];

const emailColumns = [
  {
    key: "email",
    label: "CORREO",
  },
  {
    key: "accionesCorreo",
    label: "ACCIONES",
  },  
];

export default function ListaUsuarios() {
  const [users, setUsers] = useState<Schema['UsersResponse']['type'] | null>();
  const [loading, setLoading] = React.useState(true);
  const [saveResultType, setSaveResultType] = React.useState("");
  const [saveMessage, setSaveMessage] = React.useState("");
  const [allowedEmails, setAllowedEmails] = useState<Schema['AllowedEmails']['type'][] | null>();
  const [email, setEmail] = useState("");
  const [emailId, setEmailId] = useState("");


  useEffect(() => {
    
    getUsers();
    getAllowedEmails();
    

  }, []);

  async function getUsers() {
    setLoading(true);
    await client.queries.listUsers().then(({ data, errors }) => {
      console.log(data);
      console.log(errors);
      if (data) {
        setUsers(data);
      }
      
    });
  }

  async function getAllowedEmails() {     
    const { data: allowedEmails, errors } = await client.models.AllowedEmails.list();
    if (allowedEmails) {
      setAllowedEmails(allowedEmails);
    }
    setLoading(false);
  }

  const renderCell = React.useCallback((usuario: Schema['User']['type'], columnKey: string) => {
    switch (columnKey) {
      case "Enabled":
        return usuario.Enabled ? "Si" : "No";
      case "UserCreateDate":
        //Show date and time in local time zone
        return new Date(usuario.UserCreateDate!).toLocaleString();
      case "UserLastModifiedDate":
        //Show date and time in local time zone
        return new Date(usuario.UserLastModifiedDate!).toLocaleString();
      case "email":
        return usuario.Attributes?.find((attr) => attr!.Name === "email")?.Value;
      case "acciones":
        return (
          <div className="relative flex items-center gap-2">            
            <Tooltip color={usuario.Enabled ? "warning" : "success"} content={usuario.Enabled ? "Desactivar usuario" : "Activar usuario"}>
              <span className={`text-lg text-${usuario.Enabled ? 'success':'danger'} cursor-pointer active:opacity-50`}>
                <FaPowerOff onClick={() => changeUserState(usuario)} />
              </span>
            </Tooltip>
          </div>
        );       
      default:
        return getKeyValue(usuario, columnKey);
    }
  }
  , []);

  const renderEmailCell = React.useCallback((email: Schema['AllowedEmails']['type'], columnKey: string) => {
    switch (columnKey) {
      case "accionesCorreo":
        return (
          <div className="relative flex items-center gap-2">            
            <Tooltip color="danger" content="Borrar">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <AiTwotoneDelete onClick={async () => {
                  //Show dialog to confirm deletion
                  if (window.confirm("¿Está seguro que desea eliminar este correo?")) {
                    setLoading(true);
                    await client.models.AllowedEmails.delete({ id: email.id });
                    getAllowedEmails();
                  }                 
                }} />                
              </span>              
            </Tooltip>
            <Tooltip content="Editar">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
              <FaRegEdit onClick={() => {
                  setEmail(email.email);
                  setEmailId(email.id);
                }} />
              </span>
            </Tooltip>
          </div>
        );  
      default:
        return getKeyValue(email, columnKey);
    }
  }
  , []);

  async function changeUserState(usuario: Schema['User']['type']) {
    setLoading(true);
    await client.mutations.activateDeactivateUser({ username: usuario.Username!, enable: !usuario.Enabled }).then(({ data, errors }) => {
      if (data) {
        getUsers();
        setSaveResultType("success");
        setSaveMessage(`Usuario ${usuario.Username} ${usuario.Enabled ? "desactivado" : "activado"}`);
      }
      if (errors) {
        setSaveResultType("error");
        setSaveMessage(errors[0].message);
      }
      setLoading(false);
    });
  }

  return (
    <div className="w-full">
      <p className="text-2xl text-center py-4">Lista de usuarios</p>
      <MessagesHandler messageType={saveResultType} messageContent={saveMessage} />
      {loading && users === null ?
        <div className="w-full flex justify-center"><Spinner label="Cargando..." color="warning" /></div>
        :
        <Table aria-label="Tabla de usuarios">
          <TableHeader columns={columns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={users?.users ?? []}>
            {(usuario) => (
              <TableRow key={usuario?.Username}>
                {(columnKey) => <TableCell>
                  {renderCell(usuario as Schema['User']['type'], String(columnKey))}
                </TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>}
        <p className="text-2xl text-center py-4">Lista de correos autorizados para crear cuenta</p>  
        {loading && allowedEmails === null ?
        <div className="w-full flex justify-center"><Spinner label="Cargando..." color="warning" /></div>
        :
        <Table aria-label="Tabla de correos autorizados">
          <TableHeader columns={emailColumns}>
            {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
          </TableHeader>
          <TableBody items={allowedEmails ?? []}>
            {(email) => (
              <TableRow key={email?.email}>
                {(columnKey) => <TableCell>
                  {renderEmailCell(email as Schema['AllowedEmails']['type'], String(columnKey))}
                </TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>}
        <div className="w-full flex justify-center py-4">Registro de correos autorizados</div>
        <div className="w-full flex justify-center">
          <input
            className="w-80 p-2 border-gray-500 border-2"
            type="email"
            placeholder="Correo autorizado"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-primary text-white p-2 rounded-md ml-2"
            onClick={async () => {
              if (email === "") {
                return;
              }
              if (emailId) {
                setLoading(true);
                await client.models.AllowedEmails.update({ id: emailId, email });
                setEmail("");
                setEmailId("");
                getAllowedEmails();
                return;
              }
              if (allowedEmails?.find((allowedEmail) => allowedEmail.email === email)) {
                setSaveResultType("error");
                setSaveMessage("El correo ya está registrado");
                return;
              }
              setLoading(true);
              await client.models.AllowedEmails.create({ email });
              setEmail("");
              getAllowedEmails();
            }}
          >
            {emailId ? "Actualizar" : "Registrar"}
          </button>
        </div>
    </div>
  );
}
