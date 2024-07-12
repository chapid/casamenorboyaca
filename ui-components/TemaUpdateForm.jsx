/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getTema } from "./graphql/queries";
import { updateTema } from "./graphql/mutations";
const client = generateClient();
export default function TemaUpdateForm(props) {
  const {
    id: idProp,
    tema: temaModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    nombreTema: "",
    descripcion: "",
  };
  const [nombreTema, setNombreTema] = React.useState(initialValues.nombreTema);
  const [descripcion, setDescripcion] = React.useState(
    initialValues.descripcion
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = temaRecord
      ? { ...initialValues, ...temaRecord }
      : initialValues;
    setNombreTema(cleanValues.nombreTema);
    setDescripcion(cleanValues.descripcion);
    setErrors({});
  };
  const [temaRecord, setTemaRecord] = React.useState(temaModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getTema.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getTema
        : temaModelProp;
      setTemaRecord(record);
    };
    queryData();
  }, [idProp, temaModelProp]);
  React.useEffect(resetStateValues, [temaRecord]);
  const validations = {
    nombreTema: [{ type: "Required" }],
    descripcion: [{ type: "Required" }],
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
          nombreTema,
          descripcion,
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
            query: updateTema.replaceAll("__typename", ""),
            variables: {
              input: {
                id: temaRecord.id,
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
      {...getOverrideProps(overrides, "TemaUpdateForm")}
      {...rest}
    >
      <TextField
        label="Nombre tema"
        isRequired={true}
        isReadOnly={false}
        value={nombreTema}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nombreTema: value,
              descripcion,
            };
            const result = onChange(modelFields);
            value = result?.nombreTema ?? value;
          }
          if (errors.nombreTema?.hasError) {
            runValidationTasks("nombreTema", value);
          }
          setNombreTema(value);
        }}
        onBlur={() => runValidationTasks("nombreTema", nombreTema)}
        errorMessage={errors.nombreTema?.errorMessage}
        hasError={errors.nombreTema?.hasError}
        {...getOverrideProps(overrides, "nombreTema")}
      ></TextField>
      <TextField
        label="Descripcion"
        isRequired={true}
        isReadOnly={false}
        value={descripcion}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nombreTema,
              descripcion: value,
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
          isDisabled={!(idProp || temaModelProp)}
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
              !(idProp || temaModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
