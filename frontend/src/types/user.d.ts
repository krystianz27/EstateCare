export interface UserState {
  user: {
    searchTerm: string;
    page: number;
  };
}

export interface UserCommonData {
  email: string;
  password: string;
}

export interface UserResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
  slug: string;
  full_name: string;
  gender: string;
  occupation: string;
  phone_number: string;
  country: string;
  city: string;
  reputation: string;
  avatar: string;
  date_joined: string;
}

export interface User {
  first_name: string;
  last_name: string;
  email: string;
}
