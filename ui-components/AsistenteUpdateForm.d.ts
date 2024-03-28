import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Asistente } from "./graphql/types";
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
export declare type AsistenteUpdateFormInputValues = {
    nombre?: string;
    apellido?: string;
    correo?: string;
    telefono?: string;
};
export declare type AsistenteUpdateFormValidationValues = {
    nombre?: ValidationFunction<string>;
    apellido?: ValidationFunction<string>;
    correo?: ValidationFunction<string>;
    telefono?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AsistenteUpdateFormOverridesProps = {
    AsistenteUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    nombre?: PrimitiveOverrideProps<TextFieldProps>;
    apellido?: PrimitiveOverrideProps<TextFieldProps>;
    correo?: PrimitiveOverrideProps<TextFieldProps>;
    telefono?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AsistenteUpdateFormProps = React.PropsWithChildren<{
    overrides?: AsistenteUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    asistente?: Asistente;
    onSubmit?: (fields: AsistenteUpdateFormInputValues) => AsistenteUpdateFormInputValues;
    onSuccess?: (fields: AsistenteUpdateFormInputValues) => void;
    onError?: (fields: AsistenteUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AsistenteUpdateFormInputValues) => AsistenteUpdateFormInputValues;
    onValidate?: AsistenteUpdateFormValidationValues;
} & React.CSSProperties>;
export default function AsistenteUpdateForm(props: AsistenteUpdateFormProps): React.ReactElement;
