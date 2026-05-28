import {
    Box,
    TextField,
    MenuItem,
    IconButton,
    Tooltip,
} from "@mui/material";

import { Trash2 } from "lucide-react";

import type {
    FilterCondition,
    FilterField,
    FilterValue,
} from "../../types/filter.types";

import FilterInput from "./FilterInput";
import OperatorSelect from "./OperatorSelect";

import { operatorsByType } from "../../utils/operators";

interface Props {
    filter: FilterCondition;
    fields: FilterField[];
    onChange: (
        id: string,
        key: keyof FilterCondition,
        value: FilterValue | string
    ) => void;
    onDelete: (id: string) => void;
}

const FilterRow = ({
    filter,
    fields,
    onChange,
    onDelete,
}: Props) => {

    const selectedField = fields.find(
        (f) => f.key === filter.field
    );

    const operators =
        selectedField ? operatorsByType[selectedField.type] : [];

    const handleFieldChange = (fieldKey: string) => {
        const nextField = fields.find(
            (field) => field.key === fieldKey
        );
        const nextOperator = nextField
            ? operatorsByType[nextField.type][0]?.value || ""
            : "";

        onChange(filter.id, "field", fieldKey);
        onChange(filter.id, "operator", nextOperator);
        onChange(filter.id, "value", "");
    };

    return (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    md: "minmax(180px, 1fr) minmax(180px, 1fr) minmax(260px, 1.5fr) auto",
                },
                gap: 2,
                alignItems: "center",
                mb: 2,
            }}
        >

            <TextField
                select
                fullWidth
                label="Field"
                value={filter.field}
                onChange={(event) =>
                    handleFieldChange(event.target.value)
                }
            >
                {fields.map((field) => (
                    <MenuItem
                        key={field.key}
                        value={field.key}
                    >
                        {field.label}
                    </MenuItem>
                ))}
            </TextField>

            <OperatorSelect
                operators={operators}
                value={filter.operator}
                onChange={(value) => {
                    onChange(filter.id, "operator", value);
                    onChange(filter.id, "value", "");
                }}
            />

            <FilterInput
                field={selectedField}
                operator={filter.operator}
                value={filter.value}
                onChange={(value) =>
                    onChange(filter.id, "value", value)
                }
            />

            <Tooltip title="Remove filter">
                <IconButton
                    color="error"
                    onClick={() => onDelete(filter.id)}
                    aria-label="Remove filter"
                >
                    <Trash2 size={20} />
                </IconButton>
            </Tooltip>
        </Box>
    );
};

export default FilterRow;
