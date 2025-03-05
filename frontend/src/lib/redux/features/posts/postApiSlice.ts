import {
  BookmarkedPostsResponse,
  BookmarkResponse,
  MyPostsResponse,
  PopularTagResponse,
  PostData,
  PostQueryParams,
  PostResponse,
  PostsByTagResponse,
  PostsResponse,
  ReplyPostData,
  ReplyResponse,
  TopPostsResponse,
  UpdatePostData,
  UpvoteDownvoteResponse,
} from "@/types";
import { baseApiSlice } from "../api/baseApiSlice";

export const postApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllPosts: builder.query<PostsResponse, PostQueryParams>({
      query: (params = {}) => {
        const queryString = new URLSearchParams();

        if (params.page) {
          queryString.append("page", params.page.toString());
        }
        return `/posts/?${queryString.toString()}`;
      },
      providesTags: ["Post"],
    }),

    getTopPosts: builder.query<TopPostsResponse, void>({
      query: () => "/posts/top-posts/",
      providesTags: ["Post"],
    }),

    getMyPosts: builder.query<MyPostsResponse, PostQueryParams>({
      query: (params = {}) => {
        const queryString = new URLSearchParams();

        if (params.page) {
          queryString.append("page", params.page.toString());
        }
        return `/posts/my-posts/?${queryString.toString()}`;
      },
      providesTags: ["Post"],
    }),

    getSinglePost: builder.query<PostResponse, string>({
      query: (postSlug) => `/posts/${postSlug}/`,
      providesTags: ["Post"],
    }),

    getPopularTags: builder.query<PopularTagResponse, void>({
      query: () => "/posts/popular-tags/",
      providesTags: ["Post"],
    }),

    getPostsByTag: builder.query<PostsByTagResponse, string>({
      query: (tagSlug) => `/posts/tags/${tagSlug}/`,
      providesTags: ["Post"],
    }),

    createPost: builder.mutation<PostResponse, PostData>({
      query: (postData) => ({
        url: "/posts/create/",
        method: "POST",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),

    updatePost: builder.mutation<PostResponse, UpdatePostData>({
      query: ({ postSlug, ...postData }) => ({
        url: `/posts/${postSlug}/update/`,
        method: "PATCH",
        body: postData,
      }),
      invalidatesTags: ["Post"],
    }),

    upvotePost: builder.mutation<UpvoteDownvoteResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/upvote/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Post"],
    }),

    downvotePost: builder.mutation<UpvoteDownvoteResponse, string>({
      query: (postId) => ({
        url: `/posts/${postId}/downvote/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Post"],
    }),

    replyToPost: builder.mutation<ReplyResponse, ReplyPostData>({
      query: ({ postId, ...replyData }) => ({
        url: `/posts/${postId}/reply/`,
        method: "POST",
        body: replyData,
      }),
      invalidatesTags: ["Post"],
    }),

    getAllReplies: builder.query<PostResponse, string>({
      query: (postId) => `/posts/${postId}/replies/`,
      providesTags: ["Post"],
    }),

    getAllMyBookmarks: builder.query<BookmarkedPostsResponse, void>({
      query: () => "/posts/bookmarked/posts/",
      providesTags: ["Post"],
    }),

    bookmarkPost: builder.mutation<BookmarkResponse, string>({
      query: (postSlug) => ({
        url: `/posts/${postSlug}/bookmark/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Post"],
    }),

    unBookmarkPost: builder.mutation<BookmarkResponse, string>({
      query: (postSlug) => ({
        url: `/posts/${postSlug}/unbookmark/`,
        method: "PATCH",
      }),
      invalidatesTags: ["Post"],
    }),
  }),
});

export const {
  useGetAllPostsQuery,
  useGetTopPostsQuery,
  useGetMyPostsQuery,
  useGetSinglePostQuery,
  useGetPopularTagsQuery,
  useGetPostsByTagQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useUpvotePostMutation,
  useDownvotePostMutation,
  useReplyToPostMutation,
  useGetAllRepliesQuery,
  useGetAllMyBookmarksQuery,
  useBookmarkPostMutation,
  useUnBookmarkPostMutation,
} = postApiSlice;
