export interface ReplyData {
  body: string;
}

export interface ReplyPostData extends ReplyData {
  postId: string | undefined;
}

export interface ReplyResponse {
  reply: {
    id: string;
    post: number;
    author_username: string;
    body: string;
    created_at: string;
    updated_at: string;
  };
}
