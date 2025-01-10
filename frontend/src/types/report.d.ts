interface Report {
  id: string;
  title: string;
  description: string;
  created_at: string;
}

export interface MyReportsResponse {
  reports: {
    count: number;
    next: null | string;
    previous: null | string;
    results: Report[];
  };
}

export interface ReportTenantData {
  title: string;
  description: string;
  reported_user_username: string;
}

export interface ReportTenantResponse {
  report: Report;
}
