import {
    Box,
    Button,
    Paper,
    Typography,
} from "@mui/material";

import { Plus, RotateCcw } from "lucide-react";

import { v4 as uuid } from "uuid";

import FilterRow from "./FilterRow";

import type {
    FilterCondition,
    FilterField,
    FilterValue,
} from "../../types/filter.types";

interface Props {
    filters: FilterCondition[];
    setFilters: React.Dispatch<
        React.SetStateAction<FilterCondition[]>
    >;
    fields: FilterField[];
}

const FilterBuilder = ({
    filters,
    setFilters,
    fields,
}: Props) => {

    const addFilter = () => {
        const firstField = fields?.[0];
        const firstOperator = firstField
            ? {
                  text: "contains",
                  number: "equals",
                  currency: "between",
                  date: "between",
                  select: "is",
                  multiSelect: "in",
                  boolean: "is",
              }[firstField?.type]
            : "";

        setFilters((prev) => [
            ...prev,
            {
                id: uuid(),
                field: firstField?.key || "",
                operator: firstOperator,
                value: "",
            },
        ]);
    };

    const updateFilter = (
        id: string,
        key: keyof FilterCondition,
        value: FilterValue | string
    ) => {

        setFilters((prev) =>
            prev?.map((filter) =>
                filter?.id === id
                    ? {
                        ...filter,
                        [key]: value,
                    }
                    : filter
            )
        );
    };

    const deleteFilter = (
        id: string
    ) => {

        setFilters((prev) =>
            prev?.filter(
                (filter) => filter?.id !== id
            )
        );
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: {
                        xs: "column",
                        sm: "row",
                    },
                    alignItems: {
                        xs: "stretch",
                        sm: "center",
                    },
                    justifyContent: "space-between",
                    gap: 2,
                    mb: 2,
                }}
            >
                <Typography variant="h6">
                    Filters
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        gap: 1,
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={<RotateCcw size={18} />}
                        disabled={filters?.length === 0}
                        onClick={() => setFilters([])}
                    >
                        Clear All
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={addFilter}
                    >
                        Add Filter
                    </Button>
                </Box>
            </Box>

            {filters?.map((filter) => (
                <FilterRow
                    key={filter?.id}
                    filter={filter}
                    fields={fields}
                    onChange={updateFilter}
                    onDelete={deleteFilter}
                />
            ))}

            {filters?.length === 0 && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    Add a filter to narrow the table.
                </Typography>
            )}

        </Paper>
    );
};

export default FilterBuilder;
