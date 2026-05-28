import { useMemo, useState } from "react";

import {
  Container,
  Typography,
} from "@mui/material";

import FilterBuilder from "./components/filters/FilterBuilder";

import EmployeeTable from "./components/table/EmployeeTable";

import { employeeFilters } from "./config/employeeFilters";

import employees from "./data/employees.json";

import type { Employee } from "./types/employee.types";
import type { FilterCondition } from "./types/filter.types";

import { applyFilters } from "./utils/applyFilters";

function App() {

  const [filters, setFilters] =
    useState<FilterCondition[]>([]);

  const filteredData = useMemo(() => {

    return applyFilters(
      employees as Employee[],
      filters
    );

  }, [filters]);

  return (

    <Container sx={{ mt: 5 }}>

      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Dynamic Filter System
      </Typography>

      <FilterBuilder
        filters={filters}
        setFilters={setFilters}
        fields={employeeFilters}
      />

      <EmployeeTable
        data={filteredData}
        totalRecords={employees?.length}
      />

    </Container>
  );
}

export default App;
