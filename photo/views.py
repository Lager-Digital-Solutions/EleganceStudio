from django.core.mail import send_mail
from django.shortcuts import render, redirect
from .forms import BookingForm



def book_session(request):
    if request.method == 'POST':
        form = BookingForm(request.POST)
        if form.is_valid():
            booking = form.save()

            # Use the sender's email from the form as the "from" email
            sender_email = booking.email

            # Send email notification
            send_mail(
                subject='New Booking Received',
                message=(
                    f"Booking Details:\n\n"
                    f"Name: {booking.full_name}\n"
                    f"Email: {booking.email}\n"
                    f"Phone: {booking.phone}\n"
                    f"Session Type: {booking.session_type}\n"
                    f"Details: {booking.details}\n"
                    f"Date: {booking.booking_date}"
                ),
                from_email=sender_email,  # Sender's email from the form
                recipient_list=['kalibardapi@gmail.com'],  # Replace with your email
                fail_silently=False,
            )

            return render(request, 'photo/book_success.html', {'booking': booking})
    else:
        form = BookingForm()

    return render(request, 'photo/book.html', {'form': form})


