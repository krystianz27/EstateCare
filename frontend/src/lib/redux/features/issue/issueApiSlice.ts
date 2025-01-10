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
      query: ({ issueId, ...statusData }) => ({
        url: `/issues/update/${issueId}/`,
        method: "PATCH",
        body: statusData,
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
  useGetSingleIssueQuery,
  useGetMyAssignedIssuesQuery,
  useUpdateIssueMutation,
} = issueApiSlice;
