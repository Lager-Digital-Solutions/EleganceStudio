from django.urls import path
from . import views

app_name = 'pages'

urlpatterns = [
    path("", views.index, name="index"),
    path("about", views.about, name="about"),
    path("services", views.services, name="services"),
    path("gallery", views.gallery, name="gallery"),

]
