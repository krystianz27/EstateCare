from django.urls import path

from .views import (
    BookmarkedPostListAPIView,
    BookmarkPostAPIView,
    DownvotePostAPIView,
    MyPostsListAPIView,
    PopularTagsListAPIView,
    PostCreateAPIView,
    PostDetailAPIView,
    PostListAPIView,
    PostsByTagListAPIView,
    PostUpdateAPIView,
    ReplyCreateAPIView,
    ReplyListAPIView,
    TopPostsListAPIView,
    UnBookmarkPostAPIView,
    UpvotePostAPIView,
)

urlpatterns = [
    path("top-posts/", TopPostsListAPIView.as_view(), name="top-posts"),
    path("popular-tags/", PopularTagsListAPIView.as_view(), name="popular-tags"),
    path("", PostListAPIView.as_view(), name="post-list"),
    path("create/", PostCreateAPIView.as_view(), name="post-create"),
    path("my-posts/", MyPostsListAPIView.as_view(), name="my-posts"),
    path(
        "bookmarked/posts/", BookmarkedPostListAPIView.as_view(), name="bookmarked-post"
    ),
    path("<slug:slug>/", PostDetailAPIView.as_view(), name="post-detail"),
    path("<slug:slug>/update/", PostUpdateAPIView.as_view(), name="post-update"),
    path("<slug:slug>/bookmark/", BookmarkPostAPIView.as_view(), name="bookmark-post"),
    path(
        "<slug:slug>/unbookmark/",
        UnBookmarkPostAPIView.as_view(),
        name="unbookmark-post",
    ),
    path("<uuid:post_id>/upvote/", UpvotePostAPIView.as_view(), name="upvote-post"),
    path(
        "<uuid:post_id>/downvote/", DownvotePostAPIView.as_view(), name="downvote-post"
    ),
    path("tags/<str:tag_slug>/", PostsByTagListAPIView.as_view(), name="posts-by-tag"),
    path("<uuid:post_id>/replies/", ReplyListAPIView.as_view(), name="reply-list"),
    path("<uuid:post_id>/reply/", ReplyCreateAPIView.as_view(), name="create-reply"),
]
