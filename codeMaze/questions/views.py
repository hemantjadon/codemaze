from django.shortcuts import render,redirect
from django.core.urlresolvers import reverse
from django.http import HttpResponse,JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_exempt, csrf_protect
from users.models import *
from questions.models import *
from django.conf import settings

# Create your views here.
@login_required(login_url='/')
def QuestionsPage(request):
    if request.user.registered:
        return render(request,'Questions/questionspage.html',{"contest":settings.CONTEST})
    else:
        return redirect(reverse('register_page'))

@csrf_exempt
def QuestionGet(request):
    if request.is_ajax():
        ques = request.user.user_profile.ques
        question = {}
        question['title'] = ques.title
        question['content'] = ques.content
        question['id'] = ques.pk
        question['success'] = ques.success
        question['fail'] = ques.fail
        return JsonResponse(question)

@csrf_exempt
def QuestionSubmit(request):
    if request.is_ajax():
        string = request.body.decode('utf-8')
        arr = string.split('&')
        form = {}
        for i in arr:
            secondary = i.split('=')
            form[secondary[0]] = secondary[1]
        
        try:
            id = form['id']
            ans = form['ans']
            user_ques = request.user.user_profile.ques
            if id == str(user_ques.pk):
                if ans == user_ques.answer:
                    user_ques.success += 1
                    user_ques.save()
                    request.user.user_profile.points += user_ques.points
                    if user_ques.next != None:
                        request.user.user_profile.ques = user_ques.next
                        request.user.user_profile.save()
                    else:
                        request.user.user_profile.save()
                    return JsonResponse({'status':'success',"message":"You got it right"});
                else:
                    user_ques.fail += 1
                    user_ques.save()
                    return JsonResponse({'status':'fail',"message":"Oops, this is not correct"});
            else:
                return JsonResponse({'error':'Submission to wrong question.'})
        except KeyError:
            return JsonResponse({'error':'Some Error'})
            

def GetLeaderBoard(request):
    users = UserProfile.objects.all()
    namelist = []
    for user in users:
        namelist.append(user.user.get_full_name())
    namelist=namelist[:10]
    return JsonResponse({"list":namelist});


import math

def GetStats(request):
    user_ques = request.user.user_profile.ques
    success = user_ques.success
    fail = user_ques.fail
    attempts = success+fail
    ac = success/attempts*100
    accuracy = math.ceil(ac*1000)/1000
    return JsonResponse({"success":success,"fail":fail,"attempts":attempts,"accuracy":accuracy})
    