import type { FilterCondition } from "../types/filter.types";
import { getNestedValue } from "./getNestedValue";

const isRange = (
    value: FilterCondition["value"] | undefined
): value is {
    min?: string;
    max?: string;
    start?: string;
    end?: string;
} => typeof value === "object" && !Array.isArray(value);

const hasFilterValue = (filter: FilterCondition) => {
    if (!filter?.field || !filter?.operator) return false;

    if (Array.isArray(filter?.value)) {
        return filter?.value?.length > 0;
    }

    if (isRange(filter?.value)) {
        return Boolean(
            filter?.value?.min ||
            filter?.value?.max ||
            filter?.value?.start ||
            filter?.value?.end
        );
    }

    return filter?.value !== "" && filter?.value !== null;
};

const normalizeText = (value: unknown) =>
    String(value ?? "")?.toLowerCase();

const toNumber = (value: unknown) => {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : null;
};

const toTime = (value: unknown) => {
    const parsed = new Date(String(value))?.getTime();

    return Number.isFinite(parsed) ? parsed : null;
};

const matchFilter = (
    itemValue: unknown,
    filter: FilterCondition
) => {
    const textValue = normalizeText(itemValue);
    const filterText = normalizeText(filter?.value);
    const numericValue = toNumber(itemValue);
    const filterNumber = toNumber(filter?.value);

    switch (filter?.operator) {

        case "contains":
            return textValue?.includes(filterText);

        case "doesNotContain":
            return !textValue?.includes(filterText);

        case "startsWith":
            return textValue?.startsWith(filterText);

        case "endsWith":
            return textValue?.endsWith(filterText);

        case "equals":
            if (numericValue !== null && filterNumber !== null) {
                return numericValue === filterNumber;
            }

            return textValue === filterText;

        case "greaterThan":
            return (
                numericValue !== null &&
                filterNumber !== null &&
                numericValue > filterNumber
            );

        case "lessThan":
            return (
                numericValue !== null &&
                filterNumber !== null &&
                numericValue < filterNumber
            );

        case "greaterThanOrEqual":
            return (
                numericValue !== null &&
                filterNumber !== null &&
                numericValue >= filterNumber
            );

        case "lessThanOrEqual":
            return (
                numericValue !== null &&
                filterNumber !== null &&
                numericValue <= filterNumber
            );

        case "between": {
            if (!isRange(filter?.value)) return true;

            const min = toNumber(filter?.value?.min);
            const max = toNumber(filter?.value?.max);
            const start = toTime(filter?.value?.start);
            const end = toTime(filter?.value?.end);
            const itemTime = toTime(itemValue);

            if (start !== null || end !== null) {
                return (
                    itemTime !== null &&
                    (start === null || itemTime >= start) &&
                    (end === null || itemTime <= end)
                );
            }

            return (
                numericValue !== null &&
                (min === null || numericValue >= min) &&
                (max === null || numericValue <= max)
            );
        }

        case "is":
            return itemValue === filter?.value;

        case "isNot":
            return itemValue !== filter?.value;

        case "in":
            return (
                Array.isArray(filter?.value) &&
                Array.isArray(itemValue) &&
                filter?.value?.some((value) =>
                    itemValue?.includes(value)
                )
            );

        case "notIn":
            return (
                Array.isArray(filter?.value) &&
                Array.isArray(itemValue) &&
                filter?.value?.every(
                    (value) => !itemValue?.includes(value)
                )
            );

        default:
            return true;
    }
};

const groupFiltersByField = (filters: FilterCondition[]) =>
    filters?.reduce(
        (grouped, filter) => {
            const fieldFilters =
                grouped?.get(filter?.field) || [];

            fieldFilters?.push(filter);
            grouped?.set(filter?.field, fieldFilters);

            return grouped;
        },
        new Map<string, FilterCondition[]>()
    );

const isExclusionOperator = (operator: string) =>
    ["doesNotContain", "isNot", "notIn"]?.includes(operator);

const matchFieldFilters = (
    itemValue: unknown,
    filters: FilterCondition[]
) => {
    const exclusionFilters = filters?.filter((filter) =>
        isExclusionOperator(filter?.operator)
    );
    const inclusionFilters = filters?.filter(
        (filter) => !isExclusionOperator(filter?.operator)
    );

    const passesExclusions = exclusionFilters?.every((filter) =>
        matchFilter(itemValue, filter)
    );
    const passesInclusions =
        inclusionFilters?.length === 0 ||
        inclusionFilters?.some((filter) =>
            matchFilter(itemValue, filter)
        );

    return passesExclusions && passesInclusions;
};

export const applyFilters = <T extends object>(
    data: T[],
    filters: FilterCondition[]
) => {
    const activeFilters = filters?.filter(hasFilterValue);
    const filtersByField = groupFiltersByField(activeFilters);

    // Different fields are AND. Same-field inclusions are OR, exclusions are AND.
    return data?.filter((item) =>
        [...filtersByField.entries()]?.every(
            ([field, fieldFilters]) => {
                const itemValue = getNestedValue(
                    item as Record<string, unknown>,
                    field
                );

                return matchFieldFilters(
                    itemValue,
                    fieldFilters
                );
            }
        )
    );
};
