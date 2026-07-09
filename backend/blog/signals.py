from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from blog.models import Post
from subscribers.models import Subscriber, EmailNotificationQueue

@receiver(pre_save, sender=Post)
def capture_previous_published_state(sender, instance, **kwargs):
    if instance.pk:
        try:
            previous = Post.objects.get(pk=instance.pk)
            instance._was_published = previous.is_published
        except Post.DoesNotExist:
            instance._was_published = False
    else:
        instance._was_published = False

@receiver(post_save, sender=Post)
def queue_email_notifications(sender, instance, created, **kwargs):
    # Only trigger if it just became published
    if instance.is_published and not getattr(instance, '_was_published', False):
        active_subscribers = Subscriber.objects.filter(is_active=True)
        queue_items = [
            EmailNotificationQueue(subscriber=sub, post=instance, status='PENDING')
            for sub in active_subscribers
        ]
        if queue_items:
            EmailNotificationQueue.objects.bulk_create(queue_items)
