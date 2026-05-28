import {
    TextField,
    MenuItem,
    Switch,
    Autocomplete,
    Box,
    Checkbox,
    FormControlLabel,
    InputAdornment,
} from "@mui/material";

import type {
    FilterField,
    FilterValue,
} from "../../types/filter.types";

interface Props {
    field?: FilterField;
    operator: string;
    value: FilterValue;
    onChange: (value: FilterValue) => void;
}

const isRangeValue = (
    value: FilterValue
): value is {
    min?: string;
    max?: string;
    start?: string;
    end?: string;
} => typeof value === "object" && !Array.isArray(value);

const isInvalidNumber = (value?: string) =>
    value !== undefined &&
    value !== "" &&
    !Number.isFinite(Number(value));

const FilterInput = ({
    field,
    operator,
    value,
    onChange,
}: Props) => {

    if (!field) return null;

    const rangeValue = isRangeValue(value) ? value : {};

    const minIsInvalid = isInvalidNumber(rangeValue.min);
    const maxIsInvalid = isInvalidNumber(rangeValue.max);
    const rangeOrderIsInvalid =
        !minIsInvalid &&
        !maxIsInvalid &&
        rangeValue.min !== undefined &&
        rangeValue.min !== "" &&
        rangeValue.max !== undefined &&
        rangeValue.max !== "" &&
        Number(rangeValue.min) > Number(rangeValue.max);

    const renderNumberRange = (isCurrency = false) => (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
            }}
        >
            <TextField
                type="number"
                fullWidth
                label="Min"
                value={rangeValue.min || ""}
                error={minIsInvalid || rangeOrderIsInvalid}
                helperText={
                    rangeOrderIsInvalid
                        ? "Min must be less than max"
                        : ""
                }
                slotProps={{
                    input: isCurrency
                        ? {
                              startAdornment: (
                                  <InputAdornment position="start">
                                      $
                                  </InputAdornment>
                              ),
                          }
                        : undefined,
                    htmlInput: {
                        step: "any",
                    },
                }}
                onChange={(event) =>
                    onChange({
                        ...rangeValue,
                        min: event.target.value,
                    })
                }
            />
            <TextField
                type="number"
                fullWidth
                label="Max"
                value={rangeValue.max || ""}
                error={maxIsInvalid || rangeOrderIsInvalid}
                helperText={
                    rangeOrderIsInvalid
                        ? "Max must be greater than min"
                        : ""
                }
                slotProps={{
                    input: isCurrency
                        ? {
                              startAdornment: (
                                  <InputAdornment position="start">
                                      $
                                  </InputAdornment>
                              ),
                          }
                        : undefined,
                    htmlInput: {
                        step: "any",
                    },
                }}
                onChange={(event) =>
                    onChange({
                        ...rangeValue,
                        max: event.target.value,
                    })
                }
            />
        </Box>
    );

    const renderDateRange = () => (
        <Box
            sx={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 1,
            }}
        >
            <TextField
                type="date"
                fullWidth
                label="Start"
                value={rangeValue.start || ""}
                slotProps={{
                    inputLabel: { shrink: true },
                }}
                onChange={(event) =>
                    onChange({
                        ...rangeValue,
                        start: event.target.value,
                    })
                }
            />
            <TextField
                type="date"
                fullWidth
                label="End"
                value={rangeValue.end || ""}
                slotProps={{
                    inputLabel: { shrink: true },
                }}
                onChange={(event) =>
                    onChange({
                        ...rangeValue,
                        end: event.target.value,
                    })
                }
            />
        </Box>
    );

    switch (field.type) {

        case "text":
            return (
                <TextField
                    fullWidth
                    value={value || ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                />
            );

        case "number":
            if (operator === "between") return renderNumberRange();

            return (
                <TextField
                    type="number"
                    fullWidth
                    label="Value"
                    value={value || ""}
                    error={
                        typeof value === "string" &&
                        isInvalidNumber(value)
                    }
                    helperText={
                        typeof value === "string" &&
                        isInvalidNumber(value)
                            ? "Enter a valid number"
                            : ""
                    }
                    slotProps={{
                        htmlInput: {
                            step: "any",
                        },
                    }}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                />
            );

        case "currency":
            return renderNumberRange(true);

        case "date":
            if (operator === "between") {
                return renderDateRange();
            }

            if (operator === "last30Days") {
                return null;
            }

            return (
                <TextField
                    type="date"
                    fullWidth
                    label="Date"
                    value={typeof value === "string" ? value : ""}
                    slotProps={{
                        inputLabel: { shrink: true },
                    }}
                    onChange={(event) =>
                        onChange(event.target.value)
                    }
                />
            );

        case "select":
            return (
                <TextField
                    select
                    fullWidth
                    label="Value"
                    value={value || ""}
                    onChange={(e) =>
                        onChange(e.target.value)
                    }
                >
                    {field.options?.map((option) => (
                        <MenuItem
                            key={option}
                            value={option}
                        >
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
            );

        case "multiSelect":
            return (
                <Autocomplete
                    multiple
                    options={field.options || []}
                    disableCloseOnSelect
                    value={Array.isArray(value) ? value : []}
                    onChange={(_, newValue) =>
                        onChange(newValue)
                    }
                    renderOption={(props, option, { selected }) => {
                        const { key, ...optionProps } = props;

                        return (
                            <li
                                key={key}
                                {...optionProps}
                            >
                                <Checkbox
                                    checked={selected}
                                    sx={{ mr: 1 }}
                                />
                                {option}
                            </li>
                        );
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Values"
                        />
                    )}
                />
            );

        case "boolean":
            return (
                <FormControlLabel
                    control={
                        <Switch
                            checked={Boolean(value)}
                            onChange={(event) =>
                                onChange(event.target.checked)
                            }
                        />
                    }
                    label={value ? "True" : "False"}
                />
            );

        default:
            return null;
    }
};

export default FilterInput;
