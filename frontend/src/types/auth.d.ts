import { UserCommonData } from "./user";
import { Profile } from "./profile";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface LoginUserData {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
}

export interface RegisterUserData extends UserCommonData {
  username: string;
  first_name: string;
  last_name: string;
  re_password: string;
}

export interface RegisterUserResponse {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface ActivateUserData {
  uid: string;
  token: string;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
}

export interface ResetPasswordConfirmData extends ActivateUserData {
  new_password: string;
  re_new_password: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface SocialAuthArgs {
  provider: string;
  state: string;
  code: string;
}

export interface SocialAuthResponse {
  message: string;
  user: Profile;
}

export interface CreateUserByEmailData {
  email: string;
  first_name?: string;
  last_name?: string;
  apartmentId: string;
}

export interface CreateUserByEmailResponse {
  message: string;
}
