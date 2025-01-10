export interface ApartmentData {
  unit_number: string;
  building: string;
  floor: number;
}

export interface Apartment {
  id: string;
  created_at: string;
  unit_number: string;
  building: string;
  floor: number;
}

export interface ApartmentResponse {
  apartments: {
    count: number;
    next: null | string;
    previous: null | string;
    results: Apartment[];
  };
}
