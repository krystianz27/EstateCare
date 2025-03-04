import { IssueForApartmentResponse } from "./issue";

export interface ApartmentData {
  street?: string;
  building_number?: string | null;
  apartment_number?: string | null;
  city?: string;
  postal_code?: string | null;
  country?: string;
}

export interface UserData {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
}

export interface Apartment {
  id: string;
  street: string;
  building_number: string | null;
  apartment_number: string | null;
  city: string;
  postal_code: string | null;
  country: string;
  owner: UserData;
  tenants: UserData[];
  issues: IssueForApartmentResponse[];
}

export interface ApartmentResponse {
  apartment: Apartment;
}

export interface ApartmentsResponse {
  apartment: {
    count: number;
    next: null | string;
    previous: null | string;
    results: Apartment[];
  };
}

export interface TenantUpdateData {
  add?: string[];
  remove?: string[];
}
