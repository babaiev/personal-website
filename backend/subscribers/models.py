import uuid
from django.db import models

class Subscriber(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True, help_text="False if user unsubscribed or bounced")
    is_bounced = models.BooleanField(default=False)
    is_spam_complaint = models.BooleanField(default=False)
    unsubscribe_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-subscribed_at']

    def __str__(self):
        return f"{self.email} ({'Active' if self.is_active else 'Inactive'})"

class EmailNotificationQueue(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('SENT', 'Sent'),
        ('FAILED', 'Failed'),
    )
    subscriber = models.ForeignKey(Subscriber, on_delete=models.CASCADE, related_name='notifications')
    post = models.ForeignKey('blog.Post', on_delete=models.CASCADE, related_name='email_notifications')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    created_at = models.DateTimeField(auto_now_add=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['status']),
        ]

    def __str__(self):
        return f"To: {self.subscriber.email} - Post: {self.post.title[:20]} - {self.status}"

class DailyEmailCounter(models.Model):
    date = models.DateField(unique=True)
    count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.date}: {self.count} emails sent"
