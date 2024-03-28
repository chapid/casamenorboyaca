import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Capacitacion } from "./graphql/types";
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
export declare type CapacitacionUpdateFormInputValues = {
    descripcion?: string;
    fechaInicio?: string;
    fechaFin?: string;
};
export declare type CapacitacionUpdateFormValidationValues = {
    descripcion?: ValidationFunction<string>;
    fechaInicio?: ValidationFunction<string>;
    fechaFin?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CapacitacionUpdateFormOverridesProps = {
    CapacitacionUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    descripcion?: PrimitiveOverrideProps<TextFieldProps>;
    fechaInicio?: PrimitiveOverrideProps<TextFieldProps>;
    fechaFin?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CapacitacionUpdateFormProps = React.PropsWithChildren<{
    overrides?: CapacitacionUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    capacitacion?: Capacitacion;
    onSubmit?: (fields: CapacitacionUpdateFormInputValues) => CapacitacionUpdateFormInputValues;
    onSuccess?: (fields: CapacitacionUpdateFormInputValues) => void;
    onError?: (fields: CapacitacionUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CapacitacionUpdateFormInputValues) => CapacitacionUpdateFormInputValues;
    onValidate?: CapacitacionUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CapacitacionUpdateForm(props: CapacitacionUpdateFormProps): React.ReactElement;
