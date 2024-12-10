from django.contrib import admin
from .models import *

# Register your models here.
class BookingAdmin(admin.ModelAdmin):
    list_display = [
        "full_name",
        "email",
        "phone",
        "session_type",
        "booking_date",
    ]

admin.site.register(Booking, BookingAdmin)

