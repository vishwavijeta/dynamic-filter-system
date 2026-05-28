# Dynamic Filter System

Reusable React + TypeScript filter builder for client-side data tables. The filter UI is driven by field configuration, so a table can swap in a different schema without changing the filter components.

## Setup

```bash
npm install
npm run dev
```

Build and lint:

```bash
npm run build
npm run lint
```

## What Is Included

- Configuration-driven field definitions in `src/config/employeeFilters.ts`
- 60 local employee records in `src/data/employees.json`
- Text, number, currency, date, select, multi-select, and boolean inputs
- Dynamic operator lists per field type
- Real-time client-side filtering
- AND logic across different fields, OR logic for multiple filters on the same field
- Dot-notation nested field support, such as `address.city`
- Sortable table with filtered/total counts and empty-state handling

## Component Usage

```tsx
<FilterBuilder
  filters={filters}
  setFilters={setFilters}
  fields={employeeFilters}
/>
```

Each filter field is configured externally:

```ts
{
  key: "address.city",
  label: "City",
  type: "select",
  options: ["San Francisco", "New York", "Chicago"]
}
```

Filtering is applied with:

```ts
const filteredData = applyFilters(data, filters);
```
