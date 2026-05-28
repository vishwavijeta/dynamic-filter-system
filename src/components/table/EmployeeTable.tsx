import { useMemo, useState } from "react";

import {
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Typography,
    TableContainer,
    TableSortLabel,
    Box,
    Chip,
    Button,
} from "@mui/material";

import { Download } from "lucide-react";

import type { Employee } from "../../types/employee.types";
import { getNestedValue } from "../../utils/getNestedValue";

interface Props {
    data: Employee[];
    totalRecords: number;
}

type SortDirection = "asc" | "desc";

const columns = [
    { key: "name", label: "Name" },
    { key: "department", label: "Department" },
    { key: "role", label: "Role" },
    { key: "salary", label: "Salary" },
    { key: "joinDate", label: "Joined" },
    { key: "address.city", label: "City" },
    { key: "skills", label: "Skills", sortable: false },
    { key: "performanceRating", label: "Rating" },
    { key: "isActive", label: "Active" },
];

const getExportValue = (
    employee: Employee,
    key: string
) => {
    const value = getNestedValue(
        employee as unknown as Record<string, unknown>,
        key
    );

    if (Array.isArray(value)) {
        return value.join("; ");
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return String(value ?? "");
};

const escapeCsvCell = (value: string) => {
    const escaped = value.replace(/"/g, '""');

    return /[",\n\r]/.test(escaped)
        ? `"${escaped}"`
        : escaped;
};

const downloadFile = (
    fileName: string,
    content: string,
    type: string
) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
};

const formatValue = (
    employee: Employee,
    key: string
) => {
    const value = getNestedValue(
        employee as unknown as Record<string, unknown>,
        key
    );

    if (key === "salary" && typeof value === "number") {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }).format(value);
    }

    if (key === "skills" && Array.isArray(value)) {
        return (
            <Box
                sx={{
                    display: "flex",
                    gap: 0.5,
                    flexWrap: "wrap",
                    minWidth: 180,
                }}
            >
                {value.map((skill) => (
                    <Chip
                        key={String(skill)}
                        label={String(skill)}
                        size="small"
                    />
                ))}
            </Box>
        );
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return String(value ?? "");
};

const EmployeeTable = ({
    data,
    totalRecords,
}: Props) => {
    const [sortKey, setSortKey] = useState("name");
    const [sortDirection, setSortDirection] =
        useState<SortDirection>("asc");

    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const aValue = getNestedValue(
                a as unknown as Record<string, unknown>,
                sortKey
            );
            const bValue = getNestedValue(
                b as unknown as Record<string, unknown>,
                sortKey
            );

            const comparison =
                typeof aValue === "number" &&
                typeof bValue === "number"
                    ? aValue - bValue
                    : String(aValue ?? "").localeCompare(
                          String(bValue ?? "")
                      );

            return sortDirection === "asc"
                ? comparison
                : -comparison;
        });
    }, [data, sortDirection, sortKey]);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection((current) =>
                current === "asc" ? "desc" : "asc"
            );
            return;
        }

        setSortKey(key);
        setSortDirection("asc");
    };

    const handleExportCsv = () => {
        const header = columns.map((column) =>
            escapeCsvCell(column.label)
        );
        const rows = sortedData.map((employee) =>
            columns.map((column) =>
                escapeCsvCell(
                    getExportValue(employee, column.key)
                )
            )
        );
        const csv = [header, ...rows]
            .map((row) => row.join(","))
            .join("\n");

        downloadFile(
            "filtered-employees.csv",
            csv,
            "text/csv;charset=utf-8"
        );
    };

    return (
        <Paper sx={{ p: 2 }}>

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
                    Records: {data.length} of {totalRecords}
                </Typography>

                <Button
                    variant="outlined"
                    startIcon={<Download size={18} />}
                    disabled={sortedData.length === 0}
                    onClick={handleExportCsv}
                >
                    Export CSV
                </Button>
            </Box>

            <TableContainer>
                <Table size="small">

                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell key={column.key}>
                                {column.sortable === false ? (
                                    column.label
                                ) : (
                                    <TableSortLabel
                                        active={
                                            sortKey === column.key
                                        }
                                        direction={
                                            sortKey === column.key
                                                ? sortDirection
                                                : "asc"
                                        }
                                        onClick={() =>
                                            handleSort(column.key)
                                        }
                                    >
                                        {column.label}
                                    </TableSortLabel>
                                )}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>

                    {sortedData.map((employee) => (

                        <TableRow key={employee.id}>
                            {columns.map((column) => (
                                <TableCell key={column.key}>
                                    {formatValue(
                                        employee,
                                        column.key
                                    )}
                                </TableCell>
                            ))}

                        </TableRow>
                    ))}

                    {sortedData.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length}
                                align="center"
                                sx={{ py: 6 }}
                            >
                                No results
                            </TableCell>
                        </TableRow>
                    )}

                </TableBody>

                </Table>
            </TableContainer>

        </Paper>
    );
};

export default EmployeeTable;
