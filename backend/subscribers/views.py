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
def brevo_webhook(request):
    if request.method == 'POST':
        try:
            payload = json.loads(request.body)
            # Brevo webhook payload format:
            # {"event": "hard_bounce", "email": "user@example.com", "id": 12345, "date": "..."}
            
            event_type = payload.get('event')
            email = payload.get('email')
                
            if event_type in ['hard_bounce', 'spam'] and email:
                try:
                    subscriber = Subscriber.objects.get(email=email)
                    subscriber.is_active = False
                    if event_type == 'hard_bounce':
                        subscriber.is_bounced = True
                    elif event_type == 'spam':
                        subscriber.is_spam_complaint = True
                    subscriber.save()
                except Subscriber.DoesNotExist:
                    pass
            return JsonResponse({'status': 'ok'})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)
    return HttpResponse(status=405)
