export interface AlDynamicFormContolElementOptions {
    label: string;
    value: string;
}

export interface AlDynamicFormContolElement {
    updateNotAllowed?: boolean;
    type: string;
    property: string;
    label: string;
    secret?: string;
    description?: string;
    defaultValue?: string | string[] | boolean;
    validationPattern?: string;
    optional?: boolean;
    options?: AlDynamicFormContolElementOptions[];
}
