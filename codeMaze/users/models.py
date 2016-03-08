from django.db import models
from django.contrib.auth.models import AbstractUser
from questions.models import Question
# Create your models here.

class AuthUser(AbstractUser):#---------------------Deriving User Model For Future If ever necessary to add new fields
    registered = models.BooleanField(default=False)
    def get_full_name(self):
        return self.first_name+ " "+self.last_name

    def __str__(self):
        return "@%s"%super(AuthUser,self).__str__()


class UserProfile(models.Model):#-------------------Profile Of User
    user = models.OneToOneField(AuthUser,blank=False,related_name='user_profile')
    college = models.CharField(max_length=50,blank=False,null=True)
    ques =  models.ForeignKey(Question,blank=False,null=True)
    time_counter = models.IntegerField(default=0)
    points = models.IntegerField(default=0)
    def __str__(self):
        return "%s's Profile"%self.user.__str__()
    class Meta:
        ordering = ['-points']