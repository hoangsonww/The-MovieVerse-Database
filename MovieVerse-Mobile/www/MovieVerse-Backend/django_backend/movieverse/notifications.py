from celery import shared_task
from django.core.mail import send_mail


@shared_task
def send_review_notification_email(user_email):
    send_mail(
        'Your Review is Posted',
        'Thank you for submitting your review. It is now live on our site.',
        'info@movie-verse.com',
        [user_email],
        fail_silently=False,
    )
