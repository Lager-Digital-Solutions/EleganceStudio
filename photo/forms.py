from django import forms
from .models import Booking

class BookingForm(forms.ModelForm):
    class Meta:
        model = Booking
        fields = ['full_name', 'email', 'phone', 'session_type', 'details', 'booking_date']
        widgets = {
            'booking_date': forms.DateInput(attrs={'type': 'date'}),
        }
