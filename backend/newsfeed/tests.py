from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from .models import AINewsItem
from django.utils import timezone

class NewsfeedModelTests(TestCase):
    def test_article_str(self):
        item = AINewsItem.objects.create(
            title="AI takes over", link="http://test.com", source_name="TechCrunch", published_at=timezone.now(), summary="Summary"
        )
        self.assertEqual(str(item), "[TechCrunch] AI takes over")

class NewsfeedAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.item = AINewsItem.objects.create(
            title="News 1", link="http://news.com", source_name="Twitter", published_at=timezone.now(), summary="Summary"
        )

    def test_get_feed_items(self):
        response = self.client.get('/api/newsfeed/items/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], "News 1")
