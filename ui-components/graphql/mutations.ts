/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAsistente = /* GraphQL */ `
  mutation CreateAsistente(
    $condition: ModelAsistenteConditionInput
    $input: CreateAsistenteInput!
  ) {
    createAsistente(condition: $condition, input: $input) {
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
export const createCapacitacion = /* GraphQL */ `
  mutation CreateCapacitacion(
    $condition: ModelCapacitacionConditionInput
    $input: CreateCapacitacionInput!
  ) {
    createCapacitacion(condition: $condition, input: $input) {
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
export const createInstitucion = /* GraphQL */ `
  mutation CreateInstitucion(
    $condition: ModelInstitucionConditionInput
    $input: CreateInstitucionInput!
  ) {
    createInstitucion(condition: $condition, input: $input) {
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
export const createMunicipio = /* GraphQL */ `
  mutation CreateMunicipio(
    $condition: ModelMunicipioConditionInput
    $input: CreateMunicipioInput!
  ) {
    createMunicipio(condition: $condition, input: $input) {
      createdAt
      id
      instituciones {
        nextToken
        __typename
      }
      nombreMunicipio
      updatedAt
      __typename
    }
  }
`;
export const createTema = /* GraphQL */ `
  mutation CreateTema(
    $condition: ModelTemaConditionInput
    $input: CreateTemaInput!
  ) {
    createTema(condition: $condition, input: $input) {
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
export const deleteAsistente = /* GraphQL */ `
  mutation DeleteAsistente(
    $condition: ModelAsistenteConditionInput
    $input: DeleteAsistenteInput!
  ) {
    deleteAsistente(condition: $condition, input: $input) {
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
export const deleteCapacitacion = /* GraphQL */ `
  mutation DeleteCapacitacion(
    $condition: ModelCapacitacionConditionInput
    $input: DeleteCapacitacionInput!
  ) {
    deleteCapacitacion(condition: $condition, input: $input) {
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
export const deleteInstitucion = /* GraphQL */ `
  mutation DeleteInstitucion(
    $condition: ModelInstitucionConditionInput
    $input: DeleteInstitucionInput!
  ) {
    deleteInstitucion(condition: $condition, input: $input) {
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
export const deleteMunicipio = /* GraphQL */ `
  mutation DeleteMunicipio(
    $condition: ModelMunicipioConditionInput
    $input: DeleteMunicipioInput!
  ) {
    deleteMunicipio(condition: $condition, input: $input) {
      createdAt
      id
      instituciones {
        nextToken
        __typename
      }
      nombreMunicipio
      updatedAt
      __typename
    }
  }
`;
export const deleteTema = /* GraphQL */ `
  mutation DeleteTema(
    $condition: ModelTemaConditionInput
    $input: DeleteTemaInput!
  ) {
    deleteTema(condition: $condition, input: $input) {
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
export const updateAsistente = /* GraphQL */ `
  mutation UpdateAsistente(
    $condition: ModelAsistenteConditionInput
    $input: UpdateAsistenteInput!
  ) {
    updateAsistente(condition: $condition, input: $input) {
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
export const updateCapacitacion = /* GraphQL */ `
  mutation UpdateCapacitacion(
    $condition: ModelCapacitacionConditionInput
    $input: UpdateCapacitacionInput!
  ) {
    updateCapacitacion(condition: $condition, input: $input) {
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
export const updateInstitucion = /* GraphQL */ `
  mutation UpdateInstitucion(
    $condition: ModelInstitucionConditionInput
    $input: UpdateInstitucionInput!
  ) {
    updateInstitucion(condition: $condition, input: $input) {
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
export const updateMunicipio = /* GraphQL */ `
  mutation UpdateMunicipio(
    $condition: ModelMunicipioConditionInput
    $input: UpdateMunicipioInput!
  ) {
    updateMunicipio(condition: $condition, input: $input) {
      createdAt
      id
      instituciones {
        nextToken
        __typename
      }
      nombreMunicipio
      updatedAt
      __typename
    }
  }
`;
export const updateTema = /* GraphQL */ `
  mutation UpdateTema(
    $condition: ModelTemaConditionInput
    $input: UpdateTemaInput!
  ) {
    updateTema(condition: $condition, input: $input) {
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
