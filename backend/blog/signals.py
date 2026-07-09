from django.db.models.signals import pre_save, post_save
from django.dispatch import receiver
from blog.models import Post
from subscribers.models import Subscriber
from django.template.loader import render_to_string
import requests
import os
import threading

MAILERSEND_API_KEY = os.environ.get('MAILERSEND_API_KEY', '')
MAILERSEND_URL = 'https://api.mailersend.com/v1/email'

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
        # We can send to all active subscribers or chunk them. MailerSend Bulk API handles large volumes.
        active_subscribers = list(Subscriber.objects.filter(is_active=True))
        
        if not active_subscribers or not MAILERSEND_API_KEY:
            return

        site_url = os.environ.get('SITE_URL', 'https://val3r11.com')
        post_url = f"{site_url}/blog/{post.slug}/"
        
        context = {
            'post_title': post.title,
            'post_snippet': post.content[:150] + '...',
            'post_url': post_url,
            'post_image_url': f"{site_url}{post.cover_image.url}" if post.cover_image else None
            # Note: We do NOT pass unsubscribe_url here. It will be injected by MailerSend via {$unsubscribe_url}
        }
        
        html_content = render_to_string('emails/new_post.html', context)
        
        to_list = []
        personalization = []
        
        for sub in active_subscribers:
            to_list.append({"email": sub.email})
            unsubscribe_url = f"{site_url}/api/subscribers/unsubscribe/{sub.unsubscribe_token}/"
            personalization.append({
                "email": sub.email,
                "data": {
                    "unsubscribe_url": unsubscribe_url
                }
            })
            
        payload = {
            "from": {"name": "VAL3R11", "email": "info@val3r11.com"},
            "to": to_list,
            "subject": f"New Post: {post.title}",
            "html": html_content,
            "personalization": personalization
        }
        
        headers = {
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "Authorization": f"Bearer {MAILERSEND_API_KEY}"
        }
        response = requests.post(MAILERSEND_URL, headers=headers, json=payload)
        response.raise_for_status()
        print(f"Successfully sent MailerSend broadcast! Status: {response.status_code}")
    except Exception as e:
        import traceback
        error_msg = f"Failed to send MailerSend broadcast: {e}\n{traceback.format_exc()}"
        if 'response' in locals() and hasattr(response, 'text'):
            error_msg += f"\nMailerSend Response: {response.text}"
        print(error_msg)
        
@receiver(post_save, sender=Post)
def trigger_batch_emails(sender, instance, created, **kwargs):
    if instance.is_published and not getattr(instance, '_was_published', False):
        threading.Thread(target=send_batch_emails_thread, args=(instance.pk,)).start()
