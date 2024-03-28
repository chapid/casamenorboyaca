import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type AsistenteCreateFormInputValues = {
    nombre?: string;
    apellido?: string;
    correo?: string;
    telefono?: string;
};
export declare type AsistenteCreateFormValidationValues = {
    nombre?: ValidationFunction<string>;
    apellido?: ValidationFunction<string>;
    correo?: ValidationFunction<string>;
    telefono?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AsistenteCreateFormOverridesProps = {
    AsistenteCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    nombre?: PrimitiveOverrideProps<TextFieldProps>;
    apellido?: PrimitiveOverrideProps<TextFieldProps>;
    correo?: PrimitiveOverrideProps<TextFieldProps>;
    telefono?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AsistenteCreateFormProps = React.PropsWithChildren<{
    overrides?: AsistenteCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: AsistenteCreateFormInputValues) => AsistenteCreateFormInputValues;
    onSuccess?: (fields: AsistenteCreateFormInputValues) => void;
    onError?: (fields: AsistenteCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AsistenteCreateFormInputValues) => AsistenteCreateFormInputValues;
    onValidate?: AsistenteCreateFormValidationValues;
} & React.CSSProperties>;
export default function AsistenteCreateForm(props: AsistenteCreateFormProps): React.ReactElement;
