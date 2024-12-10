from django.shortcuts import render
from .models import Photo

# Create your views here.
def index(request):
    context = {
        "photos" : Photo.objects.all().filter(featured=True)
    }
    return render(request, "pages/index.html", context)

def about(request):
    return render(request, "pages/about.html")
def services(request):
    return render(request, "pages/services.html")
def gallery(request):
    context = {
        "photos": Photo.objects.all()
    }
    return render(request, "pages/gallery.html", context)

# def gallery(request):
#     context = {
#         "images": Photo.objects.all()
#     }
#     return render(request, "")