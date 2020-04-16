from django.contrib import admin

# Register your models here.
from .models import Student, Group

admin.site.register(Student)
admin.site.register(Group)