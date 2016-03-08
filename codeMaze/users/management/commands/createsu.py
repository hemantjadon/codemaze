from django.core.management.base import BaseCommand
from users.models import AuthUser

class Command(BaseCommand):

    def handle(self, *args, **options):
        if not AuthUser.objects.filter(username="admin").exists():
            AuthUser.objects.create_superuser(username="admin", email='a@a.com',password='admin1234')