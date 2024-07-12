/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getAsistente } from "./graphql/queries";
import { updateAsistente } from "./graphql/mutations";
const client = generateClient();
export default function AsistenteUpdateForm(props) {
  const {
    id: idProp,
    asistente: asistenteModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    nombre: "",
    apellido: "",
    correo: "",
    telefono: "",
  };
  const [nombre, setNombre] = React.useState(initialValues.nombre);
  const [apellido, setApellido] = React.useState(initialValues.apellido);
  const [correo, setCorreo] = React.useState(initialValues.correo);
  const [telefono, setTelefono] = React.useState(initialValues.telefono);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = asistenteRecord
      ? { ...initialValues, ...asistenteRecord }
      : initialValues;
    setNombre(cleanValues.nombre);
    setApellido(cleanValues.apellido);
    setCorreo(cleanValues.correo);
    setTelefono(cleanValues.telefono);
    setErrors({});
  };
  const [asistenteRecord, setAsistenteRecord] =
    React.useState(asistenteModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getAsistente.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getAsistente
        : asistenteModelProp;
      setAsistenteRecord(record);
    };
    queryData();
  }, [idProp, asistenteModelProp]);
  React.useEffect(resetStateValues, [asistenteRecord]);
  const validations = {
    nombre: [{ type: "Required" }],
    apellido: [{ type: "Required" }],
    correo: [{ type: "Required" }],
    telefono: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          nombre,
          apellido,
          correo,
          telefono: telefono ?? null,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: updateAsistente.replaceAll("__typename", ""),
            variables: {
              input: {
                id: asistenteRecord.id,
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "AsistenteUpdateForm")}
      {...rest}
    >
      <TextField
        label="Nombre"
        isRequired={true}
        isReadOnly={false}
        value={nombre}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nombre: value,
              apellido,
              correo,
              telefono,
            };
            const result = onChange(modelFields);
            value = result?.nombre ?? value;
          }
          if (errors.nombre?.hasError) {
            runValidationTasks("nombre", value);
          }
          setNombre(value);
        }}
        onBlur={() => runValidationTasks("nombre", nombre)}
        errorMessage={errors.nombre?.errorMessage}
        hasError={errors.nombre?.hasError}
        {...getOverrideProps(overrides, "nombre")}
      ></TextField>
      <TextField
        label="Apellido"
        isRequired={true}
        isReadOnly={false}
        value={apellido}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nombre,
              apellido: value,
              correo,
              telefono,
            };
            const result = onChange(modelFields);
            value = result?.apellido ?? value;
          }
          if (errors.apellido?.hasError) {
            runValidationTasks("apellido", value);
          }
          setApellido(value);
        }}
        onBlur={() => runValidationTasks("apellido", apellido)}
        errorMessage={errors.apellido?.errorMessage}
        hasError={errors.apellido?.hasError}
        {...getOverrideProps(overrides, "apellido")}
      ></TextField>
      <TextField
        label="Correo"
        isRequired={true}
        isReadOnly={false}
        value={correo}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nombre,
              apellido,
              correo: value,
              telefono,
            };
            const result = onChange(modelFields);
            value = result?.correo ?? value;
          }
          if (errors.correo?.hasError) {
            runValidationTasks("correo", value);
          }
          setCorreo(value);
        }}
        onBlur={() => runValidationTasks("correo", correo)}
        errorMessage={errors.correo?.errorMessage}
        hasError={errors.correo?.hasError}
        {...getOverrideProps(overrides, "correo")}
      ></TextField>
      <TextField
        label="Telefono"
        isRequired={false}
        isReadOnly={false}
        value={telefono}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nombre,
              apellido,
              correo,
              telefono: value,
            };
            const result = onChange(modelFields);
            value = result?.telefono ?? value;
          }
          if (errors.telefono?.hasError) {
            runValidationTasks("telefono", value);
          }
          setTelefono(value);
        }}
        onBlur={() => runValidationTasks("telefono", telefono)}
        errorMessage={errors.telefono?.errorMessage}
        hasError={errors.telefono?.hasError}
        {...getOverrideProps(overrides, "telefono")}
      ></TextField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Reset"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          isDisabled={!(idProp || asistenteModelProp)}
          {...getOverrideProps(overrides, "ResetButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={
              !(idProp || asistenteModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
