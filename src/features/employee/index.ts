// Employee feature - Public exports

// Components
export { default as EmployeeListPage } from './components/EmployeeListPage';
export { default as CreateEmployeePage } from './components/CreateEmployeePage';
export { default as EmployeeProfilePage } from './components/EmployeeProfilePage';

// Hooks
export { useEmployee } from './hooks/useEmployee';
export { useEmployeeProfile } from './hooks/useEmployeeProfile';
export { useCreateEmployee } from './hooks/useCreateEmployee';

// Types - Export actual types from types/index.ts
// Note: CreateEmployeeRequest is the actual type used for creating employees
export type { Employee, EmployeeProfile, CreateEmployeeRequest, CreateEmployeeResponse, EmployeeFilter } from './types';

// API (if needed directly)
// export * from './api';
