from django import forms

class CollegeForm(forms.Form):
    college_name = forms.CharField(label='Name of Your College', max_length=100,required=True,
                                        widget=forms.TextInput(attrs={'class':'validate','id':'college_name'}))