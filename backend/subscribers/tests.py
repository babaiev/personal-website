from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from .models import Subscriber

class SubscriberModelTests(TestCase):
    def test_subscriber_str(self):
        sub = Subscriber.objects.create(email="test@test.com")
        self.assertEqual(str(sub), "test@test.com (Active)")

class SubscriberAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_create_subscriber(self):
        response = self.client.post('/api/subscribers/', {'email': 'new@test.com'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Subscriber.objects.count(), 1)
        self.assertEqual(Subscriber.objects.first().email, 'new@test.com')

    def test_create_duplicate_subscriber(self):
        Subscriber.objects.create(email="duplicate@test.com")
        response = self.client.post('/api/subscribers/', {'email': 'duplicate@test.com'})
        # Our view returns 201 for duplicates that are already active
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Subscriber.objects.count(), 1)
