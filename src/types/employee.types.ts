export interface Employee {
    id: number;
    name: string;
    email: string;
    department: string;
    role: string;
    salary: number;
    joinDate: string;
    isActive: boolean;
    skills: string[];
    address: {
        city: string;
        state: string;
        country: string;
    };
    projects: number;
    lastReview: string;
    performanceRating: number;
}
