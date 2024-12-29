export interface RatingResponse {
  rating: {
    id: string;
    rating: number;
    comment: string;
  };
}

export interface RatingData {
  rated_user_username: string;
  rating: number;
  comment: string;
}
