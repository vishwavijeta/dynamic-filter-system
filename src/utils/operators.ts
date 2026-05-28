import type { FilterType } from "../types/filter.types";

export interface FilterOperator {
    value: string;
    label: string;
}

export const operatorsByType: Record<FilterType, FilterOperator[]> = {
    text: [
        { value: "equals", label: "Equals" },
        { value: "contains", label: "Contains" },
        { value: "startsWith", label: "Starts With" },
        { value: "endsWith", label: "Ends With" },
        { value: "doesNotContain", label: "Does Not Contain" },
    ],

    number: [
        { value: "equals", label: "Equals" },
        { value: "greaterThan", label: "Greater Than" },
        { value: "lessThan", label: "Less Than" },
        { value: "greaterThanOrEqual", label: "Greater Than or Equal" },
        { value: "lessThanOrEqual", label: "Less Than or Equal" },
    ],

    currency: [{ value: "between", label: "Between" }],

    date: [{ value: "between", label: "Between" }],

    select: [
        { value: "is", label: "Is" },
        { value: "isNot", label: "Is Not" },
    ],

    multiSelect: [
        { value: "in", label: "In" },
        { value: "notIn", label: "Not In" },
    ],

    boolean: [{ value: "is", label: "Is" }],
};
