import { UserData } from "./apartment";

interface ApartmentForContract {
  id: string;
  street: string;
  building_number: string | null;
  apartment_number: string | null;
  city: string;
  postal_code: string | null;
  country: string;
  owner: UserData;
}

export interface RentalContract {
  id: string;
  apartment: ApartmentForContract | null;
  owner: UserData;
  tenant: string;
  start_date: string;
  end_date: string;
  rent_amount: string;
  deposit: string;
  status: "active" | "expired" | "terminated";
}

export interface RentalContractsResponse {
  rental_contract: {
    count: number;
    next: string | null;
    previous: string | null;
    results: RentalContract[];
  };
}

export interface RentalContractResponse {
  rental_contract: RentalContract;
}

export interface RentalContractCreateData {
  apartment_id?: string;
  tenant: string;
  start_date: string;
  end_date: string;
  rent_amount?: string;
  deposit?: string;
  status: "active" | "expired" | "terminated";
}

export interface RentalContractQueryParams {
  page?: number;
  status?: string;
  apartment_id?: string;
}

// export interface RentalContractUpdateData {
//   apartment?: string | null; // ID mieszkania (opcjonalne, może być null)
//   tenant?: string;
//   start_date?: string;
//   end_date?: string;
//   rent_amount?: string;
//   deposit?: string;
//   status?: "active" | "expired" | "terminated";
// }
