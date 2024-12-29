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

export interface User {
  first_name: string;
  last_name: string;
  email: string;
}
