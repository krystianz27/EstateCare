interface PopularTag {
  name: string;
  slug: string;
  post_count: number;
}

export interface PopularTagResponse {
  popular_tags: {
    count: number;
    next: null | string;
    previous: null | string;
    results: PopularTag[];
  };
}
