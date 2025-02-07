from django.db.models import Model
from django.db.models.signals import m2m_changed
from django.dispatch import receiver

from .models import Post

# @receiver(m2m_changed, sender=Post.upvoted_by.through)
# def update_upvotes(sender: Model, instance: Post, action, **kwargs):
#     if action in ["post_add", "post_remove", "post_clear"]:
#         instance.upvotes = instance.upvoted_by.count()
#         instance.save()


# @receiver(m2m_changed, sender=Post.downvoted_by.through)
# def update_downvotes(sender: Model, instance: Post, action, **kwargs):
#     if action in ["post_add", "post_remove", "post_clear"]:
#         instance.downvotes = instance.downvoted_by.count()
#         instance.save()
