import { baseApiSlice } from "../api/baseApiSlice";
import { PrivateMessageResponse, ApartmentMessageResponse } from "@/types";

export const chatApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getPrivateMessages: builder.query<
      PrivateMessageResponse,
      { receiver_uuid: string; page?: number }
    >({
      query: ({ receiver_uuid, page = 1 }) => {
        const queryString = new URLSearchParams();
        queryString.append("page", page.toString());
        return `/chat/private/${receiver_uuid}/?${queryString.toString()}`;
      },
      providesTags: ["PrivateMessage"],
    }),

    getApartmentMessages: builder.query<
      ApartmentMessageResponse,
      { apartment_uuid: string; page?: number }
    >({
      query: ({ apartment_uuid, page = 1 }) => {
        const queryString = new URLSearchParams();
        queryString.append("page", page.toString());
        return `/chat/apartment/${apartment_uuid}/?${queryString.toString()}`;
      },
      providesTags: ["ApartmentMessage"],
    }),
  }),
});

export const { useGetPrivateMessagesQuery, useGetApartmentMessagesQuery } =
  chatApiSlice;
