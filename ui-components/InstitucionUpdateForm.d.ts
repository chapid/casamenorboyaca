import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Institucion } from "./graphql/types";
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
export declare type InstitucionUpdateFormInputValues = {
    nombreInstitucion?: string;
};
export declare type InstitucionUpdateFormValidationValues = {
    nombreInstitucion?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type InstitucionUpdateFormOverridesProps = {
    InstitucionUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    nombreInstitucion?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type InstitucionUpdateFormProps = React.PropsWithChildren<{
    overrides?: InstitucionUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    institucion?: Institucion;
    onSubmit?: (fields: InstitucionUpdateFormInputValues) => InstitucionUpdateFormInputValues;
    onSuccess?: (fields: InstitucionUpdateFormInputValues) => void;
    onError?: (fields: InstitucionUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: InstitucionUpdateFormInputValues) => InstitucionUpdateFormInputValues;
    onValidate?: InstitucionUpdateFormValidationValues;
} & React.CSSProperties>;
export default function InstitucionUpdateForm(props: InstitucionUpdateFormProps): React.ReactElement;
