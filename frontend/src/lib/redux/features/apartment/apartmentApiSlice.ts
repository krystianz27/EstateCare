import {
  ApartmentData,
  ApartmentResponse,
  ApartmentsResponse,
  TenantUpdateData,
  PaginationParams,
  Apartment,
} from "@/types";
import { baseApiSlice } from "../api/baseApiSlice";

export const apartmentApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyApartments: builder.query<ApartmentsResponse, PaginationParams>({
      query: ({ page } = {}) => {
        const queryString = new URLSearchParams();

        if (page) {
          queryString.append("page", page.toString());
        }

        return `/apartments/?type=owner&${queryString.toString()}`;
      },
      providesTags: ["Apartment"],
    }),

    getMyRentedApartments: builder.query<ApartmentsResponse, PaginationParams>({
      query: ({ page } = {}) => {
        const queryString = new URLSearchParams();

        if (page) {
          queryString.append("page", page.toString());
        }

        return `/apartments/?type=tenant&${queryString.toString()}`;
      },
      providesTags: ["Apartment"],
    }),
    // This is supposed to use DRF pagination
    // getAllMyApartments: builder.query<ApartmentsResponse, PaginationParams>({
    //   queryFn: async ({ page = 1 }: PaginationParams, api, extraOptions) => {
    //     try {
    //       let allApartments: Apartment[] = [];
    //       let currentPage = page;
    //       let hasNextPage = true;

    //       while (hasNextPage) {
    //         const queryString = new URLSearchParams();
    //         queryString.append("page", currentPage.toString());

    //         const response = await fetch(
    //           `/apartments/?${queryString.toString()}`,
    //         );
    //         const data: ApartmentsResponse = await response.json();

    //         allApartments = [...allApartments, ...data.apartment.results];
    //         hasNextPage = Boolean(data.apartment.next);
    //         currentPage += 1;
    //       }

    //       return {
    //         data: {
    //           apartment: {
    //             results: allApartments,
    //             next: null,
    //             previous: null,
    //             count: allApartments.length,
    //           },
    //         },
    //       };
    //     } catch (error: unknown) {
    //       return {
    //         error: {
    //           status: "FETCH_ERROR",
    //           error:
    //             error instanceof Error
    //               ? error.message
    //               : "Failed to fetch apartments",
    //         } as FetchBaseQueryError,
    //       };
    //     }
    //   },
    //   providesTags: ["Apartment"],
    // }),

    getAllMyApartments: builder.query<ApartmentsResponse, PaginationParams>({
      query: ({ page = 1 }: PaginationParams) => {
        const queryString = new URLSearchParams();
        queryString.append("page", page.toString());

        return `/apartments/?${queryString.toString()}`;
      },
      transformResponse: async (initialResponse: ApartmentsResponse) => {
        let allApartments: Apartment[] = [...initialResponse.apartment.results];

        let currentPage = 1;
        const totalPages = Math.ceil(initialResponse.apartment.count / 10); // 10 to przykładowa liczba wyników na stronę

        while (currentPage < totalPages) {
          currentPage += 1;

          const queryString = new URLSearchParams();
          queryString.append("page", currentPage.toString());

          const response = await fetch(
            `/api/v1/apartments/?${queryString.toString()}`,
          );
          const data: ApartmentsResponse = await response.json();

          allApartments = [...allApartments, ...data.apartment.results];
        }

        return {
          apartment: {
            results: allApartments,
            next: null,
            previous: null,
            count: allApartments.length,
          },
        };
      },
      providesTags: ["Apartment"],
    }),

    getApartmentById: builder.query<ApartmentResponse, string>({
      query: (id) => `/apartments/${id}/`,
      providesTags: ["Apartment"],
    }),

    createApartment: builder.mutation<ApartmentResponse, ApartmentData>({
      query: (formData) => ({
        url: "/apartments/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Apartment"],
    }),

    updateApartment: builder.mutation<
      ApartmentResponse,
      { id: string; data: ApartmentData }
    >({
      query: ({ id, data }) => ({
        url: `/apartments/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Apartment"],
    }),

    updateTenants: builder.mutation<
      ApartmentResponse,
      { id: string; tenantData: TenantUpdateData }
    >({
      query: ({ id, tenantData }) => ({
        url: `/apartments/${id}/tenants/`,
        method: "PATCH",
        body: tenantData,
      }),
      invalidatesTags: ["Apartment"],
    }),
  }),
});

export const {
  useGetMyApartmentsQuery,
  useGetMyRentedApartmentsQuery,
  useGetApartmentByIdQuery,
  useGetAllMyApartmentsQuery,
  useCreateApartmentMutation,
  useUpdateApartmentMutation,
  useUpdateTenantsMutation,
} = apartmentApiSlice;
