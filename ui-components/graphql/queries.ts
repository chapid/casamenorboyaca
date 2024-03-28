/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getAsistente = /* GraphQL */ `
  query GetAsistente($id: ID!) {
    getAsistente(id: $id) {
      apellido
      capacitacionAsistentesId
      capacitacione {
        createdAt
        descripcion
        fechaFin
        fechaInicio
        id
        owner
        temaCapacitacionesId
        updatedAt
        __typename
      }
      correo
      createdAt
      id
      institucionAsistentesId
      instituciones {
        createdAt
        id
        municipioInstitucionesId
        nombreInstitucion
        owner
        updatedAt
        __typename
      }
      nombre
      telefono
      updatedAt
      __typename
    }
  }
`;
export const getCapacitacion = /* GraphQL */ `
  query GetCapacitacion($id: ID!) {
    getCapacitacion(id: $id) {
      asistentes {
        nextToken
        __typename
      }
      createdAt
      descripcion
      fechaFin
      fechaInicio
      id
      owner
      temaCapacitacionesId
      temas {
        nextToken
        __typename
      }
      updatedAt
      __typename
    }
  }
`;
export const getInstitucion = /* GraphQL */ `
  query GetInstitucion($id: ID!) {
    getInstitucion(id: $id) {
      asistentes {
        nextToken
        __typename
      }
      createdAt
      id
      municipio {
        createdAt
        id
        nombreMunicipio
        owner
        updatedAt
        __typename
      }
      municipioInstitucionesId
      nombreInstitucion
      owner
      updatedAt
      __typename
    }
  }
`;
export const getMunicipio = /* GraphQL */ `
  query GetMunicipio($id: ID!) {
    getMunicipio(id: $id) {
      createdAt
      id
      instituciones {
        nextToken
        __typename
      }
      nombreMunicipio
      owner
      updatedAt
      __typename
    }
  }
`;
export const getTema = /* GraphQL */ `
  query GetTema($id: ID!) {
    getTema(id: $id) {
      capacitacionTemasId
      capacitaciones {
        nextToken
        __typename
      }
      createdAt
      descripcion
      id
      nombreTema
      owner
      updatedAt
      __typename
    }
  }
`;
export const listAsistentes = /* GraphQL */ `
  query ListAsistentes(
    $filter: ModelAsistenteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAsistentes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        apellido
        capacitacionAsistentesId
        correo
        createdAt
        id
        institucionAsistentesId
        nombre
        telefono
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listCapacitacions = /* GraphQL */ `
  query ListCapacitacions(
    $filter: ModelCapacitacionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCapacitacions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        descripcion
        fechaFin
        fechaInicio
        id
        owner
        temaCapacitacionesId
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listInstitucions = /* GraphQL */ `
  query ListInstitucions(
    $filter: ModelInstitucionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listInstitucions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        id
        municipioInstitucionesId
        nombreInstitucion
        owner
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listMunicipios = /* GraphQL */ `
  query ListMunicipios(
    $filter: ModelMunicipioFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMunicipios(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        createdAt
        id
        nombreMunicipio
        owner
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const listTemas = /* GraphQL */ `
  query ListTemas(
    $filter: ModelTemaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTemas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        capacitacionTemasId
        createdAt
        descripcion
        id
        nombreTema
        owner
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
