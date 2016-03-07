from django.shortcuts import render,redirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse,JsonResponse
from django.contrib.auth.decorators import login_required
from users.models import *
from questions.models import Question
from users.forms import CollegeForm
# Create your views here.

def HomePage(request):
    return render(request,"Home/homepage.html",{"contest":"notbegin"})

@login_required(login_url='/')
def RegisterPage(request):
    if request.method == 'GET':
        if request.user.registered == True:
            return redirect(reverse('questions_page'))
        colg_form = CollegeForm()
        return render(request,"Home/registerpage.html",{"colg_form":colg_form})
    elif request.method == 'POST':
        colg_form = CollegeForm(request.POST)
        
        if colg_form.is_valid():
            user = request.user
            college_name = colg_form.cleaned_data['college_name']
            ques = Question.objects.filter(root=True)[0]
            userProfile = UserProfile.objects.create(user=user,college=college_name,ques=ques)
            userProfile.save()
            user.registered = True
            user.save()
            return redirect(reverse('questions_page'))
        else:
            return render(request,"Home/registerpage.html",{"colg_form":colg_form})