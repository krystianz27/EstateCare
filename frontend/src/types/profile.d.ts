export interface Occupation {
  id: string;
  name: string;
}

export interface Profile {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  username: string;
  full_name: string;
  phone_number: string;
  gender: "male" | "female" | "other";
  country_of_origin: string;
  city_of_origin: string;
  bio?: string;
  occupations: Occupation[];
  reputation: number;
  date_joined: string;
  avatar?: string;
  average_rating: number;
  apartment: {
    id: string;
    street: string;
    building_number: string;
    apartment_number: string;
    city: string;
    postal_code: string;
    country: string;
  } | null;
}

export interface ProfileResponse {
  profile: Profile;
}

export interface ProfilesResponse {
  profiles: {
    count: number;
    next?: string;
    previous?: string;
    results: Profile[];
  };
}

export interface ProfileUpdateData {
  first_name: string;
  last_name: string;
  username: string;
  gender: "male" | "female" | "other";
  bio?: string;
  country_of_origin: string;
  city_of_origin: string;
  occupations_input: string;
  phone_number: string;
  occupations_input: string;
}

export interface ProfileUpdateResponse {
  first_name: string;
  last_name: string;
  username: string;
  gender: "male" | "female" | "other";
  bio?: string;
  country_of_origin: string;
  city_of_origin: string;
  occupations: string;
  phone_number: string;
}

export interface Tenant {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  full_name: string;
  phone_number: string | null;
  gender: "male" | "female" | "other";
  country_of_origin: string;
  city_of_origin: string;
  date_joined: string;
  avatar?: string | null;
  apartment: {
    id: string;
    street: string;
    building_number: string;
    apartment_number: string;
    city: string;
    postal_code: string;
    country: string;
  } | null;
}

export interface TenantsResponse {
  profiles: {
    count: number;
    next?: string;
    previous?: string;
    results: Tenant[];
  };
}

export interface NonTenantResponse {
  non_tenant_profiles: {
    count: number;
    next?: string;
    previous?: string;
    results: Profile[];
  };
}
