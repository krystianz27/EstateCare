export interface ApartmentData {
  unit_number: string;
  building: string;
  floor: number;
}

export interface ApartmentResponse {
  apartment: {
    id: string;
    created_at: string;
    unit_number: string;
    building: string;
    floor: number;
  };
}
