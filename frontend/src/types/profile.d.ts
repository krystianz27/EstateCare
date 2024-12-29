export interface Profile {
  id: string;
  slug: string;
  first_name: string;
  last_name: string;
  username: string;
  full_name: string;
  gender: "male" | "female" | "other";
  country_of_origin: string;
  city_of_origin: string;
  bio?: string;
  occupation:
    | "mason"
    | "carpenter"
    | "plumber"
    | "roofer"
    | "painter"
    | "electrician"
    | "gardener"
    | "hvac"
    | "tenant";
  reputation: number;
  date_joined: string;
  avatar?: string;
  average_rating: number;
  apartment: {
    id: string;
    created_at: string;
    unit_number: string;
    building: string;
    floor: number;
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

export interface ProfileData {
  first_name: string;
  last_name: string;
  username: string;
  gender: "male" | "female" | "other";
  bio?: string;
  country_of_origin: string;
  city_of_origin: string;
  occupation:
    | "mason"
    | "carpenter"
    | "plumber"
    | "roofer"
    | "painter"
    | "electrician"
    | "gardener"
    | "hvac"
    | "tenant";
  phone_number: string;
}

export type Occupation =
  | "mason"
  | "carpenter"
  | "plumber"
  | "roofer"
  | "painter"
  | "electrician"
  | "gardener"
  | "hvac"
  | "tenant";

export interface NonTenantResponse {
  non_tenant_profiles: {
    count: number;
    next?: string;
    previous?: string;
    results: Profile[];
  };
}
