import {
  RentalContractsResponse,
  RentalContractResponse,
  RentalContractCreateData,
  RentalContractQueryParams,
} from "@/types";
import { baseApiSlice } from "../api/baseApiSlice";

export const rentalContractApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllRentalContracts: builder.query<
      RentalContractsResponse,
      RentalContractQueryParams
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params.page) queryParams.append("page", params.page.toString());
        if (params.status) queryParams.append("status", params.status);
        if (params.apartment_id)
          queryParams.append("apartment_id", params.apartment_id);

        return `/apartments/rental-contracts/?${queryParams.toString()}`;
      },
      providesTags: ["RentalContract"],
    }),

    getRentalContractById: builder.query<RentalContractResponse, string>({
      query: (id) => `/apartments/rental-contracts/${id}/`,
      providesTags: ["RentalContract"],
    }),

    createRentalContract: builder.mutation<
      RentalContractResponse,
      RentalContractCreateData
    >({
      query: (formData) => ({
        url: "/apartments/rental-contracts/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["RentalContract"],
    }),

    updateRentalContract: builder.mutation<
      RentalContractResponse,
      { id: string; data: Partial<RentalContractCreateData> }
    >({
      query: ({ id, data }) => ({
        url: `/apartments/rental-contracts/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["RentalContract"],
    }),

    deleteRentalContract: builder.mutation<void, string>({
      query: (id) => ({
        url: `/apartments/rental-contracts/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["RentalContract"],
    }),
  }),
});

export const {
  useGetAllRentalContractsQuery,
  useGetRentalContractByIdQuery,
  useCreateRentalContractMutation,
  useUpdateRentalContractMutation,
  useDeleteRentalContractMutation,
} = rentalContractApiSlice;
