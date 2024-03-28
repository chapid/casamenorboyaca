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
export declare type TemaCreateFormInputValues = {
    nombreTema?: string;
    descripcion?: string;
};
export declare type TemaCreateFormValidationValues = {
    nombreTema?: ValidationFunction<string>;
    descripcion?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TemaCreateFormOverridesProps = {
    TemaCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    nombreTema?: PrimitiveOverrideProps<TextFieldProps>;
    descripcion?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TemaCreateFormProps = React.PropsWithChildren<{
    overrides?: TemaCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: TemaCreateFormInputValues) => TemaCreateFormInputValues;
    onSuccess?: (fields: TemaCreateFormInputValues) => void;
    onError?: (fields: TemaCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TemaCreateFormInputValues) => TemaCreateFormInputValues;
    onValidate?: TemaCreateFormValidationValues;
} & React.CSSProperties>;
export default function TemaCreateForm(props: TemaCreateFormProps): React.ReactElement;
