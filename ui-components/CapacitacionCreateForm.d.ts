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
export declare type CapacitacionCreateFormInputValues = {
    descripcion?: string;
    fechaInicio?: string;
    fechaFin?: string;
};
export declare type CapacitacionCreateFormValidationValues = {
    descripcion?: ValidationFunction<string>;
    fechaInicio?: ValidationFunction<string>;
    fechaFin?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CapacitacionCreateFormOverridesProps = {
    CapacitacionCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    descripcion?: PrimitiveOverrideProps<TextFieldProps>;
    fechaInicio?: PrimitiveOverrideProps<TextFieldProps>;
    fechaFin?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CapacitacionCreateFormProps = React.PropsWithChildren<{
    overrides?: CapacitacionCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: CapacitacionCreateFormInputValues) => CapacitacionCreateFormInputValues;
    onSuccess?: (fields: CapacitacionCreateFormInputValues) => void;
    onError?: (fields: CapacitacionCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CapacitacionCreateFormInputValues) => CapacitacionCreateFormInputValues;
    onValidate?: CapacitacionCreateFormValidationValues;
} & React.CSSProperties>;
export default function CapacitacionCreateForm(props: CapacitacionCreateFormProps): React.ReactElement;
