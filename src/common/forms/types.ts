export interface AlDynamicFormControlElementOptions {
    label: string;
    value: string;
    disabled?: boolean;
}

export interface AlDynamicFormControlInputResponderOptions {
    type?: 'input' | 'textarea' | 'dropdown';
    buttonLabel?: string;
    buttonTooltip?: string;
    options?: {
        group: string;
        description?: string;
        options: {
            label: string;
            description?: string;
            value: string;
        }[];
    }[];
}

export interface AlDynamicFormControlElement {
    updateNotAllowed?: boolean;
    type: string;
    property: string;
    label?: string;
    secret?: string;
    description?: string;
    descriptionOnUpdate?: string;
    defaultValue?: string | string[] | boolean | object | number ;
    validationPattern?: string;
    optional?: boolean;
    options?: AlDynamicFormControlElementOptions[];
    editorOptions?: any;
    responderOptions?: AlDynamicFormControlInputResponderOptions;
    placeholder?: string;
    aboveDescription?: string;
    belowDescription?: string;
    patternError?: string;
    requiredError?: string;
    minLengthError?: string;
    maxLengthError?: string;
    dataType?: string;
    joinExpresion?: string;
    splitExpresion?: RegExp | string;
    multiSelectOptions?: unknown;
    treeSelectOptions?: unknown;
    title?: string;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
    onNodeSelected?: (event: any) => void;
    onNodeUnselected?: (event: any) => void;
}
