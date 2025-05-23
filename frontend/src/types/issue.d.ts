import { Apartment } from "./apartment";

export type ApartmentWithoutTenants = Omit<Apartment, "tenants">;

export interface Issue {
  id: string;
  apartment_unit: ApartmentWithoutTenants;
  reported_by: string;
  title: string;
  description: string;
  status: "reported" | "resolved" | "in_progress";
  priority: "low" | "medium" | "high";
  view_count: number;
  assigned_to?: string;
  estimated_repair_date?: string;
  repair_duration?: number;
}

export interface IssueData {
  title: string;
  description: string;
  status: "reported" | "resolved" | "in_progress";
  priority: "low" | "medium" | "high";
}

export interface IssueForApartmentResponse extends IssueData {
  id: string;
  resolved_on: string | null;
}

export interface ReportIssueData extends IssueData {
  apartmentId: string;
}

export interface UpdateIssueResponse {
  issue: {
    title: string;
    description: string;
    apartment: string;
    reported_by: string;
    status: "reported" | "resolved" | "in_progress";
    resolved_by: string;
    resolved_on: string;
    estimated_repair_date?: string;
    repait_duration?: number;
  };
}

export interface IssueResponse {
  issue: Issue;
}

export interface UpdateIssueData {
  issueId: string;
  status?: string;
  assigned_to?: string;
}

export interface MyIssuesResponse {
  my_issues: {
    count: number;
    next?: string;
    previous?: string;
    results: Issue[];
  };
}

export interface MyAssignedIssuesResponse {
  assigned_issues: {
    count: number;
    next?: string;
    previous?: string;
    results: Issue[];
  };
}
