import { baseApiSlice } from "../api/baseApiSlice";
import {
  DocumentResponse,
  MyDocumentsResponse,
  DocumentData,
  AddDocumentData,
  ShareOrRevokeDocumentRequest,
} from "@/types/document";

export const documentApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllDocuments: builder.query<
      MyDocumentsResponse,
      { page?: number; type?: string }
    >({
      query: (params = {}) => {
        const queryString = new URLSearchParams();
        if (params.page) {
          queryString.append("page", params.page.toString());
        }
        if (params.type) {
          queryString.append("type", params.type);
        }
        return `/documents/?${queryString.toString()}`;
      },
      providesTags: ["Document"],
    }),

    getMyDocuments: builder.query<
      MyDocumentsResponse,
      { page?: number; type?: string }
    >({
      query: (params = {}) => {
        const queryString = new URLSearchParams();
        if (params.type) {
          queryString.append("type", params.type.toString());
        }
        if (params.page) {
          queryString.append("page", params.page.toString());
        }
        return `/documents/?${queryString.toString()}`;
      },
      providesTags: ["Document"],
    }),

    createDocument: builder.mutation<DocumentResponse, AddDocumentData>({
      query: (documentData) => ({
        url: "/documents/",
        method: "POST",
        body: documentData,
      }),
      invalidatesTags: ["Document"],
    }),

    updateDocument: builder.mutation<
      DocumentResponse,
      { id: string; data: Partial<DocumentData> }
    >({
      query: ({ id, data }) => ({
        url: `/documents/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Document"],
    }),

    deleteDocument: builder.mutation<void, string>({
      query: (id) => ({
        url: `/documents/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Document"],
    }),

    shareDocument: builder.mutation<
      DocumentResponse,
      ShareOrRevokeDocumentRequest
    >({
      query: ({ id, shared_with }) => ({
        url: `/documents/${id}/share/`,
        method: "POST",
        body: { shared_with },
      }),
      invalidatesTags: ["Document"],
    }),

    RevokeShareDocument: builder.mutation<
      { document: { detail: string } },
      ShareOrRevokeDocumentRequest
    >({
      query: ({ id, shared_with }) => ({
        url: `/documents/${id}/revoke/`,
        method: "POST",
        body: { shared_with },
      }),
      invalidatesTags: ["Document"],
    }),
  }),
});

export const {
  useGetAllDocumentsQuery,
  useGetMyDocumentsQuery,
  useCreateDocumentMutation,
  useUpdateDocumentMutation,
  useDeleteDocumentMutation,
  useShareDocumentMutation,
} = documentApiSlice;
