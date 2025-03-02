export type ChatUser = {
  uuid: string;
  username: string;
  avatar: string | null;
};

export type ChatApartment = {
  uuid: string;
  apartment: {
    id: string;
    name?: string;
  };
  members: ChatUser[];
};

export type PrivateMessage = {
  uuid: string;
  sender: ChatUser;
  content: string;
  created_at: string;
  read: boolean;
};

export interface PrivateMessageResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PrivateMessage[];
}

export type ApartmentMessage = {
  uuid: string;
  sender: ChatUser;
  content: string;
  created_at: string;
  read: boolean;
};

export interface ApartmentMessageResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ApartmentMessage[];
}
