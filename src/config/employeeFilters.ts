import type { FilterField } from "../types/filter.types";

export const employeeFilters: FilterField[] = [
    {
        key: "name",
        label: "Name",
        type: "text",
    },
    {
        key: "email",
        label: "Email",
        type: "text",
    },
    {
        key: "department",
        label: "Department",
        type: "select",
        options: [
            "Engineering",
            "HR",
            "Finance",
            "Sales",
            "Product",
            "Design",
            "Operations",
        ],
    },
    {
        key: "role",
        label: "Role",
        type: "select",
        options: [
            "Developer",
            "Senior Developer",
            "Manager",
            "Analyst",
            "Designer",
            "Recruiter",
            "Sales Executive",
        ],
    },
    {
        key: "salary",
        label: "Salary",
        type: "currency",
    },
    {
        key: "joinDate",
        label: "Join Date",
        type: "date",
    },
    {
        key: "lastReview",
        label: "Last Review",
        type: "date",
    },
    {
        key: "projects",
        label: "Projects",
        type: "number",
    },
    {
        key: "performanceRating",
        label: "Performance Rating",
        type: "number",
    },
    {
        key: "skills",
        label: "Skills",
        type: "multiSelect",
        options: [
            "React",
            "TypeScript",
            "Node.js",
            "GraphQL",
            "Python",
            "Figma",
            "SQL",
            "AWS",
            "Communication",
            "Leadership",
        ],
    },
    {
        key: "address.city",
        label: "City",
        type: "select",
        options: [
            "San Francisco",
            "New York",
            "Chicago",
            "Austin",
            "Seattle",
            "Boston",
            "Denver",
            "Atlanta",
        ],
    },
    {
        key: "isActive",
        label: "Is Active",
        type: "boolean",
    },
];
