export interface Reply {
  id: string;
  post: number;
  author_username: string;
  avatar: string;
  body: string;
  created_at: string;
  updated_at: string;
}

interface Post {
  id: string;
  title: string;
  slug: string;
  body: string;
  tags: string[];
  author_username: string;
  is_bookmarked: boolean;
  created_at: string;
  updated_at: string;
  view_count: number;
  upvotes: number;
  downvotes: number;
  is_upvoted: boolean;
  replies_count: number;
  avatar: string;
  replies: Reply[];
}

export interface PostData {
  title: string;
  tags: string[];
  body: string;
}

export interface MyPostsResponse {
  my_posts: {
    count: number;
    next: null | string;
    previous: null | string;
    results: Post[];
  };
}

export interface UpdatePostData {
  postSlug: string;
  title: string;
  body: string;
}

export interface PostState {
  post: {
    page: number;
  };
}

export interface PostsResponse {
  posts: {
    count: number;
    next: null | string;
    previous: null | string;
    results: Post[];
  };
}

export interface PostResponse {
  post: Post;
}

export interface PostsByTagResponse {
  posts_by_tag: {
    count: number;
    next: null | string;
    previous: null | string;
    results: Post[];
  };
}

interface TopPost {
  id: string;
  title: string;
  slug: string;
  author_username: string;
  upvotes: number;
  view_count: number;
  replies_count: number;
  avatar: string;
  created_at: string;
}

export interface TopPostsResponse {
  top_posts: {
    count: number;
    next: null | string;
    previous: null | string;
    results: TopPost[];
  };
}

export interface BookmarkResponse {
  message: string;
}

export interface BookmarkedPostsResponse {
  bookmarked_posts: {
    count: number;
    next: null | string;
    previous: null | string;
    results: Post[];
  };
}

export interface UpvoteDownvoteResponse {
  message: string;
}

export interface PostQueryParams {
  page?: number;
}
