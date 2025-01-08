import { ApartmentData, ApartmentResponse } from "@/types";
import { baseApiSlice } from "../api/baseApiSlice";

export const apartmentApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyApartment: builder.query<ApartmentResponse, void>({
      query: () => "/apartments/my-apartment/",
      providesTags: ["Apartment"],
    }),
    createApartment: builder.mutation<ApartmentResponse, ApartmentData>({
      query: (formData) => ({
        url: "/apartments/add/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Apartment"],
    }),
  }),
});

export const { useGetMyApartmentQuery, useCreateApartmentMutation } =
  apartmentApiSlice;
