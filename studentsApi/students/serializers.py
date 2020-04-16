
from rest_framework import serializers
from .models import Student, Group



class StudentSerializer(serializers.ModelSerializer):
  class Meta:
    model = Student
    fields = ('id', 'username', 'created_at', 'group')

class GroupSerializer(serializers.ModelSerializer):
  class Meta:
    model = Group
    fields = ('id', 'name', 'description')