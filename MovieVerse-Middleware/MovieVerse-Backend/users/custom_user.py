from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    preferences = models.TextField()

    def __str__(self):
        return self.username
