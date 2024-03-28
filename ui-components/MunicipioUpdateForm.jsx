/* eslint-disable */
"use client";
import * as React from "react";
import { Button, Flex, Grid, TextField } from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { getMunicipio } from "./graphql/queries";
import { updateMunicipio } from "./graphql/mutations";
const client = generateClient();
export default function MunicipioUpdateForm(props) {
  const {
    id: idProp,
    municipio: municipioModelProp,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    nombreMunicipio: "",
  };
  const [nombreMunicipio, setNombreMunicipio] = React.useState(
    initialValues.nombreMunicipio
  );
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    const cleanValues = municipioRecord
      ? { ...initialValues, ...municipioRecord }
      : initialValues;
    setNombreMunicipio(cleanValues.nombreMunicipio);
    setErrors({});
  };
  const [municipioRecord, setMunicipioRecord] =
    React.useState(municipioModelProp);
  React.useEffect(() => {
    const queryData = async () => {
      const record = idProp
        ? (
            await client.graphql({
              query: getMunicipio.replaceAll("__typename", ""),
              variables: { id: idProp },
            })
          )?.data?.getMunicipio
        : municipioModelProp;
      setMunicipioRecord(record);
    };
    queryData();
  }, [idProp, municipioModelProp]);
  React.useEffect(resetStateValues, [municipioRecord]);
  const validations = {
    nombreMunicipio: [],
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
          nombreMunicipio: nombreMunicipio ?? null,
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
            query: updateMunicipio.replaceAll("__typename", ""),
            variables: {
              input: {
                id: municipioRecord.id,
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
      {...getOverrideProps(overrides, "MunicipioUpdateForm")}
      {...rest}
    >
      <TextField
        label="Nombre municipio"
        isRequired={false}
        isReadOnly={false}
        value={nombreMunicipio}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              nombreMunicipio: value,
            };
            const result = onChange(modelFields);
            value = result?.nombreMunicipio ?? value;
          }
          if (errors.nombreMunicipio?.hasError) {
            runValidationTasks("nombreMunicipio", value);
          }
          setNombreMunicipio(value);
        }}
        onBlur={() => runValidationTasks("nombreMunicipio", nombreMunicipio)}
        errorMessage={errors.nombreMunicipio?.errorMessage}
        hasError={errors.nombreMunicipio?.hasError}
        {...getOverrideProps(overrides, "nombreMunicipio")}
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
          isDisabled={!(idProp || municipioModelProp)}
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
              !(idProp || municipioModelProp) ||
              Object.values(errors).some((e) => e?.hasError)
            }
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
