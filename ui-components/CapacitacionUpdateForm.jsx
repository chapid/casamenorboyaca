/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getCapacitacion } from "./graphql/queries";
import { updateCapacitacion } from "./graphql/mutations";
const client = generateClient();
export default function CapacitacionUpdateForm(props) {
  const {
    id: idProp,
    capacitacion: capacitacionModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    descripcion: "",
    fechaInicio: "",
    fechaFin: "",
  };
  const [descripcion, setDescripcion] = React.useState(
    initialValues.descripcion
  );
  const [fechaInicio, setFechaInicio] = React.useState(
    initialValues.fechaInicio
  );
  const [fechaFin, setFechaFin] = React.useState(initialValues.fechaFin);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = capacitacionRecord
      ? { ...initialValues, ...capacitacionRecord }
      : initialValues;
    setDescripcion(cleanValues.descripcion);
    setFechaInicio(cleanValues.fechaInicio);
    setFechaFin(cleanValues.fechaFin);
    setErrors({});
  };
  const [capacitacionRecord, setCapacitacionRecord] = React.useState(
    capacitacionModelProp
  );
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getCapacitacion.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getCapacitacion
        : capacitacionModelProp;
      setCapacitacionRecord(record);
    };
    queryData();
  }, [idProp, capacitacionModelProp]);
  React.useEffect(resetStateValues, [capacitacionRecord]);
  const validations = {
    descripcion: [{ type: "Required" }],
    fechaInicio: [{ type: "Required" }],
    fechaFin: [],
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
          descripcion,
          fechaInicio,
          fechaFin: fechaFin ?? null,
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
            query: updateCapacitacion.replaceAll("__typename", ""),
            variables: {
              input: {
                id: capacitacionRecord.id,
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
      {...getOverrideProps(overrides, "CapacitacionUpdateForm")}
      {...rest}
    >
      <TextField
        label="Descripcion"
        isRequired={true}
        isReadOnly={false}
        value={descripcion}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              descripcion: value,
              fechaInicio,
              fechaFin,
            };
            const result = onChange(modelFields);
            value = result?.descripcion ?? value;
          }
          if (errors.descripcion?.hasError) {
            runValidationTasks("descripcion", value);
          }
          setDescripcion(value);
        }}
        onBlur={() => runValidationTasks("descripcion", descripcion)}
        errorMessage={errors.descripcion?.errorMessage}
        hasError={errors.descripcion?.hasError}
        {...getOverrideProps(overrides, "descripcion")}
      ></TextField>
      <TextField
        label="Fecha inicio"
        isRequired={true}
        isReadOnly={false}
        value={fechaInicio}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              descripcion,
              fechaInicio: value,
              fechaFin,
            };
            const result = onChange(modelFields);
            value = result?.fechaInicio ?? value;
          }
          if (errors.fechaInicio?.hasError) {
            runValidationTasks("fechaInicio", value);
          }
          setFechaInicio(value);
        }}
        onBlur={() => runValidationTasks("fechaInicio", fechaInicio)}
        errorMessage={errors.fechaInicio?.errorMessage}
        hasError={errors.fechaInicio?.hasError}
        {...getOverrideProps(overrides, "fechaInicio")}
      ></TextField>
      <TextField
        label="Fecha fin"
        isRequired={false}
        isReadOnly={false}
        value={fechaFin}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              descripcion,
              fechaInicio,
              fechaFin: value,
            };
            const result = onChange(modelFields);
            value = result?.fechaFin ?? value;
          }
          if (errors.fechaFin?.hasError) {
            runValidationTasks("fechaFin", value);
          }
          setFechaFin(value);
        }}
        onBlur={() => runValidationTasks("fechaFin", fechaFin)}
        errorMessage={errors.fechaFin?.errorMessage}
        hasError={errors.fechaFin?.hasError}
        {...getOverrideProps(overrides, "fechaFin")}
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
          isDisabled={!(idProp || capacitacionModelProp)}
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
              !(idProp || capacitacionModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
