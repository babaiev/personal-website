from django.shortcuts import get_object_or_404, render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import json
from .models import Subscriber

from django.core.management import call_command
import os

class SubscribeView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        subscriber, created = Subscriber.objects.get_or_create(email=email)
        if not created and not subscriber.is_active:
            subscriber.is_active = True
            subscriber.save()
            return Response({'message': 'Resubscribed successfully'}, status=status.HTTP_200_OK)
        
        return Response({'message': 'Subscribed successfully'}, status=status.HTTP_201_CREATED)

def unsubscribe(request, token):
    subscriber = get_object_or_404(Subscriber, unsubscribe_token=token)
    
    if request.method == 'POST':
        subscriber.is_active = False
        subscriber.save()
        return render(request, 'subscribers/unsubscribe_success.html', {'email': subscriber.email})
    
    return render(request, 'subscribers/unsubscribe_confirm.html', {'subscriber': subscriber})

@csrf_exempt
def mailersend_webhook(request):
    if request.method == 'POST':
        try:
            payload = json.loads(request.body)
            # MailerSend webhook payload format:
            # {"events": [{"type": "activity.bounced", "data": {"email": {"recipient": {"email": "..."}}}}, ...]}
            # Or simpler: the 'type' is at root depending on webhook version, but let's parse safely
            events = payload.get('events', [payload])
            
            for event in events:
                event_type = event.get('type')
                
                # Try to extract email from nested data
                email = None
                try:
                    email = event.get('data', {}).get('email', {}).get('recipient', {}).get('email')
                except AttributeError:
                    pass
                
                # Fallback if structure differs
                if not email and 'email' in event:
                    email = event['email']
                    
                if event_type in ['activity.bounced', 'activity.spam_complaint'] and email:
                    try:
                        subscriber = Subscriber.objects.get(email=email)
                        subscriber.is_active = False
                        if event_type == 'activity.bounced':
                            subscriber.is_bounced = True
                        elif event_type == 'activity.spam_complaint':
                            subscriber.is_spam_complaint = True
                        subscriber.save()
                    except Subscriber.DoesNotExist:
                        pass
            return JsonResponse({'status': 'ok'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return HttpResponse(status=405)
