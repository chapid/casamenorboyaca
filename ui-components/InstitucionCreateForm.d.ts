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
export declare type InstitucionCreateFormInputValues = {
    nombreInstitucion?: string;
};
export declare type InstitucionCreateFormValidationValues = {
    nombreInstitucion?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type InstitucionCreateFormOverridesProps = {
    InstitucionCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    nombreInstitucion?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type InstitucionCreateFormProps = React.PropsWithChildren<{
    overrides?: InstitucionCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: InstitucionCreateFormInputValues) => InstitucionCreateFormInputValues;
    onSuccess?: (fields: InstitucionCreateFormInputValues) => void;
    onError?: (fields: InstitucionCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: InstitucionCreateFormInputValues) => InstitucionCreateFormInputValues;
    onValidate?: InstitucionCreateFormValidationValues;
} & React.CSSProperties>;
export default function InstitucionCreateForm(props: InstitucionCreateFormProps): React.ReactElement;
