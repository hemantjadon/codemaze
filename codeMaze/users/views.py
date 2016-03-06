from django.shortcuts import render

# Create your views here.

def HomePage(request):
    return render(request,"Home/homepage.html",{"contest":"notbegin"})