from django.conf.urls import url
from questions.views import *

urlpatterns = [
    url(r'^$',QuestionsPage,name='questions_page'),
    url(r'^get/$',QuestionGet,name='question_get'),
    url(r'^submit/$',QuestionSubmit,name='question_submit'),
    url(r'^leaderboard/$',GetLeaderBoard,name='leader_board'),
    url(r'^stats/$',GetStats,name='get_stats'),
    url(r'^winpage/$',WinPage,name='win_page'),
]