from django.db import models

# Create your models here.

class Booking(models.Model):
    SESSION_TYPES = [
        ('portrait', 'Portrait'),
        ('wedding', 'Wedding'),
        ('family', 'Family'),
        ('event', 'Event'),
        ('birthday', 'Birthday'),

    ]

    full_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=15)
    session_type = models.CharField(max_length=20, choices=SESSION_TYPES)
    details = models.TextField(blank=True, null=True)  # Optional details
    booking_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.full_name} - {self.session_type} on {self.booking_date}"

