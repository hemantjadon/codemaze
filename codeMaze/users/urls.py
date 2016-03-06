from django.conf.urls import url
from users.views import HomePage

urlpatterns = [
    url(r'^',HomePage,name='home_page')
    
]
