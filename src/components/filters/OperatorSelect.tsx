import {
    MenuItem,
    TextField,
} from "@mui/material";

import type { FilterOperator } from "../../utils/operators";

interface Props {
    operators: FilterOperator[];
    value: string;
    onChange: (value: string) => void;
}

const OperatorSelect = ({
    operators,
    value,
    onChange,
}: Props) => {
    return (
        <TextField
            select
            fullWidth
            label="Operator"
            value={value}
            disabled={operators?.length === 0}
            onChange={(event) => onChange(event?.target?.value)}
        >
            {operators?.map((operator) => (
                <MenuItem
                    key={operator?.value}
                    value={operator?.value}
                >
                    {operator?.label}
                </MenuItem>
            ))}
        </TextField>
    );
};

export default OperatorSelect;
