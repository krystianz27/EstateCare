from django.contrib.auth import get_user_model
from django.contrib.contenttypes.models import ContentType
from django.db.models import F
from rest_framework import serializers
from taggit.models import Tag
from taggit.serializers import TaggitSerializer, TagListSerializerField

from core_apps.common.models import ContentView
from core_apps.posts.models import Post, Reply

User = get_user_model()


class ReplySerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")
    post = serializers.PrimaryKeyRelatedField(read_only=True)
    avatar = serializers.ReadOnlyField(source="author.profile.avatar.url")

    class Meta:
        model = Reply
        fields = [
            "id",
            "post",
            "author_username",
            "avatar",
            "body",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "id",
            "post",
            "author_username",
            "avatar",
            "created_at",
            "updated_at",
        ]


class BasePostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="author.username")
    is_bookmarked = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    updated_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)
    view_count = serializers.SerializerMethodField()
    is_upvoted = serializers.SerializerMethodField()
    replies_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "author_username",
            "avatar",
            "is_bookmarked",
            "created_at",
            "updated_at",
            "view_count",
            "upvotes",
            "downvotes",
            "is_upvoted",
            "replies_count",
            "avatar",
        ]
        read_only_fields = [
            "id",
            "slug",
            "author_username",
            "avatar",
            "created_at",
            "updated_at",
            "upvotes",
            "downvotes",
            "view_count",
            "is_upvoted",
            "is_bookmarked",
            "replies_count",
        ]

    def get_is_bookmarked(self, obj: Post) -> bool:
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.bookmarked_by.filter(id=user.id).exists()
        return False

    def get_view_count(self, obj: Post) -> int:
        content_type = ContentType.objects.get_for_model(obj)
        return ContentView.objects.filter(
            content_type=content_type, object_id=obj.pkid
        ).count()

    def get_is_upvoted(self, obj: Post) -> bool:
        user = self.context["request"].user
        if user.is_authenticated:
            return obj.upvoted_by.filter(id=user.id).exists()
        return False

    def get_replies_count(self, obj: Post) -> int:
        return obj.replies.all().count()


class PostSerializer(TaggitSerializer, BasePostSerializer):
    tags = TagListSerializerField()
    replies = ReplySerializer(many=True, read_only=True)

    class Meta(BasePostSerializer.Meta):
        fields = BasePostSerializer.Meta.fields + ["body", "tags", "replies"]

    def create(self, validated_data) -> Post:
        tags = validated_data.pop("tags")
        user = self.context["request"].user
        post = Post.objects.create(author=user, **validated_data)
        post.tags.set(tags)
        return post

    def update(self, instance, validated_data) -> Post:
        tags = validated_data.pop("tags", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if tags is not None:
            instance.tags.set(tags)
        instance.save()
        return instance


class TopPostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source="user.username")
    replies_count = serializers.IntegerField(read_only=True)
    view_count = serializers.IntegerField(read_only=True)
    avatar = serializers.ReadOnlyField(source="author.profile.avatar.url")
    created_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "author_username",
            "avatar",
            "upvotes",
            "replies_count",
            "view_count",
            "avatar",
            "created_at",
        ]


class VotePostSerializer(serializers.ModelSerializer):
    is_upvote = None

    class Meta:
        model = Post
        fields = []

    def update(self, instance: Post, validated_data) -> Post:
        user = self.context["request"].user
        counter_fields = {
            "upvoted_by": "upvotes",
            "downvoted_by": "downvotes",
        }

        opposite_field = "downvoted_by" if self.is_upvote else "upvoted_by"
        field = "upvoted_by" if self.is_upvote else "downvoted_by"

        opposite_counter = counter_fields[opposite_field]
        field_counter = counter_fields[field]

        if user in getattr(instance, opposite_field).all():
            getattr(instance, opposite_field).remove(user)
            setattr(instance, opposite_counter, F(opposite_counter) - 1)

        if user not in getattr(instance, field).all():
            getattr(instance, field).add(user)
            setattr(instance, field_counter, F(field_counter) + 1)
        else:
            getattr(instance, field).remove(user)
            setattr(instance, field_counter, F(field_counter) - 1)

        instance.save()
        instance.refresh_from_db()
        return instance


class UpvotePostSerializer(VotePostSerializer):
    is_upvote = True


class DownvotePostSerializer(VotePostSerializer):
    is_upvote = False


# class UpvotePostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Post
#         fields = []

#     def update(self, instance: Post, validated_data) -> Post:
#         user = self.context["request"].user

#         if user in instance.downvoted_by.all():
#             instance.downvoted_by.remove(user)
#             instance.downvotes = F("downvotes") - 1

#         if user not in instance.upvoted_by.all():
#             instance.upvoted_by.add(user)
#             instance.upvotes = F("upvotes") + 1
#         else:
#             instance.upvoted_by.remove(user)
#             instance.upvotes = F("upvotes") - 1

#         instance.save()
#         instance.refresh_from_db()
#         return instance


# class DownvotePostSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Post
#         fields = []

#     def update(self, instance: Post, validated_data) -> Post:
#         user = self.context["request"].user

#         if user in instance.upvoted_by.all():
#             instance.upvoted_by.remove(user)
#             instance.upvotes = F("upvotes") - 1

#         if user not in instance.downvoted_by.all():
#             instance.downvoted_by.add(user)
#             instance.downvotes = F("downvotes") + 1

#         else:
#             instance.downvoted_by.remove(user)
#             instance.downvotes = F("downvotes") - 1

#         instance.save()
#         instance.refresh_from_db()
#         return instance


class PostByTagSerializer(TaggitSerializer, BasePostSerializer):
    tags = TagListSerializerField()

    class Meta(BasePostSerializer.Meta):
        fields = BasePostSerializer.Meta.fields + ["body", "tags"]


class PopularTagSerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Tag
        fields = ["name", "slug", "post_count"]
