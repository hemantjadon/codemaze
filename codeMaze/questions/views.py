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
                if user_ques.next != Null:
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
    except:
        return JsonResponse({'error':'Some Error'})