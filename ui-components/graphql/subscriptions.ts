/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAsistente = /* GraphQL */ `
  subscription OnCreateAsistente(
    $filter: ModelSubscriptionAsistenteFilterInput
  ) {
    onCreateAsistente(filter: $filter) {
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
export const onCreateCapacitacion = /* GraphQL */ `
  subscription OnCreateCapacitacion(
    $filter: ModelSubscriptionCapacitacionFilterInput
    $owner: String
  ) {
    onCreateCapacitacion(filter: $filter, owner: $owner) {
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
export const onCreateInstitucion = /* GraphQL */ `
  subscription OnCreateInstitucion(
    $filter: ModelSubscriptionInstitucionFilterInput
    $owner: String
  ) {
    onCreateInstitucion(filter: $filter, owner: $owner) {
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
export const onCreateMunicipio = /* GraphQL */ `
  subscription OnCreateMunicipio(
    $filter: ModelSubscriptionMunicipioFilterInput
    $owner: String
  ) {
    onCreateMunicipio(filter: $filter, owner: $owner) {
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
export const onCreateTema = /* GraphQL */ `
  subscription OnCreateTema(
    $filter: ModelSubscriptionTemaFilterInput
    $owner: String
  ) {
    onCreateTema(filter: $filter, owner: $owner) {
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
export const onDeleteAsistente = /* GraphQL */ `
  subscription OnDeleteAsistente(
    $filter: ModelSubscriptionAsistenteFilterInput
  ) {
    onDeleteAsistente(filter: $filter) {
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
export const onDeleteCapacitacion = /* GraphQL */ `
  subscription OnDeleteCapacitacion(
    $filter: ModelSubscriptionCapacitacionFilterInput
    $owner: String
  ) {
    onDeleteCapacitacion(filter: $filter, owner: $owner) {
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
export const onDeleteInstitucion = /* GraphQL */ `
  subscription OnDeleteInstitucion(
    $filter: ModelSubscriptionInstitucionFilterInput
    $owner: String
  ) {
    onDeleteInstitucion(filter: $filter, owner: $owner) {
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
export const onDeleteMunicipio = /* GraphQL */ `
  subscription OnDeleteMunicipio(
    $filter: ModelSubscriptionMunicipioFilterInput
    $owner: String
  ) {
    onDeleteMunicipio(filter: $filter, owner: $owner) {
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
export const onDeleteTema = /* GraphQL */ `
  subscription OnDeleteTema(
    $filter: ModelSubscriptionTemaFilterInput
    $owner: String
  ) {
    onDeleteTema(filter: $filter, owner: $owner) {
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
export const onUpdateAsistente = /* GraphQL */ `
  subscription OnUpdateAsistente(
    $filter: ModelSubscriptionAsistenteFilterInput
  ) {
    onUpdateAsistente(filter: $filter) {
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
export const onUpdateCapacitacion = /* GraphQL */ `
  subscription OnUpdateCapacitacion(
    $filter: ModelSubscriptionCapacitacionFilterInput
    $owner: String
  ) {
    onUpdateCapacitacion(filter: $filter, owner: $owner) {
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
export const onUpdateInstitucion = /* GraphQL */ `
  subscription OnUpdateInstitucion(
    $filter: ModelSubscriptionInstitucionFilterInput
    $owner: String
  ) {
    onUpdateInstitucion(filter: $filter, owner: $owner) {
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
export const onUpdateMunicipio = /* GraphQL */ `
  subscription OnUpdateMunicipio(
    $filter: ModelSubscriptionMunicipioFilterInput
    $owner: String
  ) {
    onUpdateMunicipio(filter: $filter, owner: $owner) {
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
export const onUpdateTema = /* GraphQL */ `
  subscription OnUpdateTema(
    $filter: ModelSubscriptionTemaFilterInput
    $owner: String
  ) {
    onUpdateTema(filter: $filter, owner: $owner) {
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
