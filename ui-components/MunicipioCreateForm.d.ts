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
export declare type MunicipioCreateFormInputValues = {
    nombreMunicipio?: string;
};
export declare type MunicipioCreateFormValidationValues = {
    nombreMunicipio?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type MunicipioCreateFormOverridesProps = {
    MunicipioCreateFormGrid?: PrimitiveOverrideProps<GridProps>;
    nombreMunicipio?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type MunicipioCreateFormProps = React.PropsWithChildren<{
    overrides?: MunicipioCreateFormOverridesProps | undefined | null;
} & {
    clearOnSuccess?: boolean;
    onSubmit?: (fields: MunicipioCreateFormInputValues) => MunicipioCreateFormInputValues;
    onSuccess?: (fields: MunicipioCreateFormInputValues) => void;
    onError?: (fields: MunicipioCreateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: MunicipioCreateFormInputValues) => MunicipioCreateFormInputValues;
    onValidate?: MunicipioCreateFormValidationValues;
} & React.CSSProperties>;
export default function MunicipioCreateForm(props: MunicipioCreateFormProps): React.ReactElement;
