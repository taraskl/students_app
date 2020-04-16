from django.db import models

# Create your models here.
class Group(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return '%s' % (self.name)

class Student(models.Model):
    username = models.CharField(max_length=200)
    created_at = models.DateTimeField(auto_now_add=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    def __str__(self):
        return '%s' % (self.username)