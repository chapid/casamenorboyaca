import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Municipio } from "./graphql/types";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type MunicipioUpdateFormInputValues = {
    nombreMunicipio?: string;
};
export declare type MunicipioUpdateFormValidationValues = {
    nombreMunicipio?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MunicipioUpdateFormOverridesProps = {
    MunicipioUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    nombreMunicipio?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MunicipioUpdateFormProps = React.PropsWithChildren<{
    overrides?: MunicipioUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    municipio?: Municipio;
    onSubmit?: (fields: MunicipioUpdateFormInputValues) => MunicipioUpdateFormInputValues;
    onSuccess?: (fields: MunicipioUpdateFormInputValues) => void;
    onError?: (fields: MunicipioUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MunicipioUpdateFormInputValues) => MunicipioUpdateFormInputValues;
    onValidate?: MunicipioUpdateFormValidationValues;
} & React.CSSProperties>;
export default function MunicipioUpdateForm(props: MunicipioUpdateFormProps): React.ReactElement;
