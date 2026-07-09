import os
import json
import requests
from datetime import date
from django.core.management.base import BaseCommand
from django.template.loader import render_to_string
from django.utils import timezone
from subscribers.models import EmailNotificationQueue, DailyEmailCounter

BREVO_API_KEY = os.environ.get('BREVO_API_KEY', '')
BREVO_URL = 'https://api.brevo.com/v3/smtp/email'

class Command(BaseCommand):
    help = 'Processes the email notification queue and sends emails via Brevo'

    def handle(self, *args, **kwargs):
        self.stdout.write("Starting email queue processor...")
        
        if not BREVO_API_KEY:
            self.stderr.write("BREVO_API_KEY is not set. Exiting.")
            return

        today = date.today()
        counter, _ = DailyEmailCounter.objects.get_or_create(date=today)
        
        if counter.count >= 300:
            self.stdout.write(f"Daily limit reached ({counter.count}/300). Exiting.")
            return
            
        available_slots = 300 - counter.count
        pending_items = EmailNotificationQueue.objects.filter(status='PENDING').select_related('subscriber', 'post')[:available_slots]
        
        if not pending_items:
            self.stdout.write("No pending emails to send.")
            return

        emails_sent = 0
        
        for item in pending_items:
            post = item.post
            subscriber = item.subscriber
            
            # Prepare template context
            # We assume a base URL for unsubscribe link. Usually set via SITE_URL env var
            site_url = os.environ.get('SITE_URL', 'https://val3r11.com')
            unsubscribe_url = f"{site_url}/api/subscribers/unsubscribe/{subscriber.unsubscribe_token}/"
            post_url = f"{site_url}/blog/{post.slug}/"
            
            context = {
                'post_title': post.title,
                'post_snippet': post.content[:150] + '...',
                'post_url': post_url,
                'unsubscribe_url': unsubscribe_url,
                'post_image_url': f"{site_url}{post.cover_image.url}" if post.cover_image else None
            }
            
            html_content = render_to_string('emails/new_post.html', context)
            
            payload = {
                "sender": {"name": "VAL3R11", "email": "info@val3r11.com"},
                "to": [{"email": subscriber.email}],
                "subject": f"New Post: {post.title}",
                "htmlContent": html_content
            }
            
            headers = {
                "accept": "application/json",
                "api-key": BREVO_API_KEY,
                "content-type": "application/json"
            }
            
            try:
                response = requests.post(BREVO_URL, headers=headers, json=payload)
                if response.status_code in [200, 201, 202]:
                    item.status = 'SENT'
                    item.sent_at = timezone.now()
                    item.save()
                    emails_sent += 1
                else:
                    self.stderr.write(f"Failed to send to {subscriber.email}. Status: {response.status_code} Body: {response.text}")
                    item.status = 'FAILED'
                    item.save()
            except Exception as e:
                self.stderr.write(f"Error sending email: {e}")
                item.status = 'FAILED'
                item.save()
                
        # Update daily counter
        counter.count += emails_sent
        counter.save()
        
        self.stdout.write(f"Finished processing. Sent {emails_sent} emails today. (Total today: {counter.count}/300)")
