import {
  IssueResponse,
  MyAssignedIssuesResponse,
  MyIssuesResponse,
  ReportIssueData,
  UpdateIssueData,
  UpdateIssueResponse,
} from "@/types";
import { baseApiSlice } from "../api/baseApiSlice";

export const issueApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyIssues: builder.query<MyIssuesResponse, void>({
      query: () => "/issues/me/",
      providesTags: ["Issue"],
    }),

    getMyAssignedIssues: builder.query<MyAssignedIssuesResponse, string>({
      query: () => "/issues/assigned/",
      providesTags: ["Issue"],
    }),

    getUserRelatedIssues: builder.query<
      MyIssuesResponse,
      { status?: string[]; page?: number }
    >({
      query: ({ status, page = 1 }) => {
        const params = new URLSearchParams();

        if (status) {
          status.forEach((s) => params.append("status", s));
        }

        params.append("page", page.toString());

        return `/issues/related/?${params.toString()}`;
      },
      providesTags: ["Issue"],
    }),

    getUserRelatedIssuesV2: builder.query<
      MyIssuesResponse,
      { status?: string; page?: number }
    >({
      query: ({ status, page = 1 }) => {
        const params = new URLSearchParams();

        if (status) {
          params.append("status", status);
        }

        params.append("page", page.toString());

        return `/issues/related/?${params.toString()}`;
      },
      providesTags: ["Issue"],
    }),

    getSingleIssue: builder.query<IssueResponse, string>({
      query: (issueId) => `/issues/${issueId}/`,
      providesTags: ["Issue"],
    }),

    reportIssue: builder.mutation<IssueResponse, ReportIssueData>({
      query: (issueData) => ({
        url: "/issues/create/",
        method: "POST",
        body: issueData,
      }),
      invalidatesTags: ["Issue"],
    }),

    updateIssue: builder.mutation<UpdateIssueResponse, UpdateIssueData>({
      query: ({ issueId, ...issueData }) => ({
        url: `/issues/update/${issueId}/`,
        method: "PATCH",
        body: issueData,
      }),
      invalidatesTags: ["Issue"],
    }),

    deleteIssue: builder.mutation<void, string>({
      query: (issueId) => ({
        url: `/issues/delete/${issueId}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Issue"],
    }),
  }),
});

export const {
  useReportIssueMutation,
  useDeleteIssueMutation,
  useGetMyIssuesQuery,
  useGetUserRelatedIssuesQuery,
  useGetUserRelatedIssuesV2Query,
  useGetSingleIssueQuery,
  useGetMyAssignedIssuesQuery,
  useUpdateIssueMutation,
} = issueApiSlice;
