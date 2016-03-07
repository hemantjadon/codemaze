from django.conf.urls import url
from questions.views import *

urlpatterns = [
    url(r'^$',QuestionsPage,name='questions_page'),
    url(r'^get/$',QuestionGet,name='question_get'),
    url(r'^submit/$',QuestionSubmit,name='question_submit'),
]