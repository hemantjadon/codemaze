from django.conf.urls import url
from users.views import *

urlpatterns = [
    url(r'^$',HomePage,name='home_page'),
    url(r'^accounts/register/$',RegisterPage,name='register_page'),
]
