//data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';
import { listUsersHandler } from "./list-users-handler/resource"
import { addUserToGroup } from "./add-user-to-group/resource"
import { activateDeactivateUser } from './activate-deactivate-user/resource';
import { getUserInfo } from './get-user-info/resource';

/*== STEP 1 ===============================================================
The section below creates a Todo database table with a "content" field. Try
adding a new "isDone" field as a boolean. The authorization rules below
specify that owners, authenticated via your Auth resource can "create",
"read", "update", and "delete" their own records. Public users,
authenticated via an API key, can only "read" records.
=========================================================================*/

const schema = a.schema({
  Municipio: a
    .model({
      nombreMunicipio: a.string().required(),
      instituciones: a.hasMany('Institucion', 'municipioId'),
    })
    .authorization(allow => [
      allow.groups(["EDITORS"]).to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "update", "delete", "read"]),
      allow.guest().to(["read"]),
    ]),
  UserAttribute: a.customType({
    Name: a.string(),
    Value: a.string(),
  }),
  User: a.customType({
    Attributes: a.ref('UserAttribute').array(),
    Enabled: a.boolean(),
    UserCreateDate: a.datetime(),
    UserLastModifiedDate: a.datetime(),
    UserStatus: a.string(),
    Username: a.string(),
  }),
  UsersResponse: a.customType({
    users: a.ref('User').array(),
  }),
  SingleUserAttribute: a.customType({
    Name: a.string(),
    Value: a.string(),
  }),
  MFAOptionsAttribute: a.customType({
    DeliveryMedium: a.string(),
    AttributeName: a.string(),
  }),
  UserInfoResponse: a.customType({
    Username: a.string(),
    UserAttributes: a.ref('SingleUserAttribute').array(),
    MFAOptions: a.ref('MFAOptionsAttribute').array(),
    PreferredMfaSetting: a.string(),
    UserMFASettingList: a.string().array(),
  }),
  Institucion: a
    .model({
      nombreInstitucion: a.string().required(),
      municipio: a.belongsTo('Municipio', 'municipioId'),
      municipioId: a.id(),
      capacitaciones: a.hasMany('Capacitacion', 'institucionId'),
    })
    .authorization(allow => [
      allow.groups(["EDITORS"]).to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "update", "delete", "read"]),
      allow.guest().to(["read"]),
    ]),

  Asistente: a
    .model({
      nombre: a.string().required(),
      apellido: a.string().required(),
      correo: a.string().required(),
      telefono: a.string(),
      capacitacione: a.belongsTo('Capacitacion', 'capacitacionId'),
      capacitacionId: a.id(),
      ipAddress: a.string(),
    })
    .authorization(allow => [
      allow.groups(["ADMINS"]).to(['read', 'update', 'delete']),
      allow.guest().to(["create"]),
    ]),
  Tema: a
    .model({
      nombreTema: a.string().required(),
      descripcion: a.string().required(),
      capacitaciones: a.hasMany('Capacitacion', 'temaId'),
    })
    .authorization(allow => [
      allow.groups(["EDITORS"]).to(["read"]),
      allow.groups(["ADMINS"]).to(["create", "update", "delete", "read"]),
      allow.guest().to(["read"]),
    ]),
  Zona: a
    .enum(["RURAL", "URBANA"]),
  Linea: a
    .enum(["EL_AMOR_PROPIO_ES_LA_CLAVE", "VIDA_CON_SENTIDO", "CONSTRUYENDO_RESPETO", "TU_VIDA_ES_TU_ELECCION", "ESCUELAS_DE_FORMACION", "RECREACION", "FORTALECIMIENTO_FAMILIAR"]),
  Poblacion: a
    .enum(["N_N_A", "PADRES", "DOCENTES", "AUTORIDADES", "N_N_A_Y_PADRES", "DOCENTES_Y_AUTORIDADES", "OTROS", "JOVENES_SRPA", "PADRES_Y_DOCENTES", "N_N_A_Y_DOCENTES"]),
  TipoIntervencion: a
    .enum(["CIUDADES", "MUNICIPIOS", "GESTION_CONOCIMIENTO", "ENCUENTROS", "PROCESOS", "ESCUELA_DE_FORMACION", "CENTROS_DE_INTERES", "RECREACION", "CINE", "TEATRO"]),
  RangoEdad: a
    .enum(["CERO_A_CINCO", "SEIS_A_DIEZ", "ONCE_A_DIECISIETE", "DIECIOCHO_O_MAS"]),
  GrupoPoblacional: a
    .enum(["N_A", "CON_DISCAPACIDAD", "MIGRANTE", "INDIGENA", "AFRO", "VICTIMA"]),
  Capacitacion: a
    .model({
      descripcion: a.string().required(),
      fechaInicio: a.string().required(),
      fechaFin: a.string(),
      asistentes: a.hasMany('Asistente', 'capacitacionId'),
      institucion: a.belongsTo('Institucion', 'institucionId'),
      institucionId: a.id(),
      tema: a.belongsTo('Tema', 'temaId'),
      temaId: a.id(),
      zona: a.ref('Zona'),
      linea: a.ref('Linea'),
      poblacion: a.ref('Poblacion'),
      tipoIntervencion: a.ref('TipoIntervencion'),
      rangoEdad: a.ref('RangoEdad'),
      totalMujeres: a.integer(),
      totalHombres: a.integer(),
      totalOtro: a.integer(),
      grupoPoblacional: a.ref('GrupoPoblacional'),
      personasGrupoPoblacional: a.customType({
        discapacidad: a.integer(),
        migrante: a.integer(),
        indigena: a.integer(),
        afro: a.integer(),
        victima: a.integer(),
      }),
      observaciones: a.string(),
    })
    .authorization(allow => [
      allow.owner(),
      allow.groups(["ADMINS"]).to(["read", "delete"]),
      allow.guest().to(["read"]),
    ]),
  AllowedEmails: a
    .model({
      email: a.string().required(),
    })
    .authorization(allow => [
      allow.groups(["ADMINS"]).to(["create", "update", "delete", "read"]),
      allow.guest().to(["read"]),
    ]),
  addUserToGroup: a
    .mutation()
    .arguments({
      userId: a.string().required(),
      groupName: a.string().required(),
    })
    .authorization((allow) => [allow.group("ADMINS")])
    .handler(a.handler.function(addUserToGroup))
    .returns(a.json()),
  listUsers: a
    .query()
    .returns(a.ref('UsersResponse'))
    .authorization((allow) => [allow.group("ADMINS")])
    .handler(a.handler.function(listUsersHandler)),
  getUserInfo: a
    .query()
    .arguments({
      accessToken: a.string().required(),
    })
    .authorization((allow) => [allow.authenticated()])
    .returns(a.ref('UserInfoResponse'))
    .handler(a.handler.function(getUserInfo)),
  UserStateChange: a
    .customType({
      username: a.string(),
      enabled: a.boolean(),
    }),
  activateDeactivateUser: a
    .mutation()
    .arguments({
      username: a.string().required(),
      enable: a.boolean().required(),
    })
    .authorization((allow) => [allow.group("ADMINS")])
    .handler(a.handler.function(activateDeactivateUser))
    .returns(a.json()),
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