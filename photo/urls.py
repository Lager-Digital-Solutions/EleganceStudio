from django.urls import path
from . import views

app_name = 'photo'

urlpatterns = [
    path('', views.book_session, name='book_session'),
]
