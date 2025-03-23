import { baseApiSlice } from "@/lib/redux/features/api/baseApiSlice";
import {
  ActivateUserData,
  CreateUserByEmailData,
  CreateUserByEmailResponse,
  LoginResponse,
  LoginUserData,
  RegisterUserData,
  RegisterUserResponse,
  ResetPasswordConfirmData,
  ResetPasswordData,
  SocialAuthArgs,
  SocialAuthResponse,
  UserResponse,
} from "@/types/index";

export const authApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loginUser: builder.mutation<LoginResponse, LoginUserData>({
      query: (loginData) => ({
        url: "/auth/login/",
        method: "POST",
        body: loginData,
      }),
    }),

    logoutUser: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout/",
        method: "POST",
      }),
    }),

    registerUser: builder.mutation<RegisterUserResponse, RegisterUserData>({
      query: (userData) => ({
        url: "/auth/users/",
        method: "POST",
        body: userData,
      }),
    }),

    createUserByEmail: builder.mutation<
      CreateUserByEmailResponse,
      CreateUserByEmailData
    >({
      query: (userData) => ({
        url: "/auth/register-by-email/",
        method: "POST",
        body: userData,
      }),
    }),

    activateUser: builder.mutation<void, ActivateUserData>({
      query: (loginData) => ({
        url: "/auth/users/activation/",
        method: "POST",
        body: loginData,
      }),
    }),

    resetPasswordRequest: builder.mutation<void, ResetPasswordData>({
      query: (formData) => ({
        url: "/auth/users/reset_password/",
        method: "POST",
        body: formData,
      }),
    }),

    resetPasswordConfirm: builder.mutation<void, ResetPasswordConfirmData>({
      query: (formData) => ({
        url: "/auth/users/reset_password_confirm/",
        method: "POST",
        body: formData,
      }),
    }),

    refreshJWT: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/refresh/",
        method: "POST",
      }),
    }),

    getUser: builder.query<UserResponse, void>({
      query: () => "/auth/users/me/",
    }),

    socialAuthentication: builder.mutation<SocialAuthResponse, SocialAuthArgs>({
      query: ({ provider, state, code }) => {
        const params = new URLSearchParams({ state, code });
        return {
          url: `/auth/o/${provider}/?${params.toString()}`,
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };
      },
    }),
  }),
});

export const {
  useSocialAuthenticationMutation,
  useActivateUserMutation,
  useLoginUserMutation,
  useLogoutUserMutation,
  useGetUserQuery,
  useRegisterUserMutation,
  useCreateUserByEmailMutation,
  useResetPasswordConfirmMutation,
  useResetPasswordRequestMutation,
  useRefreshJWTMutation,
} = authApiSlice;
