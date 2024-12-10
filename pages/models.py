from django.db import models

# Create your models here.
class Photo(models.Model):
    title = models.CharField(max_length=50)
    image = models.ImageField(upload_to="images")
    featured = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title}"