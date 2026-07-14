from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from blog.models import Post
from subscribers.models import Subscriber
from django.template.loader import render_to_string
import requests
import os
import threading

BREVO_API_KEY = os.environ.get('BREVO_API_KEY', '')
BREVO_URL = 'https://api.brevo.com/v3/smtp/email'

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

def send_batch_emails_thread(post_id):
    try:
        post = Post.objects.get(pk=post_id)
        active_subscribers = list(Subscriber.objects.filter(is_active=True))
        
        if not active_subscribers or not BREVO_API_KEY:
            return

        site_url = os.environ.get('SITE_URL', 'https://valandai.com')
        post_url = f"{site_url}/blog/{post.slug}/"
        
        # Cover image URL is likely already absolute if using Google Cloud Storage
        cover_url = post.cover_image.url if post.cover_image else None
        if cover_url and not cover_url.startswith('http'):
            cover_url = f"{site_url}{cover_url}"
            
        from django.utils.html import strip_tags
        
        context = {
            'post_title': post.title,
            'post_snippet': strip_tags(post.content)[:150] + '...',
            'post_url': post_url,
            'post_image_url': cover_url
        }
        
        html_content = render_to_string('emails/new_post.html', context)
        
        message_versions = []
        
        for sub in active_subscribers:
            backend_url = "https://valandaicom-backend-211504890015.us-central1.run.app"
            unsubscribe_url = f"{backend_url}/api/subscribers/unsubscribe/{sub.unsubscribe_token}/"
            message_versions.append({
                "to": [{"email": sub.email}],
                "params": {
                    "UNSUBSCRIBE_URL": unsubscribe_url
                }
            })
            
        payload = {
            "sender": {"name": "ValAndAI", "email": "info@valandai.com"},
            "subject": f"New Post: {post.title}",
            "htmlContent": html_content,
            "messageVersions": message_versions
        }
        
        headers = {
            "Content-Type": "application/json",
            "api-key": BREVO_API_KEY
        }
        response = requests.post(BREVO_URL, headers=headers, json=payload)
        response.raise_for_status()
        print(f"Successfully sent Brevo broadcast! Status: {response.status_code}")
    except Exception as e:
        import traceback
        error_msg = f"Failed to send Brevo broadcast: {e}\n{traceback.format_exc()}"
        if 'response' in locals() and hasattr(response, 'text'):
            error_msg += f"\nBrevo Response: {response.text}"
        print(error_msg)
        
from django.db import transaction

@receiver(post_save, sender=Post)
def trigger_batch_emails(sender, instance, created, **kwargs):
    if instance.is_published and not getattr(instance, '_was_published', False):
        transaction.on_commit(
            lambda: threading.Thread(target=send_batch_emails_thread, args=(instance.pk,)).start()
        )
