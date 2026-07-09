from django.urls import path
from . import views

urlpatterns = [
    path('', views.SubscribeView.as_view(), name='subscribe'),
    path('unsubscribe/<uuid:token>/', views.unsubscribe, name='unsubscribe'),
    path('webhook/mailersend/', views.mailersend_webhook, name='mailersend_webhook'),
]
