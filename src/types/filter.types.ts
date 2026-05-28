export type FilterType =
    | "text"
    | "number"
    | "currency"
    | "date"
    | "select"
    | "multiSelect"
    | "boolean";

export type FilterValue =
    | string
    | number
    | boolean
    | string[]
    | {
          min?: string;
          max?: string;
          start?: string;
          end?: string;
      };

export interface FilterField {
    key: string;
    label: string;
    type: FilterType;
    options?: string[];
}

export interface FilterCondition {
    id: string;
    field: string;
    operator: string;
    value: FilterValue;
}
