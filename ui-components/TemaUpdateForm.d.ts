import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Tema } from "./graphql/types";
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
export declare type TemaUpdateFormInputValues = {
    nombreTema?: string;
    descripcion?: string;
};
export declare type TemaUpdateFormValidationValues = {
    nombreTema?: ValidationFunction<string>;
    descripcion?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type TemaUpdateFormOverridesProps = {
    TemaUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    nombreTema?: PrimitiveOverrideProps<TextFieldProps>;
    descripcion?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type TemaUpdateFormProps = React.PropsWithChildren<{
    overrides?: TemaUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    tema?: Tema;
    onSubmit?: (fields: TemaUpdateFormInputValues) => TemaUpdateFormInputValues;
    onSuccess?: (fields: TemaUpdateFormInputValues) => void;
    onError?: (fields: TemaUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: TemaUpdateFormInputValues) => TemaUpdateFormInputValues;
    onValidate?: TemaUpdateFormValidationValues;
} & React.CSSProperties>;
export default function TemaUpdateForm(props: TemaUpdateFormProps): React.ReactElement;
