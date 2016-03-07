from django.db import models

# Create your models here.

class Question(models.Model):
    title = models.CharField(max_length=100,blank=False,null=True)
    content = models.TextField(blank=False,null=True)
    answer = models.CharField(max_length=50,blank=False,null=True)
    points = models.IntegerField(default=0)
    root = models.BooleanField(default=False)
    leaf = models.BooleanField(default=False)
    success = models.IntegerField(default=0)
    fail = models.IntegerField(default=0)
    next = models.OneToOneField('self',blank=True,null=True)
    
    def __str__(self):
        return "Q."+str(self.pk)+") "+self.title
        
    def is_root(self):
        if self.root:
            return True
        else:
            return False
            
    def is_leaf(self):
        if self.leaf:
            return True
        else:
            return False