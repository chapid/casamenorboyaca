import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rules below
specify that owners, authenticated via your Auth resource can "create",
"read", "update", and "delete" their own records. Public users,
authenticated via an API key, can only "read" records.
=========================================================================*/
const schema = a.schema({
  Institucion: a
    .model({
      nombreInstitucion: a.string()!,
      municipio: a.belongsTo('Municipio'),
      asistentes: a.hasMany('Asistente'),
    })
    .authorization([a.allow.owner(), a.allow.public('iam').to(['read'])]),  
  Municipio: a
    .model({
      nombreMunicipio: a.string()!,
      instituciones: a.hasMany('Institucion'),
    })
    .authorization([a.allow.owner(), a.allow.public('iam').to(['read'])]),
  Asistente: a
    .model({
      nombre: a.string()!,
      apellido: a.string()!,
      correo: a.string()!,
      telefono: a.string(),
      instituciones: a.belongsTo('Institucion'),
      capacitacione: a.belongsTo('Capacitacion'),
    })
    .authorization([a.allow.public('iam').to(['create']), a.allow.private().to(['read', 'update', 'delete'])]), 
  Tema: a
    .model({
      nombreTema: a.string()!,
      descripcion: a.string()!,
      capacitaciones: a.hasMany('Capacitacion'),
    })
    .authorization([a.allow.owner(), a.allow.public('iam').to(['read'])]),  
  Capacitacion: a
    .model({
      descripcion: a.string()!,
      fechaInicio: a.string()!,
      fechaFin: a.string(),
      temas: a.hasMany('Tema'),
      asistentes: a.hasMany('Asistente'),
    })
    .authorization([a.allow.owner(), a.allow.public('iam').to(['read'])]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool'
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>